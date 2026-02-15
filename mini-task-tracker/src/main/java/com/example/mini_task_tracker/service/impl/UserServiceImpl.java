package com.example.mini_task_tracker.service.impl;

import com.example.mini_task_tracker.dto.LoginRequest;
import com.example.mini_task_tracker.dto.LoginResponse;
import com.example.mini_task_tracker.dto.RefreshTokenResponse;
import com.example.mini_task_tracker.dto.RegisterRequest;
import com.example.mini_task_tracker.dto.UserResponse;
import com.example.mini_task_tracker.entity.RefreshToken;
import com.example.mini_task_tracker.entity.User;
import com.example.mini_task_tracker.exception.CustomException;
import com.example.mini_task_tracker.repository.UserRepository;
import com.example.mini_task_tracker.service.RefreshTokenService;
import com.example.mini_task_tracker.service.UserService;
import com.example.mini_task_tracker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists", HttpStatus.CONFLICT);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException("Username already exists", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .hashedPassword(passwordEncoder.encode(request.getPassword()))
                .createdAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new CustomException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken.getToken())
                .type("Bearer")
                .user(userResponse)
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken);
        refreshTokenService.verifyExpiration(token);

        User user = token.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getEmail());

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .type("Bearer")
                .build();
    }
}
