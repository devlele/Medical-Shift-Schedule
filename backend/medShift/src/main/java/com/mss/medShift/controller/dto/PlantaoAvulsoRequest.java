package com.mss.medShift.controller.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.mss.medShift.domain.model.PlantaoTurno;

public record PlantaoAvulsoRequest(
        Long setorId,
        Long medicoId,
        List<Long> medicoIds,
        LocalDate data,
        PlantaoTurno turno,
        LocalDateTime dataInicio,
        LocalDateTime dataFim) {

    public List<Long> resolveMedicoIds() {
        if (medicoIds != null && !medicoIds.isEmpty()) {
            return medicoIds;
        }
        return medicoId != null ? List.of(medicoId) : List.of();
    }
}
