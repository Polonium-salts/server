package com.cereals.hub.controller;

import com.cereals.hub.model.User;
import com.cereals.hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping
    public String adminDashboard(Model model) {
        // Get statistics
        List<User> users = userService.findAll();
        long userCount = users.size();
        long onlineUserCount = users.stream().filter(User::isOnline).count();
        
        // Add statistics to model
        model.addAttribute("userCount", userCount);
        model.addAttribute("onlineUserCount", onlineUserCount);
        model.addAttribute("messageCount", 1250); // Placeholder value
        model.addAttribute("groupCount", 25); // Placeholder value
        
        return "admin/index";
    }
}