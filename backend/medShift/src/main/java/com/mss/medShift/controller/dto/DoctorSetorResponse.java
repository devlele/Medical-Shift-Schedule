package com.mss.medShift.controller.dto;

import com.mss.medShift.domain.model.MedicoSetor;
import com.mss.medShift.domain.model.Setor;

public record DoctorSetorResponse(
        Long vinculoId,
        Long id,
        String nome,
        Long hospitalId,
        String hospitalNome,
        Boolean ativo) {

    public static DoctorSetorResponse from(MedicoSetor vinculo) {
        Setor setor = vinculo.getSetor();
        var hospital = setor != null ? setor.getHospital() : null;

        return new DoctorSetorResponse(
                vinculo.getId(),
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                vinculo.getAtivo());
    }

    public static DoctorSetorResponse from(Setor setor) {
        var hospital = setor != null ? setor.getHospital() : null;

        return new DoctorSetorResponse(
                null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                true);
    }
}
