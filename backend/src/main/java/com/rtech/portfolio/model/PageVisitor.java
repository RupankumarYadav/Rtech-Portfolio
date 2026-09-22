package com.rtech.portfolio.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "page_visitors")
public class PageVisitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "page_visited")
    private String pageVisited;

    @Column(name = "visited_at")
    private LocalDateTime visitedAt;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @PrePersist
    public void prePersist() { this.visitedAt = LocalDateTime.now(); }

    // Getters & Setters
    public Long getId()                            { return id; }
    public String getIpAddress()                   { return ipAddress; }
    public void setIpAddress(String ipAddress)     { this.ipAddress = ipAddress; }
    public String getPageVisited()                 { return pageVisited; }
    public void setPageVisited(String pageVisited) { this.pageVisited = pageVisited; }
    public LocalDateTime getVisitedAt()            { return visitedAt; }
    public String getUserAgent()                   { return userAgent; }
    public void setUserAgent(String userAgent)     { this.userAgent = userAgent; }
}
