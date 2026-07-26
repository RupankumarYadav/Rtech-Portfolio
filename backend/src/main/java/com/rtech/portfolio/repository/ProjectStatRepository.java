package com.rtech.portfolio.repository;

import com.rtech.portfolio.model.ProjectStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectStatRepository extends JpaRepository<ProjectStat, Long> {
    Optional<ProjectStat> findByProjectName(String projectName);
}
