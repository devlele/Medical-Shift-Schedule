package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.EscalistaSetor;

public record EscalistaSetorResponse(
        Long id,
        Long escalistaId,
        String escalistaNome,
        String escalistaEmail,
        Long setorId,
        String setorNome,
        Long hospitalId,
        Boolean ativo,
        LocalDateTime vinculadoEm,
        LocalDateTime desvinculadoEm) {

    public static EscalistaSetorResponse from(EscalistaSetor vinculo) {
        var escalista = vinculo.getEscalista();
        var setor = vinculo.getSetor();
        var hospital = setor != null ? setor.getHospital() : null;

        return new EscalistaSetorResponse(
                vinculo.getId(),
                escalista != null ? escalista.getId() : null,
                escalista != null ? escalista.getName() : null,
                escalista != null ? escalista.getEmail() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                hospital != null ? hospital.getId() : null,
                vinculo.getAtivo(),
                vinculo.getVinculadoEm(),
                vinculo.getDesvinculadoEm());
    }
}
