package com.rtech.portfolio.service;

import com.rtech.portfolio.model.ContactMessage;
import com.rtech.portfolio.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository repo;

    public ContactMessage save(ContactMessage msg) {
        return repo.save(msg);
    }

    public List<ContactMessage> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return repo.countByIsRead(false);
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage msg = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found: " + id));
        msg.setIsRead(true);
        return repo.save(msg);
    }
     public void delete(Long id) {
        repo.deleteById(id);
    }
}
