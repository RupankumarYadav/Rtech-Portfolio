package com.rtech.portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // GET /api/admin/verify — admin login isse token check karta hai.
    // Token galat ho to AdminAuthInterceptor pehle hi 401 de deta hai.
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verify() {
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
