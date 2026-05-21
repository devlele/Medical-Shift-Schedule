package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.UserRole;

public record ManagerResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String cargo,
        UserRole role,
        Long hospitalId,
        String hospitalNome,
        Long setorId,
        String setorNome,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm) {

    public static ManagerResponse from(Manager manager) {
        var hospital = manager.getHospital();
        var setor = manager.getSetor();

        return new ManagerResponse(
                manager.getId(),
                manager.getName(),
                manager.getEmail(),
                manager.getCpf(),
                manager.getCargo(),
                manager.getRole(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                manager.getAtivo(),
                manager.getCriadoEm(),
                manager.getAtualizadoEm());
    }
}
