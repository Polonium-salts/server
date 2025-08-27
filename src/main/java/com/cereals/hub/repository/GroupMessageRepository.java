package com.cereals.hub.repository;

import com.cereals.hub.model.Group;
import com.cereals.hub.model.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroupOrderByTimestampAsc(Group group);
}