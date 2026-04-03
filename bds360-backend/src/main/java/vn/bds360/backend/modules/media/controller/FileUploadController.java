package vn.bds360.backend.modules.media.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
// Thêm thư viện này của Spring
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.media.service.FileStorageService;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "media", description = "Quản lý upload hình ảnh và tệp tin")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload/file")
    public ApiResponse<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        validateEmptyFiles(files);

        List<String> fileUrls = files.stream()
                .map(file -> {
                    String fileName = fileStorageService.storeFile(file);
                    return buildFullUrl(fileName); // Biến tên file thành Full URL
                })
                .collect(Collectors.toList());

        return ApiResponse.success(fileUrls, "Upload tệp thành công");
    }

    @PostMapping("/upload/image")
    public ApiResponse<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        validateEmptyFiles(files);

        List<String> fileUrls = files.stream()
                .map(file -> {
                    String fileName = fileStorageService.storeImage(file);
                    return buildFullUrl(fileName); // Biến tên file thành Full URL
                })
                .collect(Collectors.toList());

        return ApiResponse.success(fileUrls, "Upload ảnh thành công");
    }

    // ==========================================
    // CÁC HÀM HELPER NỘI BỘ CHO CONTROLLER
    // ==========================================

    /**
     * Hàm tự động lấy Domain hiện tại (vd: http://localhost:8080)
     * ghép với đường dẫn /uploads/ và tên file.
     */
    private String buildFullUrl(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
    }

    private void validateEmptyFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty() || files.get(0).isEmpty()) {
            throw new AppException(ErrorCode.INVALID_PARAMETER);
        }
    }
}