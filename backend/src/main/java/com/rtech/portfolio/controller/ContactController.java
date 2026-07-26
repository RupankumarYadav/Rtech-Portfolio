package com.rtech.portfolio.controller;

import com.rtech.portfolio.model.ContactMessage;
import com.rtech.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService service;

    // POST /api/contact — frontend form submit
    @PostMapping
    public ResponseEntity<Map<String, Object>> send(@Valid @RequestBody ContactMessage msg) {
        ContactMessage saved = service.save(msg);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Message received! I will reply within 24 hours.");
        res.put("id", saved.getId());
        return ResponseEntity.ok(res);
    }

    // GET /api/contact — all messages (admin ke liye)
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // GET /api/contact/unread — unread count
    @GetMapping("/unread")
    public ResponseEntity<Map<String, Long>> unread() {
        Map<String, Long> res = new HashMap<>();
        res.put("count", service.getUnreadCount());
        return ResponseEntity.ok(res);
    }

    // PUT /api/contact/{id}/read — mark as read
    @PutMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.ok().build();
}
}
