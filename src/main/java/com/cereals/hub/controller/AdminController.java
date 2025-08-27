package com.cereals.hub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping
    public String adminDashboard(Model model) {
        // 添加一些示例数据
        model.addAttribute("userCount", 1234);
        model.addAttribute("onlineUserCount", 856);
        model.addAttribute("messageCount", 12456);
        model.addAttribute("groupCount", 128);
        
        return "admin/index";
    }

    @GetMapping("/users")
    public String usersManagement(Model model) {
        return "admin/users";
    }

    @GetMapping("/groups")
    public String groupsManagement(Model model) {
        return "admin/groups";
    }

    @GetMapping("/messages")
    public String messagesManagement(Model model) {
        return "admin/messages";
    }

    @GetMapping("/settings")
    public String settingsManagement(Model model) {
        return "admin/settings";
    }
}