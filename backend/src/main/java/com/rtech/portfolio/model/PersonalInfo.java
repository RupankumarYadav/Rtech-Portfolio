package com.rtech.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "personal_info")
public class PersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "info_key", unique = true, nullable = false)
    private String infoKey;

    @Column(name = "info_value", columnDefinition = "TEXT")
    private String infoValue;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInfoKey() { return infoKey; }
    public void setInfoKey(String infoKey) { this.infoKey = infoKey; }

    public String getInfoValue() { return infoValue; }
    public void setInfoValue(String infoValue) { this.infoValue = infoValue; }
}
