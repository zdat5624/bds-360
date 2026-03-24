package vn.bds360.backend.scheduler;

import java.time.Instant;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;

@Component
public class SystemJobScheduler {
    private final PostRepository postRepository;
    private final TransactionRepository transactionRepository;

    public SystemJobScheduler(PostRepository postRepository, TransactionRepository transactionRepository) {
        this.postRepository = postRepository;
        this.transactionRepository = transactionRepository;
    }

    @Scheduled(cron = "0 0 */6 * * *") // Chạy mỗi 6 giờ
    @Transactional
    public void updateExpiredPosts() {
        int updatedCount = postRepository.updateExpiredPosts(PostStatusEnum.EXPIRED, Instant.now());
        System.out.println("Updated " + updatedCount + " expired posts.");
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void updateExpiredTransactions() {
        Instant expiryTime = Instant.now().minusSeconds(15 * 60);
        int updatedCount = transactionRepository.updateExpiredTransactions(expiryTime);
        System.out.println(" Updated  " + updatedCount + " expired transaction.");
    }
}
