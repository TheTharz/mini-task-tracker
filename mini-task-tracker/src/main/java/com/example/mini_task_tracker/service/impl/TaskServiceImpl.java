package com.example.mini_task_tracker.service.impl;

import com.example.mini_task_tracker.dto.CreateTaskRequest;
import com.example.mini_task_tracker.dto.TaskResponse;
import com.example.mini_task_tracker.dto.UpdateTaskRequest;
import com.example.mini_task_tracker.entity.Task;
import com.example.mini_task_tracker.entity.TaskStatus;
import com.example.mini_task_tracker.exception.CustomException;
import com.example.mini_task_tracker.repository.TaskRepository;
import com.example.mini_task_tracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, String userId) {
        // Build task
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .userId(UUID.fromString(userId))
                .build();

        // Save task
        Task savedTask = taskRepository.save(task);

        // Return response
        return mapToTaskResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByUserId(String userId, Pageable pageable) {
        UUID userUuid = UUID.fromString(userId);
        Page<Task> tasks = taskRepository.findByUserId(userUuid, pageable);
        return tasks.map(this::mapToTaskResponse);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, String userId) {
        UUID userUuid = UUID.fromString(userId);
        
        // Find the task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new CustomException("Task not found", HttpStatus.NOT_FOUND));
        
        // Verify the task belongs to the user
        if (!task.getUserId().equals(userUuid)) {
            throw new CustomException("You don't have permission to edit this task", HttpStatus.FORBIDDEN);
        }
        
        // Update fields if provided
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        
        // Save updated task
        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskId, String userId) {
        UUID userUuid = UUID.fromString(userId);
        
        // Find the task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new CustomException("Task not found", HttpStatus.NOT_FOUND));
        
        // Verify the task belongs to the user
        if (!task.getUserId().equals(userUuid)) {
            throw new CustomException("You don't have permission to delete this task", HttpStatus.FORBIDDEN);
        }
        
        // Delete the task
        taskRepository.delete(task);
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .userId(task.getUserId())
                .build();
    }
}
