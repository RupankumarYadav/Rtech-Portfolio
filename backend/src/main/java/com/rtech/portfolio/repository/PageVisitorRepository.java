package com.rtech.portfolio.repository;

import com.rtech.portfolio.model.PageVisitor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PageVisitorRepository extends JpaRepository<PageVisitor, Long> {
    long countByPageVisited(String page);

    // Admin ke "Recent Visitors" table ke liye — sabse naya pehle
    List<PageVisitor> findAllByOrderByVisitedAtDesc(Pageable pageable);
}
