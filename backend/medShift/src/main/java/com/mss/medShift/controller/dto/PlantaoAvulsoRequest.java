package com.mss.medShift.controller.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mss.medShift.domain.model.PlantaoTurno;

public record PlantaoAvulsoRequest(
        Long setorId,
        Long medicoId,
        LocalDate data,
        PlantaoTurno turno,
        LocalDateTime dataInicio,
        LocalDateTime dataFim) {
}
