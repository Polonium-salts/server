package com.cereals.hub.controller;

import com.cereals.hub.model.Contact;
import com.cereals.hub.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public Contact addContact(@RequestParam Long userId, @RequestParam Long contactId) {
        return contactService.addContact(userId, contactId);
    }

    @GetMapping("/{userId}")
    public List<Contact> getUserContacts(@PathVariable Long userId) {
        return contactService.getUserContacts(userId);
    }

    @DeleteMapping
    public void removeContact(@RequestParam Long userId, @RequestParam Long contactId) {
        contactService.removeContact(userId, contactId);
    }
}