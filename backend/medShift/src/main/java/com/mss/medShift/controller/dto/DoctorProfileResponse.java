package com.mss.medShift.controller.dto;

import java.util.Date;
import java.util.List;

import com.mss.medShift.domain.model.Doctor;

public record DoctorProfileResponse(
        Long id,
        String name,
        String email,
        String cpf,
        Date birthday,
        String crm,
        String uf,
        String specialty,
        String telefone,
        String fotoPerfilUrl,
        Long hospitalId,
        String hospital,
        Long setorId,
        String setor,
        List<PlantaoSummaryResponse> historicoRecente) {

    public static DoctorProfileResponse from(Doctor doctor, List<PlantaoSummaryResponse> historicoRecente) {
        var hospital = doctor.getHospital();
        var setor = doctor.getSetor();

        return new DoctorProfileResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCpf(),
                doctor.getBirthday(),
                doctor.getCrm(),
                doctor.getUf(),
                doctor.getSpecialty(),
                doctor.getTelefone(),
                doctor.getFotoPerfilUrl(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                historicoRecente);
    }
}
