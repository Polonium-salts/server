package com.cereals.hub.controller;

import com.cereals.hub.model.Message;
import com.cereals.hub.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/private")
    public Message sendPrivateMessage(@RequestParam Long senderId, 
                                     @RequestParam Long receiverId, 
                                     @RequestParam String content) {
        return messageService.sendMessage(senderId, receiverId, content);
    }

    @PostMapping("/group")
    public Message sendGroupMessage(@RequestParam Long senderId, 
                                   @RequestParam Long groupId, 
                                   @RequestParam String content) {
        return messageService.sendGroupMessage(senderId, groupId, content);
    }

    @GetMapping("/private/{userId}/{contactId}")
    public List<Message> getPrivateMessages(@PathVariable Long userId, @PathVariable Long contactId) {
        return messageService.getPrivateMessagesBetweenUsers(userId, contactId);
    }

    @GetMapping("/group/{groupId}")
    public List<Message> getGroupMessages(@PathVariable Long groupId) {
        return messageService.getGroupMessages(groupId);
    }

    @GetMapping("/sent/{userId}")
    public List<Message> getSentMessages(@PathVariable Long userId) {
        return messageService.getUserSentMessages(userId);
    }

    @GetMapping("/received/{userId}")
    public List<Message> getReceivedMessages(@PathVariable Long userId) {
        return messageService.getUserReceivedMessages(userId);
    }
}