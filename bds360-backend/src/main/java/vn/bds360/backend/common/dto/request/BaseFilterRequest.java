package vn.bds360.backend.common.dto.request;

import org.springframework.data.domain.Sort;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseFilterRequest {

    // Phân trang
    @Min(value = 0, message = "Trang (page) không được nhỏ hơn 0")
    private Integer page = 0;

    @Min(value = 1, message = "Kích thước trang (size) phải lớn hơn 0")
    @Max(value = 100, message = "Kích thước trang (size) tối đa là 100")
    private Integer size = 10;

    // Sắp xếp
    private String sortBy = "id";
    private Sort.Direction sortDirection = Sort.Direction.DESC;
}