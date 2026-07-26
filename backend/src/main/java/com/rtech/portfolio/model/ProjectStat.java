package com.rtech.portfolio.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_stats")
public class ProjectStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name", nullable = false, unique = true)
    private String projectName;

    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "like_count")
    private Long likeCount = 0L;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void preUpdate() { this.lastUpdated = LocalDateTime.now(); }

    // Getters & Setters
    public Long getId()                              { return id; }
    public String getProjectName()                   { return projectName; }
    public void setProjectName(String projectName)   { this.projectName = projectName; }
    public Long getViewCount()                       { return viewCount; }
    public void setViewCount(Long viewCount)         { this.viewCount = viewCount; }
    public Long getLikeCount()                       { return likeCount; }
    public void setLikeCount(Long likeCount)         { this.likeCount = likeCount; }
    public LocalDateTime getLastUpdated()            { return lastUpdated; }
}
