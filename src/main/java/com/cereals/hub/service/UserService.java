package com.cereals.hub.service;

import com.cereals.hub.model.User;
import com.cereals.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(String username, String email, String password) {
        // Check if user already exists
        if (userRepository.findByUsernameOrEmail(username, email).isPresent()) {
            throw new RuntimeException("User with this username or email already exists");
        }
        
        // Create new user
        User user = new User(username, email, passwordEncoder.encode(password));
        user.setDisplayName(username);
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username, email);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User updateUserStatus(Long userId, boolean isOnline) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setOnline(isOnline);
            user.setLastActive(LocalDateTime.now());
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with id: " + userId);
    }
    
    public User updateUserProfile(Long userId, String displayName, String avatarUrl) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (displayName != null) {
                user.setDisplayName(displayName);
            }
            if (avatarUrl != null) {
                user.setAvatarUrl(avatarUrl);
            }
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with id: " + userId);
    }
}