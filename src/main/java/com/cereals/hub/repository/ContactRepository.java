package com.cereals.hub.repository;

import com.cereals.hub.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByUserId(Long userId);
    
    @Query("SELECT c FROM Contact c WHERE c.userId = :userId OR c.contactId = :userId")
    List<Contact> findContactsByUserId(@Param("userId") Long userId);
}