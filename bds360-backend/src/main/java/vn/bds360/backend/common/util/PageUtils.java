package vn.bds360.backend.common.util;

import org.springframework.data.domain.Page;
import vn.bds360.backend.common.dto.response.PageResponse;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PageUtils {

    /**
     * Hàm Generic: Biến mọi Page<T> thành PageResponse<R>
     */
    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapperFunction) {
        List<R> dtoList = page.getContent().stream()
                .map(mapperFunction)
                .collect(Collectors.toList());

        return PageResponse.<R>builder()
                .currentPage(page.getNumber()) // Tự map hàm của Spring
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .content(dtoList) // Nhét list đã map vào
                .build();
    }
}