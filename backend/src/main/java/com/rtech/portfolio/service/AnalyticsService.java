package com.rtech.portfolio.service;

import com.rtech.portfolio.model.PageVisitor;
import com.rtech.portfolio.model.Project;
import com.rtech.portfolio.model.ProjectStat;
import com.rtech.portfolio.repository.PageVisitorRepository;
import com.rtech.portfolio.repository.ProjectRepository;
import com.rtech.portfolio.repository.ProjectStatRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;


@Service
public class AnalyticsService {

    @Autowired private PageVisitorRepository visitorRepo;
    @Autowired private ProjectStatRepository projectRepo;
    @Autowired private ProjectRepository projectDataRepo;

    public void trackVisit(HttpServletRequest request, String page) {
        PageVisitor v = new PageVisitor();
        v.setIpAddress(request.getRemoteAddr());
        v.setPageVisited(page);
        visitorRepo.save(v);
    }

    public long getTotalVisitors() {
        return visitorRepo.count();
    }

    public Map<String, Long> getVisitorsByPage() {
        Map<String, Long> map = new HashMap<>();
        map.put("home",         visitorRepo.countByPageVisited("home"));
        map.put("about",        visitorRepo.countByPageVisited("about"));
        map.put("skills",       visitorRepo.countByPageVisited("skills"));
        map.put("projects",     visitorRepo.countByPageVisited("projects"));
        map.put("achievements", visitorRepo.countByPageVisited("achievements"));
        map.put("contact",      visitorRepo.countByPageVisited("contact"));
        return map;
    }

    public ProjectStat getOrCreate(String name) {
        return projectRepo.findByProjectName(name).orElseGet(() -> {
            ProjectStat s = new ProjectStat();
            s.setProjectName(name);
            s.setViewCount(0L);
            s.setLikeCount(0L);
            return projectRepo.save(s);
        });
    }

    public ProjectStat incrementView(String name) {
        ProjectStat s = getOrCreate(name);
        s.setViewCount(s.getViewCount() + 1);
        return projectRepo.save(s);
    }

    public ProjectStat toggleLike(String name, boolean liked) {
        ProjectStat s = getOrCreate(name);
        if (liked) {
            s.setLikeCount(s.getLikeCount() + 1);
        } else if (s.getLikeCount() > 0) {
            s.setLikeCount(s.getLikeCount() - 1);
        }
        return projectRepo.save(s);
    }

    public List<ProjectStat> getAllStats() {
     List<Project> allProjects = projectDataRepo.findByIsActiveOrderByDisplayOrderAsc(true);
     List<ProjectStat> stats = new ArrayList<>();
     for (Project p : allProjects) {
        String slug = p.getTitle().toLowerCase().replace(" ", "-");
        Optional<ProjectStat> byTitle = projectRepo.findByProjectName(p.getTitle());
        Optional<ProjectStat> bySlug  = projectRepo.findByProjectName(slug);
        ProjectStat s;
         if (byTitle.isPresent()) {
             s = byTitle.get();
         } else if (bySlug.isPresent()) {
            s = bySlug.get();
         } else {
            s = new ProjectStat();
            s.setProjectName(p.getTitle());
            s.setViewCount(0L);
            s.setLikeCount(0L);
            s = projectRepo.save(s);
        }
        stats.add(s);
     }
     return stats;
    }
}