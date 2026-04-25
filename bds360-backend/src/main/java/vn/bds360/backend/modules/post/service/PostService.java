package vn.bds360.backend.modules.post.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.repository.DistrictRepository;
import vn.bds360.backend.modules.address.repository.ProvinceRepository;
import vn.bds360.backend.modules.address.repository.WardRepository;
import vn.bds360.backend.modules.address.service.MapboxGeocodeService;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.dto.request.ForYouPostRequest;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.RelatedPostRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.MapPostResponse;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.entity.Image;
import vn.bds360.backend.modules.post.entity.ListingDetail;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.entity.PostViewHistory;
import vn.bds360.backend.modules.post.mapper.PostMapper;
import vn.bds360.backend.modules.post.repository.ImageRepository;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.post.repository.PostViewHistoryRepository;
import vn.bds360.backend.modules.post.specification.ForYouSpecification;
import vn.bds360.backend.modules.post.specification.PostSpecification;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.constant.TransactionType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.vip.repository.VipRepository;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final VipRepository vipRepository;
    private final ImageRepository imageRepository;
    private final NotificationService notificationService;
    private final TransactionRepository transactionRepository;
    private final MapboxGeocodeService mapboxGeocodeService;
    private final PostMapper postMapper;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    private final PostViewHistoryRepository postViewHistoryRepository;

    @Transactional
    public PostResponse createPost(User user, PostCreateRequest request) {
        // 1. Kiểm tra tài chính
        long costPerDay = 0;
        boolean isVip = false;

        if (request.getVipId() != null) {
            var vip = vipRepository.findById(request.getVipId())
                    .orElseThrow(() -> new AppException(ErrorCode.VIP_NOT_FOUND));
            costPerDay = vip.getPricePerDay();
            isVip = vip.getVipLevel() > 0;
        }

        long totalCost = request.getNumberOfDays() * costPerDay;
        if (user.getBalance() < totalCost) {
            throw new AppException(ErrorCode.BALANCE_NOT_ENOUGH);
        }

        // Trừ tiền
        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);

        // 2. Map DTO -> Entity
        Post post = postMapper.toEntity(request);
        post.setUser(user);
        post.setStatus(isVip ? PostStatus.REVIEW_LATER : PostStatus.PENDING);
        post.setNotifyOnView(isVip);
        post.setCreatedAt(Instant.now());
        post.setPushedAt(post.getCreatedAt());
        post.setExpireDate(post.getCreatedAt().plus(request.getNumberOfDays(), ChronoUnit.DAYS));
        post.setDeletedByUser(false);

        // Ràng buộc quan hệ 1-1 cho ListingDetail
        if (post.getListingDetail() != null) {
            post.getListingDetail().setPost(post);
        }

        // 3. Validate và gán lại Entity Địa chỉ
        validateAndSetAddress(post);

        // 4. Geocoding
        if (post.getLatitude() == null || post.getLongitude() == null) {
            handleGeocoding(post);
            System.out.println(">> Handle Geocoding");
        }

        // 5. Lưu Post
        Post savedPost = postRepository.save(post);

        // 6. Lưu Hình ảnh
        List<Image> images = new ArrayList<>();
        for (int i = 0; i < request.getImageUrls().size(); i++) {
            Image img = new Image();
            img.setUrl(request.getImageUrls().get(i));
            img.setOrderIndex(i);
            img.setPost(savedPost);
            images.add(img);
        }
        imageRepository.saveAll(images);
        savedPost.setImages(images);

        // 7. Lưu Transaction
        Transaction transaction = new Transaction();
        transaction.setAmount(-totalCost);
        transaction.setDescription("Thanh toán phí đăng tin mã " + savedPost.getId());
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setUser(user);
        transaction.setType(TransactionType.PAYMENT);
        transactionRepository.save(transaction);

        return postMapper.toResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(User user, UpdatePostRequest request) {
        Post post = postRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (post.getStatus() == PostStatus.EXPIRED) {
            throw new AppException(ErrorCode.POST_STATUS_INVALID);
        }

        // 1. Map các trường cơ bản và ID (categoryId, provinceCode...)
        postMapper.updateEntityFromRequest(request, post);

        // 2. Xử lý an toàn cho ListingDetail
        if (request.getListingDetail() != null) {
            if (post.getListingDetail() == null) {
                ListingDetail newDetail = new ListingDetail();
                newDetail.setPost(post);
                post.setListingDetail(newDetail);
            }
            post.getListingDetail().setBedrooms(request.getListingDetail().getBedrooms());
            post.getListingDetail().setBathrooms(request.getListingDetail().getBathrooms());
            post.getListingDetail().setHouseDirection(request.getListingDetail().getHouseDirection());
            post.getListingDetail().setBalconyDirection(request.getListingDetail().getBalconyDirection());
            post.getListingDetail().setLegalStatus(request.getListingDetail().getLegalStatus());
            post.getListingDetail().setFurnishing(request.getListingDetail().getFurnishing());
        }

        // 3. Validate và load lại toàn bộ Entity Địa chỉ từ các Code
        validateAndSetAddress(post);

        // 4. Geocoding (Nếu user không truyền tọa độ lên, sẽ tự động sinh lại)
        if (request.getLatitude() == null || request.getLongitude() == null) {
            handleGeocoding(post);
        }

        // 5. 🌟 Xử lý cập nhật Hình ảnh
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            post.getImages().clear(); // Xóa sạch list cũ, orphanRemoval sẽ tự delete trong DB

            List<Image> newImages = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                Image img = new Image();
                img.setUrl(request.getImageUrls().get(i));
                img.setOrderIndex(i);
                img.setPost(post);
                newImages.add(img);
            }
            post.getImages().addAll(newImages); // Thêm list mới vào
        }

        post.setStatus(PostStatus.REVIEW_LATER);

        return postMapper.toResponse(postRepository.save(post));
    }

    // ==========================================
    // PRIVATE HELPER METHODS
    // ==========================================

    private void validateAndSetAddress(Post post) {
        if (post.getProvince() != null && post.getProvince().getCode() != null) {
            Province province = provinceRepository.findById(post.getProvince().getCode())
                    .orElseThrow(() -> new AppException(ErrorCode.PROVINCE_NOT_FOUND));
            post.setProvince(province);
        }

        if (post.getDistrict() != null && post.getDistrict().getCode() != null) {
            District district = districtRepository.findById(post.getDistrict().getCode())
                    .orElseThrow(() -> new AppException(ErrorCode.DISTRICT_NOT_FOUND));

            // Dùng .equals() thay vì == cho an toàn
            if (post.getProvince() != null && !district.getProvince().getCode().equals(post.getProvince().getCode())) {
                throw new AppException(ErrorCode.INVALID_ADDRESS_HIERARCHY);
            }
            post.setDistrict(district);
        }

        if (post.getWard() != null && post.getWard().getCode() != null) {
            Ward ward = wardRepository.findById(post.getWard().getCode())
                    .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));

            // Dùng .equals() thay vì == cho an toàn
            if (post.getDistrict() != null && !ward.getDistrict().getCode().equals(post.getDistrict().getCode())) {
                throw new AppException(ErrorCode.INVALID_ADDRESS_HIERARCHY);
            }
            post.setWard(ward);
        }
    }

    private void handleGeocoding(Post post) {
        // Nếu đã có tọa độ rồi thì thoát luôn, không hỏi Mapbox nữa
        if (post.getLatitude() != null && post.getLongitude() != null) {
            return;
        }

        if (post.getStreetAddress() == null || post.getProvince() == null)
            return;

        String fullAddress = String.format("%s, %s, %s, %s",
                post.getStreetAddress(),
                post.getWard() != null ? post.getWard().getName() : "",
                post.getDistrict() != null ? post.getDistrict().getName() : "",
                post.getProvince().getName());

        Optional<double[]> latLng = mapboxGeocodeService.getLatLngFromAddress(fullAddress);
        latLng.ifPresent(coords -> {
            post.setLongitude(coords[0]);
            post.setLatitude(coords[1]);
        });
    }

    @Transactional
    public void deletePost(User user, Long postId, boolean isSystemDelete) { // Đổi tên biến cho rõ nghĩa
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // 🌟 SỬA ĐỔI LOGIC PHÂN QUYỀN TẠI ĐÂY
        boolean hasSystemRole = user.getRole().equals(Role.ADMIN) || user.getRole().equals(Role.MODERATOR);
        boolean isOwner = post.getUser().getId().equals(user.getId());

        // Nếu không phải là Admin/Mod VÀ cũng không phải là chủ bài viết -> Báo lỗi
        if (!hasSystemRole && !isOwner) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Nếu là lệnh xóa từ hệ thống (qua Controller /manage)
        if (isSystemDelete) {
            // Có thể chặn Mod không được xóa vĩnh viễn (Hard delete) mà chỉ Admin mới được,
            // hoặc cho phép cả hai. Dưới đây là cho phép cả hai.
            notificationService.createNotification(post.getUser().getId(),
                    "Tin đăng mã " + post.getId() + " đã bị gỡ bỏ bởi quản trị viên/kiểm duyệt viên.",
                    NotificationType.POST);
            postRepository.delete(post); // Hard delete
        } else {
            // Lệnh xóa từ người dùng (Soft delete)
            post.setDeletedByUser(true);
            postRepository.save(post);
        }
    }

    @Transactional
    public PostResponse updatePostStatus(Long postId, PostStatus status, String message, boolean sendNotification) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        post.setStatus(status);
        postRepository.save(post);

        if (sendNotification && message != null) {
            notificationService.createNotification(post.getUser().getId(), message, NotificationType.SYSTEM_ALERT);
        }
        return postMapper.toResponse(post);
    }

    public PostResponse getPostById(User currentUser, Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        boolean isAdmin = currentUser != null && currentUser.getRole() == Role.ADMIN;
        boolean isOwner = currentUser != null && post.getUser().getId().equals(currentUser.getId());

        // Nếu bài bị Xóa mềm -> Chỉ Admin/Owner mới được xem
        if (post.getDeletedByUser() && !isAdmin && !isOwner) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // 🌟 THÊM MỚI: Nếu bài đang Ẩn -> Chỉ Admin/Owner mới được xem
        if (Boolean.TRUE.equals(post.getIsHidden()) && !isAdmin && !isOwner) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Kiểm tra Status (Hết hạn hoặc Chờ duyệt)
        if ((post.getStatus() == PostStatus.EXPIRED || post.getStatus() == PostStatus.PENDING)
                && !isOwner && !isAdmin) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return postMapper.toResponse(post);
    }

    // =========================================================
    // 1. HÀM CHO TRANG CỦA KHÁCH (PUBLIC) - ƯU TIÊN VIP
    // =========================================================
    public PageResponse<PostResponse> getPublicPosts(PostFilterRequest filter) {
        filter.setIsApprovedOnly(true);
        filter.setIsDeleteByUser(false);
        filter.setIsHidden(false);

        var spec = PostSpecification.filterBy(filter);

        // Gọi Helper: Ưu tiên VIP = true
        Sort sort = buildSortStrategy(filter, true);

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        var page = postRepository.findAll(spec, pageable);

        return PageResponse.of(page.map(postMapper::toResponse));
    }

    // =========================================================
    // 2. HÀM CHO TRANG QUẢN LÝ CỦA USER (MY POSTS) - SORT BÌNH THƯỜNG
    // =========================================================
    public PageResponse<PostResponse> getMyPosts(User user, PostFilterRequest filter) {
        filter.setUserEmail(user.getEmail());
        filter.setIsDeleteByUser(false);

        var spec = PostSpecification.filterBy(filter);

        // Gọi Helper: Ưu tiên VIP = false
        Sort sort = buildSortStrategy(filter, false);

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        var page = postRepository.findAll(spec, pageable);

        return PageResponse.of(page.map(postMapper::toResponse));
    }

    // =========================================================
    // 🌟 HELPER METHOD TẠO CHIẾN LƯỢC SORT DÙNG CHUNG
    // =========================================================
    private Sort buildSortStrategy(PostFilterRequest filter, boolean prioritizeVip) {

        // Vì DTO đã chặn lỗi, lấy trực tiếp SortBy và SortDirection ra dùng
        Sort.Order baseOrder = new Sort.Order(filter.getSortDirection(), filter.getSortBy());

        // Nếu là API Public, gắp VIP lên đầu tiên
        if (prioritizeVip) {
            Sort.Order vipOrder = Sort.Order.desc("vip.vipLevel");
            return Sort.by(vipOrder, baseOrder);
        }

        // Nếu là API Manage / My Posts, sort linh hoạt theo user chọn
        return Sort.by(baseOrder);
    }

    // =========================================================
    // 3. HÀM CHO TRANG QUẢN TRỊ (ADMIN/MOD) - KHÔNG BỊ RÀNG BUỘC TRẠNG THÁI
    // =========================================================
    public PageResponse<PostResponse> getManagePosts(PostFilterRequest filter) {
        // KHÔNG gán cứng isApprovedOnly hay isDeleteByUser
        // Admin hoàn toàn tự do filter dựa vào query params gửi lên từ Frontend

        var spec = PostSpecification.filterBy(filter);

        // Gọi Helper: Ưu tiên VIP = false (Admin cần xem theo thời gian thực để duyệt
        // bài)
        Sort sort = buildSortStrategy(filter, false);

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        var page = postRepository.findAll(spec, pageable);

        return PageResponse.of(page.map(postMapper::toResponse));
    }

    public PageResponse<PostResponse> getRelatedPosts(Long currentPostId, RelatedPostRequest request) {
        Post currentPost = postRepository.findById(currentPostId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        int pageSize = (request.getSize() != null && request.getSize() > 0) ? request.getSize() : 5;
        List<Long> excludes = request.getExcludeIds() != null ? new ArrayList<>(request.getExcludeIds())
                : new ArrayList<>();
        if (!excludes.contains(currentPostId)) {
            excludes.add(currentPostId);
        }

        // Cấu hình Sort mặc định: VIP giảm dần -> Mới nhất
        Sort sort = Sort.by(Sort.Direction.DESC, "vip.vipLevel")
                .and(Sort.by(Sort.Direction.DESC, "pushedAt"));

        List<Post> finalPosts = new ArrayList<>();

        // =========================================
        // LẦN 1: TÌM KIẾM NGẶT NGHÈO (Cùng Danh mục + Cùng Tỉnh)
        // =========================================
        PostFilterRequest filter1 = new PostFilterRequest();
        filter1.setType(currentPost.getType());
        filter1.setCategoryId(currentPost.getCategory().getId());
        filter1.setProvinceCode(currentPost.getProvince().getCode());
        filter1.setIsApprovedOnly(true);
        filter1.setIsDeleteByUser(false);
        filter1.setIsHidden(false);

        var spec1 = PostSpecification.filterBy(filter1)
                .and((root, query, cb) -> cb.not(root.get("id").in(excludes)));

        List<Post> tier1Posts = postRepository.findAll(spec1, PageRequest.of(0, pageSize, sort)).getContent();
        finalPosts.addAll(tier1Posts);

        // Cập nhật lại mảng loại trừ để Lần 2 không bị trùng bài của Lần 1
        tier1Posts.forEach(p -> excludes.add(p.getId()));

        // =========================================
        // LẦN 2: NỚI LỎNG (Cùng Danh mục, BẤT KỲ Tỉnh nào)
        // =========================================
        if (finalPosts.size() < pageSize) {
            int missingCount = pageSize - finalPosts.size();

            PostFilterRequest filter2 = new PostFilterRequest();
            filter2.setType(currentPost.getType());
            filter2.setCategoryId(currentPost.getCategory().getId()); // Giữ danh mục, bỏ Tỉnh
            filter2.setIsApprovedOnly(true);
            filter2.setIsDeleteByUser(false);
            filter2.setIsHidden(false);

            var spec2 = PostSpecification.filterBy(filter2)
                    .and((root, query, cb) -> cb.not(root.get("id").in(excludes)));

            List<Post> tier2Posts = postRepository.findAll(spec2, PageRequest.of(0, missingCount, sort)).getContent();
            finalPosts.addAll(tier2Posts);
            tier2Posts.forEach(p -> excludes.add(p.getId()));
        }

        // =========================================
        // LẦN 3: VÉT ĐÁY (Chỉ cần Cùng Bán hoặc Cùng Thuê)
        // =========================================
        if (finalPosts.size() < pageSize) {
            int missingCount = pageSize - finalPosts.size();

            PostFilterRequest filter3 = new PostFilterRequest();
            filter3.setType(currentPost.getType()); // Chỉ giữ lại loại hình (SALE/RENT)
            filter3.setIsApprovedOnly(true);
            filter3.setIsDeleteByUser(false);
            filter3.setIsHidden(false);
            var spec3 = PostSpecification.filterBy(filter3)
                    .and((root, query, cb) -> cb.not(root.get("id").in(excludes)));

            List<Post> tier3Posts = postRepository.findAll(spec3, PageRequest.of(0, missingCount, sort)).getContent();
            finalPosts.addAll(tier3Posts);
        }

        // Map list cuối cùng sang DTO
        List<PostResponse> responseList = finalPosts.stream().map(postMapper::toResponse).toList();

        // Thường tin tương tự ta chỉ lấy List (không cần phân trang sâu), nên ta giả
        // lập một Page
        var pageImpl = new org.springframework.data.domain.PageImpl<>(responseList, PageRequest.of(0, pageSize),
                responseList.size());

        return PageResponse.of(pageImpl);
    }

    public PageResponse<PostResponse> getForYouPosts(User user, ForYouPostRequest request) {
        int pageSize = (request.getSize() != null && request.getSize() > 0) ? request.getSize() : 10;

        List<Long> prefCategoryIds = new ArrayList<>();
        List<Long> prefProvinceCodes = new ArrayList<>();
        List<Long> excludes = new ArrayList<>();

        // 🌟 THÊM MỚI: Nạp ngay các ID cần loại trừ từ Request gửi lên
        if (request.getExcludeIds() != null && !request.getExcludeIds().isEmpty()) {
            excludes.addAll(request.getExcludeIds());
        }

        if (user != null) {
            List<PostViewHistory> history = postViewHistoryRepository.findRecentHistoryByUser(user);
            for (PostViewHistory h : history) {
                prefCategoryIds.add(h.getPost().getCategory().getId());
                prefProvinceCodes.add(h.getPost().getProvince().getCode());
                // Set tự động chặn trùng lặp nếu ID tin đã có trong mảng từ bước trên
                if (!excludes.contains(h.getPost().getId())) {
                    excludes.add(h.getPost().getId());
                }
            }
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "vip.vipLevel")
                .and(Sort.by(Sort.Direction.DESC, "pushedAt"));

        List<Post> finalPosts = new ArrayList<>();

        // =========================================
        // TIER 1: CÁ NHÂN HÓA
        // =========================================
        if (user != null && (!prefCategoryIds.isEmpty() || !prefProvinceCodes.isEmpty())) {
            // 🌟 TRUYỀN THÊM request.getType()
            var spec1 = ForYouSpecification.buildTier1Spec(user.getId(), prefCategoryIds, prefProvinceCodes, excludes,
                    request.getType());

            List<Post> tier1Posts = postRepository.findAll(spec1, PageRequest.of(0, pageSize, sort)).getContent();
            finalPosts.addAll(tier1Posts);
            tier1Posts.forEach(p -> excludes.add(p.getId()));
        }

        // =========================================
        // TIER 2: VÉT ĐÁY
        // =========================================
        if (finalPosts.size() < pageSize) {
            int missingCount = pageSize - finalPosts.size();
            Long currentUserId = (user != null) ? user.getId() : null;

            // 🌟 TRUYỀN THÊM request.getType()
            var spec2 = ForYouSpecification.buildTier2Spec(currentUserId, excludes, request.getType());

            List<Post> tier2Posts = postRepository.findAll(spec2, PageRequest.of(0, missingCount, sort)).getContent();
            finalPosts.addAll(tier2Posts);
        }

        List<PostResponse> responseList = finalPosts.stream().map(postMapper::toResponse).toList();
        var pageImpl = new org.springframework.data.domain.PageImpl<>(
                responseList, PageRequest.of(0, pageSize), responseList.size());

        return PageResponse.of(pageImpl);
    }

    public List<MapPostResponse> getPostsForMap(PostFilterRequest filter) {
        // 1. Ép cứng các điều kiện cho bài đăng public hợp lệ
        filter.setIsApprovedOnly(true);
        filter.setIsDeleteByUser(false);
        filter.setIsHidden(false);

        // 2. Tái sử dụng toàn bộ logic filter phức tạp từ PostSpecification
        Specification<Post> baseSpec = PostSpecification.filterBy(filter);

        // 3. Nối thêm điều kiện đặc thù của Map: Phải có tọa độ (Lat/Lng không null)
        Specification<Post> mapSpec = baseSpec.and((root, query, cb) -> cb.and(
                cb.isNotNull(root.get("latitude")),
                cb.isNotNull(root.get("longitude"))));

        // 4. Lấy danh sách Entities và Map sang DTO
        List<Post> posts = postRepository.findAll(mapSpec);

        return posts.stream()
                .map(post -> new MapPostResponse(
                        post.getLatitude(),
                        post.getLongitude(),
                        post.getId(),
                        post.getVip().getId(),
                        post.getPrice()))
                .toList();
    }

    @Transactional
    public PostResponse togglePostVisibility(User user, Long postId, boolean isHidden) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // 1. Chỉ chủ bài viết mới được quyền Ẩn/Hiện bài của mình
        if (!post.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // 2. Chặn thao tác nếu bài đã bị Admin khóa hoặc đã bị xóa mềm
        if (post.getStatus() == PostStatus.BLOCKED || post.getDeletedByUser()) {
            throw new AppException(ErrorCode.POST_STATUS_INVALID);
        }

        // 3. Cập nhật trạng thái
        post.setIsHidden(isHidden);
        postRepository.save(post);

        return postMapper.toResponse(post);
    }

    @Transactional
    public PostResponse renewPost(User user, Long postId,
            vn.bds360.backend.modules.post.dto.request.RenewPostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (post.getStatus() == PostStatus.BLOCKED || Boolean.TRUE.equals(post.getDeletedByUser())) {
            throw new AppException(ErrorCode.POST_STATUS_INVALID);
        }

        long costPerDay = 0;
        boolean isVip = false;
        vn.bds360.backend.modules.vip.entity.Vip targetVip = post.getVip();

        if (request.getVipId() != null) {
            targetVip = vipRepository.findById(request.getVipId())
                    .orElseThrow(() -> new AppException(ErrorCode.VIP_NOT_FOUND));
            costPerDay = targetVip.getPricePerDay();
            isVip = targetVip.getVipLevel() > 0;
        } else if (post.getVip() != null) {
            costPerDay = post.getVip().getPricePerDay();
            isVip = post.getVip().getVipLevel() > 0;
        }

        long totalCost = request.getNumberOfDays() * costPerDay;

        if (user.getBalance() < totalCost) {
            throw new AppException(ErrorCode.BALANCE_NOT_ENOUGH);
        }

        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);

        post.setVip(targetVip);
        post.setNotifyOnView(isVip);

        Instant baseDate = (post.getExpireDate() != null && post.getExpireDate().isAfter(Instant.now()))
                ? post.getExpireDate()
                : Instant.now();

        post.setExpireDate(baseDate.plus(request.getNumberOfDays(), ChronoUnit.DAYS));

        // Trả về PENDING/REVIEW_LATER để duyệt lại nếu tin đang hết hạn hoặc đổi loại
        // VIP
        if (post.getStatus() == PostStatus.EXPIRED
                || (request.getVipId() != null && !request.getVipId().equals(post.getVip().getId()))) {
            post.setStatus(isVip ? PostStatus.REVIEW_LATER : PostStatus.PENDING);
        }

        Post savedPost = postRepository.save(post);

        Transaction transaction = new Transaction();
        transaction.setAmount(-totalCost);
        transaction
                .setDescription("Gia hạn tin #" + savedPost.getId() + " thêm " + request.getNumberOfDays() + " ngày");
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setUser(user);
        transaction.setType(TransactionType.PAYMENT);
        transactionRepository.save(transaction);

        return postMapper.toResponse(savedPost);
    }

    // ==========================================
    // TÍNH NĂNG ĐẨY TIN LÊN TOP (BUMP)
    // ==========================================
    @Transactional
    public PostResponse bumpPost(User user, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (post.getStatus() != PostStatus.APPROVED && post.getStatus() != PostStatus.REVIEW_LATER) {
            throw new AppException(ErrorCode.POST_STATUS_INVALID); // Chỉ tin đang hiển thị mới được đẩy
        }

        // Cooldown: Không cho phép đẩy liên tục trong 2 giờ
        if (post.getPushedAt() != null && ChronoUnit.HOURS.between(post.getPushedAt(), Instant.now()) < 2) {
            throw new AppException(ErrorCode.BUMP_COOLDOWN_ACTIVE); // Cần định nghĩa lỗi này trong ErrorCode
        }

        long bumpFee = 10000L; // Có thể chuyển thành cấu hình trong Database
        if (user.getBalance() < bumpFee) {
            throw new AppException(ErrorCode.BALANCE_NOT_ENOUGH);
        }

        user.setBalance(user.getBalance() - bumpFee);
        userRepository.save(user);

        // Cập nhật thời điểm đẩy tin
        post.setPushedAt(Instant.now());
        Post savedPost = postRepository.save(post);

        Transaction transaction = new Transaction();
        transaction.setAmount(-bumpFee);
        transaction.setDescription("Phí đẩy tin #" + savedPost.getId() + " lên top");
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setUser(user);
        transaction.setType(TransactionType.PAYMENT);
        transactionRepository.save(transaction);

        return postMapper.toResponse(savedPost);
    }
}