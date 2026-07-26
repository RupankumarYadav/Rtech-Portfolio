package com.rtech.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank @Email
    @Column(nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String subject;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    // Getters & Setters
    public Long getId()                        { return id; }
    public String getName()                    { return name; }
    public void setName(String name)           { this.name = name; }
    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }
    public String getSubject()                 { return subject; }
    public void setSubject(String subject)     { this.subject = subject; }
    public String getMessage()                 { return message; }
    public void setMessage(String message)     { this.message = message; }
    public Boolean getIsRead()                 { return isRead; }
    public void setIsRead(Boolean isRead)      { this.isRead = isRead; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
}
