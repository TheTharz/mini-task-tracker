package com.example.mini_task_tracker.dto;

import com.example.mini_task_tracker.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private String priority;
    private Instant dueDate;
    private Instant createdAt;
    private Instant updatedAt;
    private UUID userId;
}
