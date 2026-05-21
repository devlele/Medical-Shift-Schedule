package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.MedicoSetor;

public record MedicoSetorResponse(
        Long id,
        Long medicoId,
        String medicoNome,
        String medicoEmail,
        Long setorId,
        String setorNome,
        Long hospitalId,
        Long vinculadoPorEscalistaId,
        String vinculadoPorEscalistaNome,
        Boolean ativo,
        LocalDateTime vinculadoEm,
        LocalDateTime desvinculadoEm) {

    public static MedicoSetorResponse from(MedicoSetor vinculo) {
        var medico = vinculo.getMedico();
        var setor = vinculo.getSetor();
        var hospital = setor != null ? setor.getHospital() : null;
        var escalista = vinculo.getVinculadoPorEscalista();

        return new MedicoSetorResponse(
                vinculo.getId(),
                medico != null ? medico.getId() : null,
                medico != null ? medico.getName() : null,
                medico != null ? medico.getEmail() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                hospital != null ? hospital.getId() : null,
                escalista != null ? escalista.getId() : null,
                escalista != null ? escalista.getName() : null,
                vinculo.getAtivo(),
                vinculo.getVinculadoEm(),
                vinculo.getDesvinculadoEm());
    }
}
