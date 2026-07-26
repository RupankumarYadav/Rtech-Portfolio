package com.rtech.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year_range")
    private String yearRange;

    private String degree;
    private String school;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public Long getId() { return id; }
    public String getYearRange() { return yearRange; }
    public void setYearRange(String yearRange) { this.yearRange = yearRange; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}