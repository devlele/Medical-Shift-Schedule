package com.mss.medShift.domain.model;

public enum UserRole {
    ADMIN("admin"),
    HOSPITAL("hospital"),
    MANAGER("manager"),
    DOCTOR("doctor");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
