package vn.bds360.backend.modules.post.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        post.setExpireDate(post.getCreatedAt().plus(request.getNumberOfDays(), ChronoUnit.DAYS));
        post.setDeletedByUser(false);

        // Ràng buộc quan hệ 1-1 cho ListingDetail
        if (post.getListingDetail() != null) {
            post.getListingDetail().setPost(post);
        }

        // 3. Validate và gán lại Entity Địa chỉ
        validateAndSetAddress(post);

        // 4. Geocoding
        handleGeocoding(post);

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

        if (post.getDeletedByUser() && !isAdmin) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if ((post.getStatus() == PostStatus.EXPIRED || post.getStatus() == PostStatus.PENDING)
                && !isOwner && !isAdmin) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Tăng view
        post.setView(post.getView() + 1);
        postRepository.save(post);

        // Notify
        if (post.getNotifyOnView() && currentUser != null && !isOwner && !isAdmin) {
            String msg = String.format("Người dùng '%s - %s' đã xem tin đăng mã '%d' của bạn.",
                    currentUser.getName(), currentUser.getPhone(), post.getId());
            if (!notificationService.existsByMessage(msg)) {
                notificationService.createNotification(post.getUser(), msg, NotificationType.POST);
            }
        }

        return postMapper.toResponse(post);
    }

    // Dùng chung 1 hàm cho việc lấy danh sách bài đăng
    public PageResponse<PostResponse> getFilteredPosts(PostFilterRequest filter) {
        var spec = PostSpecification.filterBy(filter);
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(),
                Sort.by(filter.getSortDirection(), filter.getSortBy()));
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
                .and(Sort.by(Sort.Direction.DESC, "createdAt"));

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

        if (user != null) {
            List<PostViewHistory> history = postViewHistoryRepository.findRecentHistoryByUser(user);
            for (PostViewHistory h : history) {
                prefCategoryIds.add(h.getPost().getCategory().getId());
                prefProvinceCodes.add(h.getPost().getProvince().getCode());
                excludes.add(h.getPost().getId());
            }
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "vip.vipLevel")
                .and(Sort.by(Sort.Direction.DESC, "createdAt"));

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

}