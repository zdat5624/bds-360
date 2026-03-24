package vn.bds360.backend.modules.statistics.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyRevenueDTO {
    private Integer month; // Tháng (1-12)
    private Long revenue; // Doanh thu của tháng (tổng amount của giao dịch SUCCESS)

    public MonthlyRevenueDTO(Integer month, Long revenue) {
        this.month = month;
        this.revenue = revenue;
    }
}