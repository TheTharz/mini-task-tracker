package com.example.mini_task_tracker.service.impl;

import com.example.mini_task_tracker.entity.RefreshToken;
import com.example.mini_task_tracker.entity.User;
import com.example.mini_task_tracker.exception.CustomException;
import com.example.mini_task_tracker.repository.RefreshTokenRepository;
import com.example.mini_task_tracker.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenExpiration;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusNanos(refreshTokenExpiration * 1_000_000))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new CustomException("Refresh token expired. Please login again", HttpStatus.UNAUTHORIZED);
        }
        return token;
    }

    @Override
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException("Invalid refresh token", HttpStatus.UNAUTHORIZED));
    }

    @Override
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Override
    @Transactional
    public void deleteRefreshToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }
}
