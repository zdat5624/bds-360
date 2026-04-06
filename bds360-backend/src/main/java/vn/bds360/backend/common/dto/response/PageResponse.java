package vn.bds360.backend.common.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    @Schema(description = "Trang hiện tại", requiredMode = Schema.RequiredMode.REQUIRED)
    private int currentPage;

    @Schema(description = "Tổng số trang", requiredMode = Schema.RequiredMode.REQUIRED)
    private int totalPages;

    @Schema(description = "Kích thước trang", requiredMode = Schema.RequiredMode.REQUIRED)
    private int pageSize;

    @Schema(description = "Tổng số phần tử", requiredMode = Schema.RequiredMode.REQUIRED)
    private long totalElements;

    @Schema(description = "Danh sách dữ liệu", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<T> content;

    // ==========================================
    // Hàm Factory nhận vào Spring Page
    // ==========================================
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .content(page.getContent())
                .build();
    }
}