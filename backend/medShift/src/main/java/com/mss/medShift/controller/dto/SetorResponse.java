package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Setor;

public record SetorResponse(
        Long id,
        String nome,
        String descricao,
        Long hospitalId,
        String hospitalNome,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm) {

    public static SetorResponse from(Setor setor) {
        var hospital = setor.getHospital();

        return new SetorResponse(
                setor.getId(),
                setor.getNome(),
                setor.getDescricao(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor.getAtivo(),
                setor.getCriadoEm(),
                setor.getAtualizadoEm());
    }
}
