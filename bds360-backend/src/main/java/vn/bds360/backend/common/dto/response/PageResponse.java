package vn.bds360.backend.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import org.springframework.data.domain.Page;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private int currentPage;
    private int totalPages;
    private int pageSize;
    private long totalElements;

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