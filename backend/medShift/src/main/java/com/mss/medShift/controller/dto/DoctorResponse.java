package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.UserRole;

public record DoctorResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String crm,
        String ufCrm,
        String telefone,
        String specialty,
        UserRole role,
        Long hospitalId,
        String hospitalNome,
        Long setorId,
        String setorNome,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm) {

    public static DoctorResponse from(Doctor doctor) {
        var hospital = doctor.getHospital();
        var setor = doctor.getSetor();

        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCpf(),
                doctor.getCrm(),
                doctor.getUfCrm(),
                doctor.getTelefone(),
                doctor.getSpecialty(),
                doctor.getRole(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                doctor.getAtivo(),
                doctor.getCriadoEm(),
                doctor.getAtualizadoEm());
    }
}
