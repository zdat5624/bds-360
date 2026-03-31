package vn.bds360.backend.modules.transaction.dto.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.user.dto.response.UserResponse;

@Getter
@Setter
public class TransactionResponse {

    private Long id;

    private Long amount;

    private TransStatusEnum status;

    private String paymentLink;

    private String txnId;

    private String description;

    private Instant createdAt;

    private Instant updatedAt;

    private UserResponse user;
}