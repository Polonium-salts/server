package com.cereals.hub.repository;

import com.cereals.hub.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrderByCreatedAtAsc(Long senderId);
    List<Message> findByReceiverIdOrderByCreatedAtAsc(Long receiverId);
    List<Message> findByGroupIdOrderByCreatedAtAsc(Long groupId);
    
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId AND m.receiverId = :contactId) OR (m.senderId = :contactId AND m.receiverId = :userId) ORDER BY m.createdAt ASC")
    List<Message> findPrivateMessagesBetweenUsers(@Param("userId") Long userId, @Param("contactId") Long contactId);
}