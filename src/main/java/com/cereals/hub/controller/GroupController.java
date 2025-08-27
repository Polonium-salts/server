package com.cereals.hub.controller;

import com.cereals.hub.model.Group;
import com.cereals.hub.model.GroupMember;
import com.cereals.hub.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping
    public Group createGroup(@RequestParam String name, @RequestParam Long createdBy) {
        return groupService.createGroup(name, createdBy);
    }

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupService.getGroupById(id);
        return group.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Group updateGroup(@PathVariable Long id, 
                            @RequestParam(required = false) String name,
                            @RequestParam(required = false) String description) {
        return groupService.updateGroup(id, name, description);
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
    }

    @PostMapping("/{groupId}/members")
    public GroupMember addMember(@PathVariable Long groupId, @RequestParam Long userId) {
        return groupService.addMemberToGroup(groupId, userId);
    }

    @GetMapping("/{groupId}/members")
    public List<GroupMember> getGroupMembers(@PathVariable Long groupId) {
        return groupService.getGroupMembers(groupId);
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public void removeMember(@PathVariable Long groupId, @PathVariable Long userId) {
        groupService.removeMemberFromGroup(groupId, userId);
    }
}