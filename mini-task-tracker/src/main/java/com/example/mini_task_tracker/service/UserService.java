package com.example.mini_task_tracker.service;

import com.example.mini_task_tracker.dto.LoginRequest;
import com.example.mini_task_tracker.dto.LoginResponse;
import com.example.mini_task_tracker.dto.RefreshTokenResponse;
import com.example.mini_task_tracker.dto.RegisterRequest;
import com.example.mini_task_tracker.dto.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    RefreshTokenResponse refreshToken(String refreshToken);
}
