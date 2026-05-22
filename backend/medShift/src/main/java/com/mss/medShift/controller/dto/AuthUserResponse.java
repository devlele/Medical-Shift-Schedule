package com.mss.medShift.controller.dto;

import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.model.UserRole;

public record AuthUserResponse(
        Long id,
        String name,
        String email,
        UserRole role) {

    public static AuthUserResponse from(UserDetails user) {
        if (user instanceof Usuario usuario) {
            return new AuthUserResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getRole());
        }
        return new AuthUserResponse(null, user.getUsername(), user.getUsername(), null);
    }
}
