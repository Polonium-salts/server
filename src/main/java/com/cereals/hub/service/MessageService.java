package com.cereals.hub.service;

import com.cereals.hub.model.Message;
import com.cereals.hub.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        Message message = new Message(senderId, content);
        message.setReceiverId(receiverId);
        return messageRepository.save(message);
    }
    
    public Message sendGroupMessage(Long senderId, Long groupId, String content) {
        Message message = new Message(senderId, content);
        message.setGroupId(groupId);
        return messageRepository.save(message);
    }
    
    public List<Message> getPrivateMessagesBetweenUsers(Long userId, Long contactId) {
        return messageRepository.findPrivateMessagesBetweenUsers(userId, contactId);
    }
    
    public List<Message> getGroupMessages(Long groupId) {
        return messageRepository.findByGroupIdOrderByCreatedAtAsc(groupId);
    }
    
    public List<Message> getUserSentMessages(Long userId) {
        return messageRepository.findBySenderIdOrderByCreatedAtAsc(userId);
    }
    
    public List<Message> getUserReceivedMessages(Long userId) {
        return messageRepository.findByReceiverIdOrderByCreatedAtAsc(userId);
    }
    
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}