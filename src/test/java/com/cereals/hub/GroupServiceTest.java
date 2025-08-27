package com.cereals.hub;

import com.cereals.hub.model.Group;
import com.cereals.hub.model.GroupMember;
import com.cereals.hub.service.GroupService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class GroupServiceTest {

    @Autowired
    private GroupService groupService;

    @Test
    public void testCreateGroup() {
        // Create a group
        Group group = groupService.createGroup("Test Group", 1L);
        
        assertNotNull(group);
        assertEquals("Test Group", group.getName());
        assertEquals(1L, group.getCreatedBy());
        assertNotNull(group.getCreatedAt());
    }

    @Test
    public void testGetGroupById() {
        // Create a group first
        Group createdGroup = groupService.createGroup("Find Group Test", 1L);
        
        // Find the group
        Optional<Group> foundGroup = groupService.getGroupById(createdGroup.getId());
        
        assertTrue(foundGroup.isPresent());
        assertEquals("Find Group Test", foundGroup.get().getName());
    }

    @Test
    public void testAddMemberToGroup() {
        // Create a group first
        Group group = groupService.createGroup("Member Test Group", 1L);
        
        // Add a member
        GroupMember member = groupService.addMemberToGroup(group.getId(), 2L);
        
        assertNotNull(member);
        assertEquals(group.getId(), member.getGroupId());
        assertEquals(2L, member.getUserId());
        assertEquals("MEMBER", member.getRole());
    }
}