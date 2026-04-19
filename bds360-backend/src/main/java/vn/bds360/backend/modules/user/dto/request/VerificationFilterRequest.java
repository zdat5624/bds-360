// --- File: user/dto/request/VerificationFilterRequest.java ---
package vn.bds360.backend.modules.user.dto.request;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;
import vn.bds360.backend.modules.user.constant.VerificationStatus;

@Getter
@Setter
public class VerificationFilterRequest extends BaseFilterRequest {

    private VerificationStatus status;

    // Tìm kiếm tương đối (LIKE) theo tên hoặc email của người dùng nộp đơn
    private String search;

    /*
     * * Ghi chú: Nhờ extends BaseFilterRequest, class này đã tự động có sẵn:
     * - int page
     * - int size
     * - String sortBy
     * - Sort.Direction sortDirection
     */
}