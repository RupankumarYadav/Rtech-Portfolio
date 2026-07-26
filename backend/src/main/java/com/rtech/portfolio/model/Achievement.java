package com.rtech.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icon;

    @Column(nullable = false)
    private String title;

    private String issuer;

    @Column(name = "date_year")
    private String dateYear;

    private String link;
    private String color;

    public Long getId() { return id; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public String getDateYear() { return dateYear; }
    public void setDateYear(String dateYear) { this.dateYear = dateYear; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}