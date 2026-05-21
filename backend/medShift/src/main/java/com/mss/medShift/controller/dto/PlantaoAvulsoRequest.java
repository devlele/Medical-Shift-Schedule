package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

public record PlantaoAvulsoRequest(
        Long setorId,
        Long medicoId,
        LocalDateTime dataInicio,
        LocalDateTime dataFim) {
}
