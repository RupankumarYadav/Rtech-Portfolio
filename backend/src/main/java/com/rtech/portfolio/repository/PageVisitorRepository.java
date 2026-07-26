package com.rtech.portfolio.repository;

import com.rtech.portfolio.model.PageVisitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageVisitorRepository extends JpaRepository<PageVisitor, Long> {
    long countByPageVisited(String page);
}
