package vn.bds360.backend.modules.notification.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.modules.notification.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
        boolean existsByMessage(String message);

        long countByUserIdAndIsReadFalse(Long userId);

        @Query("SELECT n FROM Notification n WHERE n.user.id = :userId "
                        + "AND (:isRead IS NULL OR n.isRead = :isRead) "
                        + "AND (:type IS NULL OR n.type = :type)")
        Page<Notification> findByUserAndFilters(
                        @Param("userId") Long userId,
                        @Param("isRead") Boolean isRead,
                        @Param("type") NotificationType type,
                        Pageable pageable);

        @Modifying
        @Query("DELETE FROM Notification n WHERE n.id IN :ids AND n.user.id = :userId")
        int deleteByIdsAndUserId(@Param("ids") Iterable<Long> ids, @Param("userId") Long userId);

        @Modifying
        @Query("UPDATE Notification n SET n.isRead = true WHERE n.id IN :ids AND n.user.id = :userId")
        int markAsReadByIdsAndUserId(@Param("ids") Iterable<Long> ids, @Param("userId") Long userId);

        @Modifying
        @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
        int markAllAsReadByUserId(@Param("userId") Long userId);

        @Query("SELECT n.type AS type, COUNT(n) AS count "
                        + "FROM Notification n WHERE n.user.id = :userId AND n.isRead = false "
                        + "GROUP BY n.type")
        Iterable<Object[]> countUnreadByType(@Param("userId") Long userId);
}