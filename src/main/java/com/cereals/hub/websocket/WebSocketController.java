package com.cereals.hub.websocket;

import com.cereals.hub.model.Message;
import com.cereals.hub.model.User;
import com.cereals.hub.service.MessageService;
import com.cereals.hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Map<String, Object> sendMessage(@Payload ChatMessage chatMessage) {
        // Create response message
        Map<String, Object> response = new HashMap<>();
        response.put("content", chatMessage.getContent());
        response.put("senderId", chatMessage.getSenderId());
        response.put("receiverId", chatMessage.getReceiverId());
        response.put("timestamp", LocalDateTime.now().toString());
        
        // Save message to database
        User sender = userService.findById(chatMessage.getSenderId()).orElse(null);
        User receiver = userService.findById(chatMessage.getReceiverId()).orElse(null);
        
        if (sender != null && receiver != null) {
            Message message = messageService.sendMessage(sender, receiver, chatMessage.getContent());
            response.put("messageId", message.getId());
        }
        
        return response;
    }

    @MessageMapping("/group-chat")
    @SendTo("/topic/group-messages")
    public Map<String, Object> sendGroupMessage(@Payload GroupChatMessage chatMessage) {
        // Create response message
        Map<String, Object> response = new HashMap<>();
        response.put("content", chatMessage.getContent());
        response.put("senderId", chatMessage.getSenderId());
        response.put("groupId", chatMessage.getGroupId());
        response.put("timestamp", LocalDateTime.now().toString());
        
        return response;
    }

    // DTOs
    public static class ChatMessage {
        private String content;
        private Long senderId;
        private Long receiverId;

        // Getters and setters
        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }
    }

    public static class GroupChatMessage {
        private String content;
        private Long senderId;
        private String groupId;

        // Getters and setters
        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public String getGroupId() {
            return groupId;
        }

        public void setGroupId(String groupId) {
            this.groupId = groupId;
        }
    }
}