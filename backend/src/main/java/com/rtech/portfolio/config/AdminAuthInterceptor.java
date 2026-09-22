package com.rtech.portfolio.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Admin-only endpoints ko token se lock karta hai.
 *
 * Token Render ke Environment variable  ADMIN_TOKEN  mein rakha jata hai
 * (code ya GitHub mein nahi). Admin panel har request ke saath header
 * "X-Admin-Token" bhejta hai.
 *
 * PUBLIC (bina token):
 *   - GET  /api/portfolio/**      (website ka data)
 *   - POST /api/contact           (contact form)
 *   - /api/analytics/**           (visit / view / like / visitor counts)
 *     (except GET /api/analytics/visits/recent — IP addresses hain, protected hai)
 *
 * PROTECTED (token zaroori):
 *   - POST/PUT/DELETE /api/portfolio/**   (add / edit / delete / upload)
 *   - GET/PUT/DELETE  /api/contact/...    (messages padhna, read, delete)
 *   - GET  /api/analytics/visits/recent   (visitor IP / device list)
 *   - /api/admin/**
 *
 * Agar ADMIN_TOKEN set hi nahi hai to admin actions band rehte hain (safe default).
 */
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Value("${admin.token:}")
    private String adminToken;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // Browser ka CORS preflight — isme token nahi hota, isse rokna nahi hai
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (!isProtected(request.getMethod(), request.getRequestURI())) {
            return true;
        }

        String sent = request.getHeader("X-Admin-Token");
        if (adminToken != null && !adminToken.isBlank() && sent != null
                && MessageDigest.isEqual(
                        adminToken.getBytes(StandardCharsets.UTF_8),
                        sent.getBytes(StandardCharsets.UTF_8))) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Unauthorized\"}");
        return false;
    }

    private boolean isProtected(String method, String path) {
        if (path.length() > 1 && path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        if (path.startsWith("/api/admin")) {
            return true;
        }
        if (path.equals("/api/analytics/visits/recent")) {
            return true;
        }
        if (path.startsWith("/api/portfolio")) {
            return !"GET".equalsIgnoreCase(method);
        }
        if (path.startsWith("/api/contact")) {
            // Sirf contact form ka POST /api/contact public hai
            return !("POST".equalsIgnoreCase(method) && path.equals("/api/contact"));
        }
        return false;
    }
}
