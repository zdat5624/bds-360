package vn.bds360.backend.modules.post.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.common.constant.PostTypeEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.exception.ForbiddenException;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.common.exception.NotFoundException;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.repository.DistrictRepository;
import vn.bds360.backend.modules.address.repository.ProvinceRepository;
import vn.bds360.backend.modules.address.repository.WardRepository;
import vn.bds360.backend.modules.address.service.MapboxGeocodeService;
import vn.bds360.backend.modules.category.entity.Category;
import vn.bds360.backend.modules.category.repository.CategoryRepository;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.post.dto.request.UpdatePostDTO;
import vn.bds360.backend.modules.post.dto.response.MapPostDTO;
import vn.bds360.backend.modules.post.entity.Image;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.ImageRepository;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.post.specification.PostSpecification;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.modules.vip.repository.VipRepository;
import vn.bds360.backend.security.SecurityUtil;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final VipRepository vipRepository;
    private final ImageRepository imageRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final NotificationService notificationService;
    private final TransactionRepository transactionRepository;
    private final MapboxGeocodeService mapboxGeocodeService;

    public PostService(PostRepository postRepository, UserRepository userRepository,
            CategoryRepository categoryRepository, VipRepository vipRepository, ImageRepository imageRepository,
            ProvinceRepository provinceRepository, DistrictRepository districtRepository, WardRepository wardRepository,
            NotificationService notificationService, TransactionRepository transactionRepository,
            MapboxGeocodeService mapboxGeocodeService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.vipRepository = vipRepository;
        this.imageRepository = imageRepository;
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
        this.notificationService = notificationService;
        this.transactionRepository = transactionRepository;
        this.mapboxGeocodeService = mapboxGeocodeService;
    }

    public Post createPost(Post post, int numberOfDays) throws InputInvalidException {
        // Lấy user hiện tại từ SecurityUtil (giả định đã đăng nhập)
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));

        // Tìm category
        Category category = categoryRepository.findById(post.getCategory().getId())
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy danh mục"));

        if (post.getImages() == null || post.getImages().isEmpty()) {
            throw new InputInvalidException("Ảnh không được để trống");
        }

        if (post.getType() != category.getType()) {
            throw new InputInvalidException("Kiểu của tin đăng và kiểu của danh mục không khớp");
        }

        // Xử lý địa chỉ
        if (post.getProvince() != null) {
            Province province = provinceRepository.findById(post.getProvince().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy tỉnh/thành phố"));
            post.setProvince(province);
        }

        if (post.getDistrict() != null) {
            District district = districtRepository.findById(post.getDistrict().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy quận/huyện"));
            if (post.getProvince() != null && !(district.getProvince().getCode() == post.getProvince().getCode())) {
                throw new InputInvalidException("Quận/huyện không thuộc tỉnh/thành phố đã chọn");
            }
            post.setDistrict(district);
        }

        if (post.getWard() != null) {
            Ward ward = wardRepository.findById(post.getWard().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy phường/xã"));
            if (post.getDistrict() != null && !(ward.getDistrict().getCode() == post.getDistrict().getCode())) {
                throw new InputInvalidException("Phường/xã không thuộc quận/huyện đã chọn");
            }
            post.setWard(ward);
        }

        if (post.getDetailAddress() != null && !post.getDetailAddress().isEmpty()) {
            post.setDetailAddress(post.getDetailAddress());
        }

        // Ghép địa chỉ đầy đủ để gửi tới Mapbox
        String fullAddress = post.getDetailAddress() + ", "
                + (post.getWard() != null ? post.getWard().getName() + ", " : "")
                + (post.getDistrict() != null ? post.getDistrict().getName() + ", " : "")
                + (post.getProvince() != null ? post.getProvince().getName() : "");

        // Lấy tọa độ từ Mapbox
        if (post.getLatitude() == null || post.getLatitude() == null) {
            Optional<double[]> latLng = mapboxGeocodeService.getLatLngFromAddress(fullAddress);
            if (latLng.isPresent()) {
                double[] coords = latLng.get();
                post.setLongitude(coords[0]);
                post.setLatitude(coords[1]);
            }
        }

        // Xử lý vip
        Vip vip = new Vip();
        if (post.getVip() != null && post.getVip().getId() > 0) {
            vip = vipRepository.findById(post.getVip().getId())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy VIP"));
            post.setVip(vip);
        }

        // Gán thông tin cho tin đăng
        post.setUser(user);
        post.setCategory(category);
        post.setStatus(PostStatusEnum.PENDING);
        post.setCreatedAt(Instant.now());
        post.setExpireDate(post.getCreatedAt().plus(numberOfDays, ChronoUnit.DAYS));

        if (vip.getVipLevel() > 0) {
            post.setStatus(PostStatusEnum.REVIEW_LATER);
            post.setNotifyOnView(true);
        } else {
            post.setNotifyOnView(false);
        }

        // Tính toán chi phí dựa trên số ngày và trừ số dư
        long costPerDay = vip.getPricePerDay();
        long totalCost = numberOfDays * costPerDay;

        if (user.getBalance() < totalCost) {
            throw new InputInvalidException("Số dư không đủ để thực hiện giao dịch");
        }

        user.setBalance((long) (user.getBalance() - totalCost));
        userRepository.save(user);

        // Lưu tin đăng
        post = postRepository.save(post);

        // Luu transaction
        Transaction transaction = new Transaction();
        transaction.setAmount(-totalCost);
        transaction.setDescription("Thanh toán phí đăng tin mã " + post.getId() + " thành công");
        transaction.setStatus(TransStatusEnum.SUCCESS);
        transaction.setUser(user);
        this.transactionRepository.save(transaction);

        // Xử lý ảnh
        List<Image> images = new ArrayList<>();
        int orderIndex = 0;
        for (Image image : post.getImages()) {
            image.setPost(post);
            image.setOrderIndex(orderIndex++);
            images.add(image);
        }
        imageRepository.saveAll(images);
        post.setImages(images);

        return post;
    }

    public void deletePost(Long postId) throws InputInvalidException {
        // Lấy user hiện tại
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));

        // Tìm tin đăng
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy tin đăng"));

        // Kiểm tra quyền sở hữu hoặc quyền admin
        if (!post.getUser().getEmail().equals(userEmail) && !user.getRole().equals(RoleEnum.ADMIN)) {
            throw new InputInvalidException("Bạn không có quyền xóa tin đăng này");
        }

        // Xóa mềm (Soft Delete)
        post.setDeletedByUser(true);
        postRepository.save(post);
    }

    public void deletePostAdmin(Long postId) throws InputInvalidException {
        // Lấy user hiện tại
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));

        // Tìm tin đăng
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy tin đăng"));

        // Kiểm tra quyền sở hữu hoặc quyền admin
        if (!post.getUser().getEmail().equals(userEmail) && !user.getRole().equals(RoleEnum.ADMIN)) {
            throw new InputInvalidException("Bạn không có quyền xóa tin đăng này");
        }
        Notification notification = new Notification();
        notification.setUser(post.getUser());
        notification.setRead(false);
        notification.setMessage("Tin đăng mã " + post.getId() + " của bạn đã bị quản trị viên xóa vĩnh viễn");
        notification.setType(NotificationType.POST);
        this.notificationService.createNotification(notification);

        this.postRepository.delete(post);
    }

    public Post updatePost(UpdatePostDTO updatePostDTO) throws InputInvalidException {
        if (updatePostDTO.getId() == null || updatePostDTO.getId() == 0) {
            throw new InputInvalidException("ID của tin đăng không được để trống");
        }

        Post existingPost = postRepository.findById(updatePostDTO.getId())
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy tin đăng"));

        // Kiểm tra quyền chỉnh sửa
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));
        if (!existingPost.getUser().getEmail().equals(userEmail) && !user.getRole().equals(RoleEnum.ADMIN)) {
            throw new InputInvalidException("Bạn không có quyền chỉnh sửa tin đăng này");
        }

        // Kiểm tra trạng thái tin đăng và cập nhật trạng thái mới
        if (existingPost.getStatus() == PostStatusEnum.EXPIRED) {
            throw new InputInvalidException("Không thể cập nhật tin đăng đã hết hạn");
        } else if (existingPost.getStatus() == PostStatusEnum.REJECTED) {
            existingPost.setStatus(PostStatusEnum.PENDING);
        } else if (existingPost.getStatus() == PostStatusEnum.APPROVED) {
            if (existingPost.getVip() != null && existingPost.getVip().getVipLevel() > 0) {
                existingPost.setStatus(PostStatusEnum.REVIEW_LATER);
            } else {
                existingPost.setStatus(PostStatusEnum.PENDING);
            }
        }

        // Cập nhật các trường được phép
        if (updatePostDTO.getTitle() != null) {
            existingPost.setTitle(updatePostDTO.getTitle());
        }
        if (updatePostDTO.getDescription() != null) {
            existingPost.setDescription(updatePostDTO.getDescription());
        }
        if (updatePostDTO.getType() != null) {
            existingPost.setType(updatePostDTO.getType());
            // Kiểm tra type có khớp với danh mục
            if (updatePostDTO.getCategory() != null && updatePostDTO.getCategory().getId() > 0) {
                Category category = categoryRepository.findById(updatePostDTO.getCategory().getId())
                        .orElseThrow(() -> new InputInvalidException("Không tìm thấy danh mục"));
                if (updatePostDTO.getType() != category.getType()) {
                    throw new InputInvalidException("Kiểu của tin đăng và kiểu của danh mục không khớp");
                }
            }
        }
        if (updatePostDTO.getPrice() != null) {
            existingPost.setPrice(updatePostDTO.getPrice());
        }
        if (updatePostDTO.getArea() != null) {
            existingPost.setArea(updatePostDTO.getArea());
        }
        if (updatePostDTO.getProvince() != null) {
            Province province = provinceRepository.findById(updatePostDTO.getProvince().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy tỉnh/thành phố"));
            existingPost.setProvince(province);
        }
        if (updatePostDTO.getDistrict() != null) {
            District district = districtRepository.findById(updatePostDTO.getDistrict().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy quận/huyện"));
            if (updatePostDTO.getProvince() != null &&
                    !(district.getProvince().getCode() == updatePostDTO.getProvince().getCode())) {
                throw new InputInvalidException("Quận/huyện không thuộc tỉnh/thành phố đã chọn");
            }
            existingPost.setDistrict(district);
        }
        if (updatePostDTO.getWard() != null) {
            Ward ward = wardRepository.findById(updatePostDTO.getWard().getCode())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy phường/xã"));
            if (updatePostDTO.getDistrict() != null &&
                    !(ward.getDistrict().getCode() == updatePostDTO.getDistrict().getCode())) {
                throw new InputInvalidException("Phường/xã không thuộc quận/huyện đã chọn");
            }
            existingPost.setWard(ward);
        }
        if (updatePostDTO.getDetailAddress() != null) {
            existingPost.setDetailAddress(updatePostDTO.getDetailAddress());
        }
        if (updatePostDTO.getCategory() != null && updatePostDTO.getCategory().getId() > 0) {
            Category category = categoryRepository.findById(updatePostDTO.getCategory().getId())
                    .orElseThrow(() -> new InputInvalidException("Không tìm thấy danh mục"));
            if (existingPost.getType() != category.getType()) {
                throw new InputInvalidException("Kiểu của tin đăng và kiểu của danh mục không khớp");
            }
            existingPost.setCategory(category);
        }
        if (updatePostDTO.getImages() != null && !updatePostDTO.getImages().isEmpty()) {
            existingPost.getImages().clear();
            List<Image> newImages = new ArrayList<>();
            int orderIndex = 0;
            for (Image img : updatePostDTO.getImages()) {
                img.setPost(existingPost);
                img.setOrderIndex(orderIndex++);
                newImages.add(img);
            }
            imageRepository.saveAll(newImages);
            existingPost.getImages().addAll(newImages);
        }
        if (updatePostDTO.getLatitude() != null && updatePostDTO.getLongitude() != null) {
            existingPost.setLatitude(updatePostDTO.getLatitude());
            existingPost.setLongitude(updatePostDTO.getLongitude());
        } else if (updatePostDTO.getDetailAddress() != null || updatePostDTO.getWard() != null ||
                updatePostDTO.getDistrict() != null || updatePostDTO.getProvince() != null) {
            // Cập nhật tọa độ từ địa chỉ mới nếu không có latitude/longitude
            String fullAddress = (updatePostDTO.getDetailAddress() != null ? updatePostDTO.getDetailAddress()
                    : existingPost.getDetailAddress()) + ", "
                    + (updatePostDTO.getWard() != null ? updatePostDTO.getWard().getName()
                            : (existingPost.getWard() != null ? existingPost.getWard().getName() : ""))
                    + ", "
                    + (updatePostDTO.getDistrict() != null ? updatePostDTO.getDistrict().getName()
                            : (existingPost.getDistrict() != null ? existingPost.getDistrict().getName() : ""))
                    + ", "
                    + (updatePostDTO.getProvince() != null ? updatePostDTO.getProvince().getName()
                            : (existingPost.getProvince() != null ? existingPost.getProvince().getName() : ""));
            Optional<double[]> latLng = mapboxGeocodeService.getLatLngFromAddress(fullAddress);
            if (latLng.isPresent()) {
                double[] coords = latLng.get();
                existingPost.setLongitude(coords[0]);
                existingPost.setLatitude(coords[1]);
            }
        }

        existingPost.setUpdatedAt(Instant.now());
        return postRepository.save(existingPost);
    }

    public Post updatePostStatus(Long postId, PostStatusEnum newStatus, String message, boolean sendNotification)
            throws InputInvalidException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy tin đăng"));

        // Cập nhật trạng thái
        post.setStatus(newStatus);
        postRepository.save(post);

        // Tạo thông báo cho chủ tin đăng nếu sendNotification là true
        if (sendNotification) {
            if (message == null || message.trim().isEmpty()) {
                throw new InputInvalidException("Tin nhắn không được để trống khi gửi thông báo");
            }
            User postOwner = post.getUser();
            Notification notification = new Notification();
            notification.setRead(false);
            notification.setUser(postOwner);
            notification.setType(NotificationType.SYSTEM_ALERT);
            notification.setMessage(message);
            this.notificationService.createNotification(notification);
        }

        return post;
    }

    @Transactional
    public Post getPostById(Long id) throws InputInvalidException {
        // Tìm tin đăng
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tin đăng với ID: " + id));

        // Lấy thông tin người dùng hiện tại
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElse(null); // Có thể null nếu chưa đăng nhập
        User currentUser = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;

        // Kiểm tra quyền truy cập
        boolean isAdmin = currentUser != null && currentUser.getRole().equals(RoleEnum.ADMIN);
        boolean isOwner = currentUser != null && post.getUser().getEmail().equals(userEmail);

        // Trường hợp tin đăng bị xóa mềm (deletedByUser = true): chỉ admin được truy
        // cập
        if (post.getDeletedByUser() && !isAdmin) {
            throw new ForbiddenException("Bạn không có quyền truy cập tin đăng này");
        }

        // Trường hợp trạng thái EXPIRED, REJECTED, PENDING: chỉ chủ sở hữu hoặc admin
        // được truy cập
        if (post.getStatus().equals(PostStatusEnum.EXPIRED) ||
                post.getStatus().equals(PostStatusEnum.REJECTED) ||
                post.getStatus().equals(PostStatusEnum.PENDING)) {
            if (!isOwner && !isAdmin) {
                throw new ForbiddenException("Bạn không có quyền truy cập tin đăng này");
            }
        }

        // Xử lý thông báo khi notifyOnView = true
        if (post.getNotifyOnView() && currentUser != null && !isOwner && !isAdmin) {
            Notification notification = new Notification();
            String message = "Người dùng '" + currentUser.getName() + " - " + currentUser.getPhone() +
                    "' đã xem tin đăng mã '" + post.getId() + "' của bạn.";
            notification.setMessage(message);
            notification.setUser(post.getUser());
            notification.setRead(false);
            notification.setType(NotificationType.POST);

            // Kiểm tra thông báo trùng lặp
            if (!notificationService.existsByMessage(message)) {
                notificationService.createNotification(notification);
            }
        }

        // Tăng số lượt xem
        post.setView(post.getView() + 1);
        postRepository.save(post);

        return post;
    }

    public Page<Post> getFilteredPosts(Long minPrice, Long maxPrice, Double minArea, Double maxArea,
            PostStatusEnum status, Long categoryId, PostTypeEnum type, Long vipId,
            String search, Boolean isDeleteByUser, Pageable pageable) {

        Specification<Post> spec = PostSpecification.filterBy(minPrice, maxPrice, minArea, maxArea, status,
                categoryId, type, vipId, search, isDeleteByUser);

        return postRepository.findAll(spec, pageable);
    }

    public Page<Post> getFilteredReviewOrApprovedPosts(
            Long minPrice, Long maxPrice, Double minArea, Double maxArea,
            Long provinceCode, Long districtCode, Long wardCode, Long categoryId,
            PostTypeEnum type, int page, int size) {

        Specification<Post> spec = PostSpecification.filterBy(
                minPrice, maxPrice, minArea, maxArea, provinceCode, districtCode, wardCode, categoryId,
                type);

        spec = spec.and((root, query, criteriaBuilder) -> root.get("status").in(PostStatusEnum.REVIEW_LATER,
                PostStatusEnum.APPROVED));

        Pageable pageable = PageRequest.of(page, size, Sort.by(
                Sort.Order.desc("vip.vipLevel"),
                Sort.Order.desc("createdAt")));
        return postRepository.findAll(spec, pageable);
    }

    public Page<Post> getMyPosts(Pageable pageable, PostStatusEnum status, PostTypeEnum type,
            Long provinceCode, Long postId) throws InputInvalidException {
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));

        return postRepository.findMyPosts(user.getEmail(), status, type, provinceCode, postId, pageable);
    }

    public String getFullAddressByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        String detail = post.getDetailAddress() != null ? post.getDetailAddress() : "";
        String ward = post.getWard() != null ? ", " + post.getWard().getName() : "";
        if (detail.equals("")) {
            ward = post.getWard() != null ? post.getWard().getName() : "";
        }
        String district = post.getDistrict() != null ? ", " + post.getDistrict().getName() : "";
        String province = post.getProvince() != null ? ", " + post.getProvince().getName() : "";

        return detail + ward + district + province;
    }

    public List<MapPostDTO> getPostsForMap(Long minPrice, Long maxPrice, Double minArea, Double maxArea,
            Long categoryId, PostTypeEnum type, Long provinceCode, Long districtCode, Long wardCode) {
        List<Object[]> results = postRepository.findPostsForMap(minPrice, maxPrice, minArea, maxArea,
                categoryId, type, provinceCode, districtCode, wardCode);

        return results.stream()
                .map(result -> new MapPostDTO(
                        (Double) result[0], // latitude
                        (Double) result[1], // longitude
                        (Long) result[2], // postId
                        (Long) result[3], // vipId
                        (Long) result[4] // price
                ))
                .collect(Collectors.toList());
    }

}