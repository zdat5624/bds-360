package vn.bds360.backend.modules.statistics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private Integer month; // Tháng (1-12)
    private Long revenue; // Doanh thu của tháng (tổng amount của giao dịch SUCCESS)

}