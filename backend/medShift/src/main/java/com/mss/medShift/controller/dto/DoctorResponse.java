package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.MedicoSetor;
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
        List<DoctorSetorResponse> setores,
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
                setor != null ? List.of(DoctorSetorResponse.from(setor)) : List.of(),
                doctor.getAtivo(),
                doctor.getCriadoEm(),
                doctor.getAtualizadoEm());
    }

    public static DoctorResponse from(Doctor doctor, List<MedicoSetor> vinculos) {
        var hospital = doctor.getHospital();
        var setor = doctor.getSetor();
        var setores = vinculos == null
                ? List.<DoctorSetorResponse>of()
                : vinculos.stream()
                        .filter(vinculo -> vinculo.getAtivo() == null || vinculo.getAtivo())
                        .map(DoctorSetorResponse::from)
                        .toList();

        if (setores.isEmpty() && setor != null) {
            setores = List.of(DoctorSetorResponse.from(setor));
        }

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
                setores,
                doctor.getAtivo(),
                doctor.getCriadoEm(),
                doctor.getAtualizadoEm());
    }
}
