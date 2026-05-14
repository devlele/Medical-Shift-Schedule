package com.mss.medShift.controller.dto;

import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.UserRole;

public record AuthUserResponse(
        Long id,
        String name,
        String email,
        UserRole role) {

    public static AuthUserResponse from(UserDetails user) {
        if (user instanceof Doctor doctor) {
            return new AuthUserResponse(doctor.getId(), doctor.getName(), doctor.getEmail(), doctor.getRole());
        }
        if (user instanceof Hospital hospital) {
            return new AuthUserResponse(hospital.getId(), hospital.getNomeFantasia(), hospital.getEmail(), hospital.getRole());
        }
        if (user instanceof Manager manager) {
            return new AuthUserResponse(manager.getId(), manager.getName(), manager.getEmail(), manager.getRole());
        }
        return new AuthUserResponse(null, user.getUsername(), user.getUsername(), null);
    }
}
