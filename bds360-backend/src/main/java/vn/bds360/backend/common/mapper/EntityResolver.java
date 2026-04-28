package vn.bds360.backend.common.mapper;

import org.mapstruct.Named;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
@Named("EntityResolver")
public class EntityResolver {

    @PersistenceContext
    private EntityManager entityManager;

    @Named("toEntity")
    public <T> T resolve(Long id, @TargetType Class<T> entityClass) {
        if (id == null) {
            return null;
        }
        return entityManager.getReference(entityClass, id);
    }
}