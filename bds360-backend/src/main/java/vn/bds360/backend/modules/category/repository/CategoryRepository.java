package vn.bds360.backend.modules.category.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.common.constant.PostTypeEnum;
import vn.bds360.backend.modules.category.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAll(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE " + "(:type IS NULL OR c.type = :type)")
    Page<Category> findByNameContainingAndType(
            @Param("type") PostTypeEnum type,
            Pageable pageable);
}
