package vn.bds360.backend.modules.media.service;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {

    // Thư mục lưu file
    // private final String uploadDir = "src/main/resources/static/uploads";
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
                System.out.println("Tạo thư mục lưu trữ thành công: {}" + uploadDir);
            }
        } catch (Exception e) {
            System.out.println("Không thể tạo thư mục lưu trữ: {}. Lỗi: {}" + uploadDir + e.getMessage());
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            String uniqueId = UUID.randomUUID().toString();
            String fileName = uniqueId + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
