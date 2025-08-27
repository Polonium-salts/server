package com.cereals.hub.websocket;

import com.cereals.hub.model.User;
import com.cereals.hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.Map;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        // Handle user connection
        System.out.println("User connected: " + event.getMessage());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Handle user disconnection
        System.out.println("User disconnected: " + event.getMessage());
    }

    public void notifyUserStatusChange(Long userId, User.UserStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("status", status.name());
        response.put("type", "user_status_change");
        
        messagingTemplate.convertAndSend("/topic/user-status", response);
    }
}