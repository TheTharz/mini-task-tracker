package com.example.mini_task_tracker.service;

import com.example.mini_task_tracker.dto.RegisterRequest;
import com.example.mini_task_tracker.dto.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest request);
}
