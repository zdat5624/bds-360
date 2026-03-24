package vn.bds360.backend.modules.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.bds360.backend.modules.post.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
