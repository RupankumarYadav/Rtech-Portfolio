package com.rtech.portfolio.controller;

import com.rtech.portfolio.model.*;
import com.rtech.portfolio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired private ProjectRepository projectRepo;
    @Autowired private SkillRepository skillRepo;
    @Autowired private AchievementRepository achievementRepo;
    @Autowired private EducationRepository educationRepo;
    @Autowired private PersonalInfoRepository personalInfoRepo;

    // Folder jahan photo/resume save honge (frontend/assets)
    @Value("${app.upload.dir}")
    private String uploadDir;

    // ── PROJECTS ──
    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projectRepo.findByIsActiveOrderByDisplayOrderAsc(true);
    }

    @PostMapping("/projects")
    public Project addProject(@RequestBody Project p) {
        return projectRepo.save(p);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project p) {
        return projectRepo.findById(id).map(existing -> {
            existing.setTitle(p.getTitle());
            existing.setDescription(p.getDescription());
            existing.setTechStack(p.getTechStack());
            existing.setGithubUrl(p.getGithubUrl());
            existing.setDemoUrl(p.getDemoUrl());
            existing.setEmoji(p.getEmoji());
            existing.setBanner(p.getBanner());
            existing.setDisplayOrder(p.getDisplayOrder());
            existing.setIsActive(p.getIsActive());
            return ResponseEntity.ok(projectRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── SKILLS ──
    @GetMapping("/skills")
    public List<Skill> getSkills() {
        return skillRepo.findAllByOrderByDisplayOrderAsc();
    }

    @PostMapping("/skills")
    public Skill addSkill(@RequestBody Skill s) {
        return skillRepo.save(s);
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill s) {
        return skillRepo.findById(id).map(existing -> {
            existing.setIcon(s.getIcon());
            existing.setName(s.getName());
            existing.setColor(s.getColor());
            existing.setTags(s.getTags());
            existing.setDisplayOrder(s.getDisplayOrder());
            return ResponseEntity.ok(skillRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── ACHIEVEMENTS ──
    @GetMapping("/achievements")
    public List<Achievement> getAchievements() {
        return achievementRepo.findAll();
    }

    @PostMapping("/achievements")
    public Achievement addAchievement(@RequestBody Achievement a) {
        return achievementRepo.save(a);
    }

    @PutMapping("/achievements/{id}")
    public ResponseEntity<Achievement> updateAchievement(@PathVariable Long id, @RequestBody Achievement a) {
        return achievementRepo.findById(id).map(existing -> {
            existing.setIcon(a.getIcon());
            existing.setTitle(a.getTitle());
            existing.setIssuer(a.getIssuer());
            existing.setDateYear(a.getDateYear());
            existing.setLink(a.getLink());
            existing.setColor(a.getColor());
            return ResponseEntity.ok(achievementRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/achievements/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        achievementRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── EDUCATION ──
    @GetMapping("/education")
    public List<Education> getEducation() {
        return educationRepo.findAllByOrderByDisplayOrderAsc();
    }

    @PostMapping("/education")
    public Education addEducation(@RequestBody Education e) {
        return educationRepo.save(e);
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable Long id, @RequestBody Education e) {
        return educationRepo.findById(id).map(existing -> {
            existing.setYearRange(e.getYearRange());
            existing.setDegree(e.getDegree());
            existing.setSchool(e.getSchool());
            existing.setDisplayOrder(e.getDisplayOrder());
            return ResponseEntity.ok(educationRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ══════════════════════════════════════════════════════════
    // ── PROFILE (Home / About / Contact info) ──
    // personal_info table ek key-value store hai.
    // GET sab key-value laata hai ek Map ke roop mein.
    // PUT jo bhi keys bheji jaayein unhe save/update kar deta hai.
    // ══════════════════════════════════════════════════════════

    @GetMapping("/profile")
    public Map<String, String> getProfile() {
        Map<String, String> map = new HashMap<>();
        for (PersonalInfo info : personalInfoRepo.findAll()) {
            map.put(info.getInfoKey(), info.getInfoValue());
        }
        return map;
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody Map<String, String> data) {
        for (Map.Entry<String, String> entry : data.entrySet()) {
            PersonalInfo info = personalInfoRepo.findByInfoKey(entry.getKey())
                    .orElseGet(PersonalInfo::new);
            info.setInfoKey(entry.getKey());
            info.setInfoValue(entry.getValue());
            personalInfoRepo.save(info);
        }
        return ResponseEntity.ok(getProfile());
    }

    // ══════════════════════════════════════════════════════════
    // ── PHOTO & RESUME UPLOAD ──
    // File ko frontend/assets folder mein save karta hai aur
    // personal_info table mein path bhi update kar deta hai.
    // ══════════════════════════════════════════════════════════

    @PostMapping("/upload-photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        return handleUpload(file, "photo", "photo");
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<Map<String, String>> uploadResume(@RequestParam("file") MultipartFile file) {
        return handleUpload(file, "resume", "resume");
    }

    private ResponseEntity<Map<String, String>> handleUpload(MultipartFile file, String filePrefix, String infoKey) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File khaali hai"));
            }

            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }

            String filename = filePrefix + ext;

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File dest = new File(dir, filename);
            file.transferTo(dest);

            String relativePath = "assets/" + filename;

            PersonalInfo info = personalInfoRepo.findByInfoKey(infoKey).orElseGet(PersonalInfo::new);
            info.setInfoKey(infoKey);
            info.setInfoValue(relativePath);
            personalInfoRepo.save(info);

            Map<String, String> resp = new HashMap<>();
            resp.put("path", relativePath);
            resp.put("message", "Upload successful");
            return ResponseEntity.ok(resp);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
