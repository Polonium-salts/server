package com.cereals.hub.repository;

import com.cereals.hub.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    List<GroupMember> findByUserId(Long userId);
    Optional<GroupMember> findByGroupIdAndUserId(Long groupId, Long userId);
    
    @Query("SELECT gm.userId FROM GroupMember gm WHERE gm.groupId = :groupId")
    List<Long> findUserIdsByGroupId(@Param("groupId") Long groupId);
}