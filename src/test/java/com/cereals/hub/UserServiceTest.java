package com.cereals.hub;

import com.cereals.hub.model.User;
import com.cereals.hub.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testRegisterUser() {
        // Register a new user
        User user = userService.registerUser("testuser", "test@example.com", "password123");
        
        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertTrue(user.getId() > 0);
    }

    @Test
    public void testFindUserByUsername() {
        // Register a user first
        userService.registerUser("finduser", "find@example.com", "password123");
        
        // Find the user
        Optional<User> foundUser = userService.findByUsername("finduser");
        
        assertTrue(foundUser.isPresent());
        assertEquals("finduser", foundUser.get().getUsername());
    }

    @Test
    public void testFindUserByEmail() {
        // Register a user first
        userService.registerUser("emailuser", "email@example.com", "password123");
        
        // Find the user by email
        Optional<User> foundUser = userService.findByEmail("email@example.com");
        
        assertTrue(foundUser.isPresent());
        assertEquals("email@example.com", foundUser.get().getEmail());
    }
}