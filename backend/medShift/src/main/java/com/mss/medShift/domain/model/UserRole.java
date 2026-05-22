package com.mss.medShift.domain.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum UserRole {
    ADMIN("admin"),
    HOSPITAL("hospital"),
    ESCALISTA("escalista"),
    MEDICO("medico"),

    /**
     * Legacy alias kept while controllers/routes still use manager naming.
     */
    MANAGER("manager"),

    /**
     * Legacy alias kept while controllers/routes still use doctor naming.
     */
    DOCTOR("doctor");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (this) {
            case ADMIN -> List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            case HOSPITAL -> List.of(new SimpleGrantedAuthority("ROLE_HOSPITAL"));
            case ESCALISTA, MANAGER -> List.of(
                    new SimpleGrantedAuthority("ROLE_ESCALISTA"),
                    new SimpleGrantedAuthority("ROLE_MANAGER"));
            case MEDICO, DOCTOR -> List.of(
                    new SimpleGrantedAuthority("ROLE_MEDICO"),
                    new SimpleGrantedAuthority("ROLE_DOCTOR"));
        };
    }
}
