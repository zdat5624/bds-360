package vn.bds360.backend.modules.transaction.dto.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;

@Getter
@Setter
public class TransactionResponse {

    private Long id;

    private Long amount;

    private TransactionStatus status;

    private String paymentLink;

    private String txnId;

    private String description;

    private Instant createdAt;

    private Instant updatedAt;

    private TransactionUserResponse user;

    @Getter
    @Setter
    public static class TransactionUserResponse {
        private Long id;
        private String name;
        private String email;
    }
}