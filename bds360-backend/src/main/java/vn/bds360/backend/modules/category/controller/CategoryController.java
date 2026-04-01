package vn.bds360.backend.modules.category.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.category.dto.request.CategoryCreateRequest;
import vn.bds360.backend.modules.category.dto.request.CategoryFilterRequest;
import vn.bds360.backend.modules.category.dto.request.CategoryUpdateRequest;
import vn.bds360.backend.modules.category.dto.response.CategoryResponse;
import vn.bds360.backend.modules.category.service.CategoryService;
import vn.bds360.backend.security.annotation.IsAdmin;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
public class CategoryController {

    private final CategoryService categoryService;

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    @PostMapping("/admin/categories")
    @IsAdmin
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        return ApiResponse.success(categoryService.createCategory(request), "Tạo danh mục mới thành công");
    }

    @PutMapping("/admin/categories")
    @IsAdmin
    public ApiResponse<CategoryResponse> updateCategory(@Valid @RequestBody CategoryUpdateRequest request) {
        return ApiResponse.success(categoryService.updateCategory(request), "Cập nhật danh mục thành công");
    }

    @DeleteMapping("/admin/categories/{id}")
    @IsAdmin
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success(null, "Xóa danh mục thành công");
    }

    @GetMapping("/admin/categories")
    @IsAdmin
    public ApiResponse<PageResponse<CategoryResponse>> getCategoriesForAdmin(@Valid CategoryFilterRequest filter) {
        // Tận dụng class Filter để gộp cả phân trang và lọc type/name
        return ApiResponse.success(categoryService.getCategories(filter), "Lấy danh sách quản trị thành công");
    }

    // ==========================================
    // PUBLIC ENDPOINTS
    // ==========================================

    @GetMapping("/categories")
    public ApiResponse<PageResponse<CategoryResponse>> getCategories(@Valid CategoryFilterRequest filter) {
        return ApiResponse.success(categoryService.getCategories(filter), "Lấy danh sách danh mục thành công");
    }

    @GetMapping("/categories/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ApiResponse.success(categoryService.getCategoryById(id), "Lấy thông tin chi tiết danh mục thành công");
    }
}