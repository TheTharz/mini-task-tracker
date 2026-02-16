package com.example.mini_task_tracker.repository;

import com.example.mini_task_tracker.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByUserId(UUID userId, Pageable pageable);
    
    @Query(value = "SELECT * FROM tasks t WHERE t.user_id = CAST(:userId AS uuid) " +
           "AND (CAST(:status AS text) IS NULL OR t.status = CAST(:status AS task_status)) " +
           "AND (CAST(:priority AS text) IS NULL OR t.priority = CAST(:priority AS text)) " +
           "AND (CAST(:search AS text) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) " +
           "     OR LOWER(t.description) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))) " +
           "AND (CAST(:dueDateFrom AS timestamp) IS NULL OR t.due_date >= CAST(:dueDateFrom AS timestamp)) " +
           "AND (CAST(:dueDateTo AS timestamp) IS NULL OR t.due_date <= CAST(:dueDateTo AS timestamp))",
           countQuery = "SELECT COUNT(*) FROM tasks t WHERE t.user_id = CAST(:userId AS uuid) " +
           "AND (CAST(:status AS text) IS NULL OR t.status = CAST(:status AS task_status)) " +
           "AND (CAST(:priority AS text) IS NULL OR t.priority = CAST(:priority AS text)) " +
           "AND (CAST(:search AS text) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) " +
           "     OR LOWER(t.description) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))) " +
           "AND (CAST(:dueDateFrom AS timestamp) IS NULL OR t.due_date >= CAST(:dueDateFrom AS timestamp)) " +
           "AND (CAST(:dueDateTo AS timestamp) IS NULL OR t.due_date <= CAST(:dueDateTo AS timestamp))",
           nativeQuery = true)
    Page<Task> findByUserIdWithFilters(
        @Param("userId") UUID userId,
        @Param("status") String status,
        @Param("priority") String priority,
        @Param("search") String search,
        @Param("dueDateFrom") Instant dueDateFrom,
        @Param("dueDateTo") Instant dueDateTo,
        Pageable pageable
    );
}
