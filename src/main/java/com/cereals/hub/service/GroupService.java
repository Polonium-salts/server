package com.cereals.hub.service;

import com.cereals.hub.model.Group;
import com.cereals.hub.model.GroupMember;
import com.cereals.hub.repository.GroupMemberRepository;
import com.cereals.hub.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    
    public Group createGroup(String name, Long createdBy) {
        Group group = new Group(name, createdBy);
        Group savedGroup = groupRepository.save(group);
        
        // Add creator as admin member
        GroupMember member = new GroupMember(savedGroup.getId(), createdBy);
        member.setRole("ADMIN");
        groupMemberRepository.save(member);
        
        return savedGroup;
    }
    
    public List<Group> getUserGroups(Long userId) {
        return groupRepository.findByCreatedBy(userId);
    }
    
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }
    
    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }
    
    public Group updateGroup(Long groupId, String name, String description) {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        if (groupOptional.isPresent()) {
            Group group = groupOptional.get();
            if (name != null) {
                group.setName(name);
            }
            if (description != null) {
                group.setDescription(description);
            }
            return groupRepository.save(group);
        }
        throw new RuntimeException("Group not found with id: " + groupId);
    }
    
    public void deleteGroup(Long groupId) {
        groupRepository.deleteById(groupId);
    }
    
    public GroupMember addMemberToGroup(Long groupId, Long userId) {
        Optional<GroupMember> existingMember = groupMemberRepository.findByGroupIdAndUserId(groupId, userId);
        if (existingMember.isPresent()) {
            throw new RuntimeException("User is already a member of this group");
        }
        
        GroupMember member = new GroupMember(groupId, userId);
        return groupMemberRepository.save(member);
    }
    
    public List<GroupMember> getGroupMembers(Long groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }
    
    public List<GroupMember> getUserGroupMemberships(Long userId) {
        return groupMemberRepository.findByUserId(userId);
    }
    
    public void removeMemberFromGroup(Long groupId, Long userId) {
        Optional<GroupMember> memberOptional = groupMemberRepository.findByGroupIdAndUserId(groupId, userId);
        if (memberOptional.isPresent()) {
            groupMemberRepository.delete(memberOptional.get());
        } else {
            throw new RuntimeException("User is not a member of this group");
        }
    }
}