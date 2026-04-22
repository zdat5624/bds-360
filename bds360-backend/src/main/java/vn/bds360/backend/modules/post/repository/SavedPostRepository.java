package vn.bds360.backend.modules.post.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.modules.post.entity.SavedPost;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    // Kiểm tra xem đã lưu chưa
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    // Lấy ra bản ghi để xóa (Bỏ lưu)
    Optional<SavedPost> findByUserIdAndPostId(Long userId, Long postId);

    // Lấy danh sách tin đã lưu của 1 user (Có phân trang và sắp xếp)
    Page<SavedPost> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT s.post.id FROM SavedPost s WHERE s.user.id = :userId AND s.post.id IN :postIds")
    Set<Long> findSavedPostIdsByUserIdAndPostIdIn(
            @Param("userId") Long userId,
            @Param("postIds") List<Long> postIds);
}