package com.rtech.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
        System.out.println("========================================");
        System.out.println("  RTech Portfolio Backend Started!");
        System.out.println("  API: http://localhost:8080/api");
        System.out.println("========================================");
    }
}
