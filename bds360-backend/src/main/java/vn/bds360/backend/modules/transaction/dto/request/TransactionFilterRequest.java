package vn.bds360.backend.modules.transaction.dto.request;

import java.time.Instant;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.TransactionStatus;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;
import vn.bds360.backend.modules.transaction.constant.TransactionFilterType;

@Getter
@Setter
public class TransactionFilterRequest extends BaseFilterRequest {

    // Ghi đè cột sắp xếp mặc định: Hiển thị giao dịch mới nhất lên đầu
    public TransactionFilterRequest() {
        super();
        this.setSortBy("createdAt");
    }

    private String email;
    private Long transactionId;
    private String txnId;
    private TransactionStatus status;
    private TransactionFilterType type = TransactionFilterType.ALL;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant endDate;
}