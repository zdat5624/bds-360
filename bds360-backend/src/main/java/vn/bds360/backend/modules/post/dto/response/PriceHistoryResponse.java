// vn/bds360/backend/modules/post/dto/response/PriceHistoryResponse.java
package vn.bds360.backend.modules.post.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PriceHistoryResponse {
    private String note; // Thông báo Fallback (nếu có)
    private PriceSummary summary;
    private List<PriceTrend> trend;

    @Data
    @Builder
    public static class PriceSummary {
        private Double currentAvgPrice; // Giá trung bình tháng hiện tại
        private Double changePercent; // % thay đổi
        private Double peakPrice; // Giá đỉnh
        private String peakMonth; // Tháng lập đỉnh
        private Double dropFromPeakPercent; // % rớt từ đỉnh
    }

    @Data
    @Builder
    public static class PriceTrend {
        private String month; // "YYYY-MM"
        private Double minPrice;
        private Double maxPrice;
        private Double avgPrice;
    }
}