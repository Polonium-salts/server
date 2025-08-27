package com.cereals.hub;

import com.cereals.hub.model.Message;
import com.cereals.hub.service.MessageService;
import com.cereals.hub.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MessageServiceTest {

    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserService userService;

    @Test
    public void testSendMessage() {
        // Send a message
        Message message = messageService.sendMessage(1L, 2L, "Hello, this is a test message!");
        
        assertNotNull(message);
        assertEquals(1L, message.getSenderId());
        assertEquals(2L, message.getReceiverId());
        assertEquals("Hello, this is a test message!", message.getContent());
        assertNotNull(message.getCreatedAt());
    }

    @Test
    public void testGetPrivateMessagesBetweenUsers() {
        // Send a few messages
        messageService.sendMessage(1L, 2L, "Message 1 from user 1 to user 2");
        messageService.sendMessage(2L, 1L, "Message 1 from user 2 to user 1");
        messageService.sendMessage(1L, 2L, "Message 2 from user 1 to user 2");
        
        // Get messages between users
        List<Message> messages = messageService.getPrivateMessagesBetweenUsers(1L, 2L);
        
        // Should have 3 messages
        assertEquals(3, messages.size());
    }
}