package com.example.mini_task_tracker.service;

import com.example.mini_task_tracker.dto.CreateTaskRequest;
import com.example.mini_task_tracker.dto.TaskResponse;
import com.example.mini_task_tracker.dto.UpdateTaskRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TaskService {
    TaskResponse createTask(CreateTaskRequest request, String userId);
    Page<TaskResponse> getTasksByUserId(String userId, Pageable pageable);
    TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, String userId);
    void deleteTask(UUID taskId, String userId);
}
