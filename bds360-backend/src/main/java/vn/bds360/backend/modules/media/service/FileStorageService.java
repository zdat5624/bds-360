package vn.bds360.backend.modules.media.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;

@Slf4j
@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Mang hằng số quy định nghiệp vụ xuống Service
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "image/bmp", "image/tiff", "image/heic", "image/avif", "image/apng");
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info(">>> Tạo thư mục lưu trữ thành công: {}", uploadDir);
            }
        } catch (Exception e) {
            log.error(">>> Không thể tạo thư mục lưu trữ: {}. Lỗi: {}", uploadDir, e.getMessage());
        }
    }

    // ==========================================
    // LƯU ẢNH (Có validate định dạng ảnh)
    // ==========================================
    public String storeImage(MultipartFile file) {
        validateFileSize(file);

        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new AppException(ErrorCode.FILE_FORMAT_INVALID);
        }

        return executeSave(file);
    }

    // ==========================================
    // LƯU FILE BẤT KỲ (Chỉ validate dung lượng)
    // ==========================================
    public String storeFile(MultipartFile file) {
        validateFileSize(file);
        return executeSave(file);
    }

    // ==========================================
    // CÁC HÀM HELPER NỘI BỘ
    // ==========================================
    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    private String executeSave(MultipartFile file) {
        try {
            String uniqueId = UUID.randomUUID().toString();
            String originalFilename = file.getOriginalFilename();
            String extension = StringUtils.getFilenameExtension(originalFilename);
            String finalExtension = (extension != null && !extension.isEmpty()) ? "." + extension : "";

            String fileName = uniqueId + finalExtension;
            Path filePath = Paths.get(uploadDir).resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            log.error("Lỗi lưu file: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}