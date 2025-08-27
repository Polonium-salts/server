package com.cereals.hub.service;

import com.cereals.hub.model.Contact;
import com.cereals.hub.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    public Contact addContact(Long userId, Long contactId) {
        // Check if contact already exists
        Contact contact = new Contact(userId, contactId);
        return contactRepository.save(contact);
    }
    
    public List<Contact> getUserContacts(Long userId) {
        return contactRepository.findByUserId(userId);
    }
    
    public List<Contact> getAllUserContacts(Long userId) {
        return contactRepository.findContactsByUserId(userId);
    }
    
    public void removeContact(Long userId, Long contactId) {
        List<Contact> contacts = contactRepository.findAll();
        for (Contact contact : contacts) {
            if ((contact.getUserId().equals(userId) && contact.getContactId().equals(contactId)) ||
                (contact.getUserId().equals(contactId) && contact.getContactId().equals(userId))) {
                contactRepository.delete(contact);
                return;
            }
        }
    }
}