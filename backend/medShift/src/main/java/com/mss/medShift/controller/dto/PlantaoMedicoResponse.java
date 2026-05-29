package com.mss.medShift.controller.dto;

import com.mss.medShift.domain.model.PlantaoMedico;
import com.mss.medShift.domain.model.PlantaoStatus;

public record PlantaoMedicoResponse(
        Long id,
        Long medicoTitularId,
        String medicoTitularNome,
        Long medicoResponsavelAtualId,
        String medicoResponsavelAtualNome,
        PlantaoStatus status) {

    public static PlantaoMedicoResponse from(PlantaoMedico plantaoMedico) {
        var titular = plantaoMedico.getMedicoTitular();
        var responsavel = plantaoMedico.getMedicoResponsavelAtual();

        return new PlantaoMedicoResponse(
                plantaoMedico.getId(),
                titular != null ? titular.getId() : null,
                titular != null ? titular.getName() : null,
                responsavel != null ? responsavel.getId() : null,
                responsavel != null ? responsavel.getName() : null,
                plantaoMedico.getStatus());
    }
}
