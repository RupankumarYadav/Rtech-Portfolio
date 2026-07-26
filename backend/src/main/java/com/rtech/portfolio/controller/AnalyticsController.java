package com.rtech.portfolio.controller;

import com.rtech.portfolio.model.ProjectStat;
import com.rtech.portfolio.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService service;

    // POST /api/analytics/visit?page=home
    @PostMapping("/visit")
    public ResponseEntity<Map<String, Object>> track(
            @RequestParam String page,
            HttpServletRequest request) {
        service.trackVisit(request, page);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("page", page);
        return ResponseEntity.ok(res);
    }

    // GET /api/analytics/visitors
    @GetMapping("/visitors")
    public ResponseEntity<Map<String, Object>> visitors() {
        Map<String, Object> res = new HashMap<>();
        res.put("total", service.getTotalVisitors());
        res.put("byPage", service.getVisitorsByPage());
        return ResponseEntity.ok(res);
    }

    // GET /api/analytics/projects
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectStat>> projects() {
        return ResponseEntity.ok(service.getAllStats());
    }

    // POST /api/analytics/projects/{name}/view
    @PostMapping("/projects/{name}/view")
    public ResponseEntity<ProjectStat> view(@PathVariable String name) {
        return ResponseEntity.ok(service.incrementView(name));
    }

    // POST /api/analytics/projects/{name}/like?liked=true
    @PostMapping("/projects/{name}/like")
    public ResponseEntity<ProjectStat> like(
            @PathVariable String name,
            @RequestParam boolean liked) {
        return ResponseEntity.ok(service.toggleLike(name, liked));
    }
}
