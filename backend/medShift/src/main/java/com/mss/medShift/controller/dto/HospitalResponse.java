package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.UserRole;

public record HospitalResponse(
        Long id,
        String nomeFantasia,
        String razaoSocial,
        String cnpj,
        String telefone,
        String endereco,
        String nomeGestor,
        String email,
        UserRole role,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm) {

    public static HospitalResponse from(Hospital hospital) {
        return new HospitalResponse(
                hospital.getId(),
                hospital.getNomeFantasia(),
                hospital.getRazaoSocial(),
                hospital.getCnpj(),
                hospital.getTelefone(),
                hospital.getEndereco(),
                hospital.getNomeGestor(),
                hospital.getEmail(),
                hospital.getRole(),
                hospital.getAtivo(),
                hospital.getCriadoEm(),
                hospital.getAtualizadoEm());
    }
}
