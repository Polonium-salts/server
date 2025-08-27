package com.cereals.hub.controller;

import com.cereals.hub.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public Message sendPublicMessage(@Payload Message message) {
        // This method broadcasts messages to all users subscribed to /topic/messages
        return message;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload Message message) {
        // Send message to specific user
        messagingTemplate.convertAndSendToUser(
            String.valueOf(message.getReceiverId()), 
            "/queue/messages", 
            message
        );
    }

    @MessageMapping("/group-message")
    public void sendGroupMessage(@Payload Message message) {
        // Send message to group
        messagingTemplate.convertAndSend(
            "/topic/group/" + message.getGroupId(), 
            message
        );
    }
}