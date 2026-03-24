package vn.bds360.backend.modules.media.controller;

import java.util.Collections;
import java.util.List;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.bds360.backend.modules.media.service.FileStorageService;

@RestController
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", // JPG, JPEG
            "image/png", // PNG
            "image/gif", // GIF
            "image/webp", // WebP
            "image/bmp", // BMP
            "image/tiff", // TIFF
            "image/heic", // HEIC
            "image/avif", // AVIF
            "image/apng");
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/api/upload/file")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        if (files.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonList("No files uploaded!"));
        }

        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = fileStorageService.storeFile(file);
            fileNames.add(fileName);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(fileNames);
    }

    @PostMapping("/api/upload/img")
    public ResponseEntity<?> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        if (files.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "No files uploaded!"));
        }

        List<String> fileNames = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.getSize() > MAX_FILE_SIZE) {
                errors.add(file.getOriginalFilename() + " exceeds 50MB limit");
                continue;
            }

            if (!ALLOWED_TYPES.contains(file.getContentType())) {
                errors.add(file.getOriginalFilename() + " is not a valid image file");
                continue;
            }

            String fileName = fileStorageService.storeFile(file);
            fileNames.add(fileName);
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("errors", errors));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("uploaded", fileNames));
    }

}
