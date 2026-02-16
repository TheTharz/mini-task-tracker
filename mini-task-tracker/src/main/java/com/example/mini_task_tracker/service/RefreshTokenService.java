package com.example.mini_task_tracker.service;

import com.example.mini_task_tracker.entity.RefreshToken;
import com.example.mini_task_tracker.entity.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyExpiration(RefreshToken token);
    RefreshToken findByToken(String token);
    void deleteByUser(User user);
    void deleteRefreshToken(RefreshToken token);
}
