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
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.address.service.MapboxGeocodeService;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostDTO;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.entity.Image;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.mapper.PostMapper;
import vn.bds360.backend.modules.post.repository.ImageRepository;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.post.specification.PostSpecification;
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
        post.setStatus(isVip ? PostStatusEnum.REVIEW_LATER : PostStatusEnum.PENDING);
        post.setNotifyOnView(isVip);
        post.setCreatedAt(Instant.now());
        post.setExpireDate(post.getCreatedAt().plus(request.getNumberOfDays(), ChronoUnit.DAYS));
        post.setDeletedByUser(false);

        // 3. Geocoding
        handleGeocoding(post);

        // 4. Lưu Post
        Post savedPost = postRepository.save(post);

        // 5. Lưu Hình ảnh
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

        // 6. Lưu Transaction
        Transaction transaction = new Transaction();
        transaction.setAmount(-totalCost);
        transaction.setDescription("Thanh toán phí đăng tin mã " + savedPost.getId());
        transaction.setStatus(TransStatusEnum.SUCCESS);
        transaction.setUser(user);
        transactionRepository.save(transaction);

        return postMapper.toResponse(savedPost);
    }

    private void handleGeocoding(Post post) {
        if (post.getDetailAddress() == null || post.getProvince() == null)
            return;

        String fullAddress = String.format("%s, %s, %s, %s",
                post.getDetailAddress(),
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
    public PostResponse updatePost(User user, UpdatePostDTO request) {
        Post post = postRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(user.getId()) && user.getRole() != RoleEnum.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (post.getStatus() == PostStatusEnum.EXPIRED) {
            throw new AppException(ErrorCode.POST_STATUS_INVALID); // Update ErrorCode message if needed
        }

        postMapper.updateEntityFromRequest(request, post);

        // Cập nhật lại tọa độ nếu địa chỉ thay đổi (Bạn có thể check condition kỹ hơn ở
        // đây)
        if (request.getLatitude() == null) {
            handleGeocoding(post);
        }

        return postMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public void deletePost(User user, Long postId, boolean isAdminDelete) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (!isAdminDelete && !post.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (isAdminDelete) {
            notificationService.createNotification(post.getUser().getId(),
                    "Tin đăng mã " + post.getId() + " đã bị quản trị viên xóa.",
                    NotificationType.POST);
            postRepository.delete(post); // Hard delete
        } else {
            post.setDeletedByUser(true); // Soft delete
            postRepository.save(post);
        }
    }

    @Transactional
    public PostResponse updatePostStatus(Long postId, PostStatusEnum status, String message, boolean sendNotification) {
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

        boolean isAdmin = currentUser != null && currentUser.getRole() == RoleEnum.ADMIN;
        boolean isOwner = currentUser != null && post.getUser().getId().equals(currentUser.getId());

        if (post.getDeletedByUser() && !isAdmin) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if ((post.getStatus() == PostStatusEnum.EXPIRED || post.getStatus() == PostStatusEnum.PENDING)
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
}