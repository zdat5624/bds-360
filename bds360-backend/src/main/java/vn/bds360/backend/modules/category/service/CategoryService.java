package vn.bds360.backend.modules.category.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.constant.PostTypeEnum;
import vn.bds360.backend.modules.category.entity.Category;
import vn.bds360.backend.modules.category.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category) {
        Optional<Category> existingCategory = categoryRepository.findById(category.getId());
        if (existingCategory.isPresent()) {
            Category updatedCategory = existingCategory.get();
            updatedCategory.setName(category.getName());
            updatedCategory.setType(category.getType());
            return categoryRepository.save(updatedCategory);
        }
        throw new RuntimeException("Không tìm thấy category với id: " + category.getId());
    }

    public void deleteCategory(Long id) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            categoryRepository.deleteById(id);
            return;
        }
        throw new RuntimeException("Không tìm thấy category với id: " + id);
    }

    public Page<Category> getCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));
    }

    public Page<Category> getCategoriesForAdmin(PostTypeEnum type, Pageable pageable) {
        return categoryRepository.findByNameContainingAndType(type, pageable);
    }

}
