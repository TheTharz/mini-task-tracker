package com.example.mini_task_tracker.controller;

import com.example.mini_task_tracker.dto.LoginRequest;
import com.example.mini_task_tracker.dto.LoginResponse;
import com.example.mini_task_tracker.dto.RefreshTokenRequest;
import com.example.mini_task_tracker.dto.RefreshTokenResponse;
import com.example.mini_task_tracker.dto.RegisterRequest;
import com.example.mini_task_tracker.dto.UserResponse;
import com.example.mini_task_tracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for user registration and authentication")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user with username, email and password")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Get a new access token using refresh token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = userService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Logout user by invalidating the refresh token")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        userService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user", description = "Get the authenticated user's information")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        @SuppressWarnings("unchecked")
        Map<String, String> principal = (Map<String, String>) authentication.getPrincipal();
        String userId = principal.get("userId");
        UserResponse response = userService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }
}
