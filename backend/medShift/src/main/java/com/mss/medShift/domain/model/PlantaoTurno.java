package com.mss.medShift.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PlantaoTurno {
    DIURNO,
    NOTURNO,
    PERSONALIZADO;

    private static final LocalTime DIURNO_INICIO = LocalTime.of(7, 0);
    private static final LocalTime DIURNO_FIM = LocalTime.of(19, 0);
    private static final LocalTime NOTURNO_INICIO = LocalTime.of(19, 0);
    private static final LocalTime NOTURNO_FIM = LocalTime.of(7, 0);

    @JsonCreator
    public static PlantaoTurno fromJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return switch (value.trim().toUpperCase()) {
            case "DIA", "DIURNO" -> DIURNO;
            case "NOITE", "NOTURNO" -> NOTURNO;
            case "PERSONALIZADO" -> PERSONALIZADO;
            default -> throw new IllegalArgumentException("Turno inválido: " + value);
        };
    }

    @JsonValue
    public String toJson() {
        return name();
    }

    public LocalDateTime dataInicio(LocalDate data) {
        return switch (this) {
            case DIURNO -> data.atTime(DIURNO_INICIO);
            case NOTURNO -> data.atTime(NOTURNO_INICIO);
            case PERSONALIZADO -> throw new IllegalArgumentException("Turno personalizado exige dataInicio e dataFim");
        };
    }

    public LocalDateTime dataFim(LocalDate data) {
        return switch (this) {
            case DIURNO -> data.atTime(DIURNO_FIM);
            case NOTURNO -> data.plusDays(1).atTime(NOTURNO_FIM);
            case PERSONALIZADO -> throw new IllegalArgumentException("Turno personalizado exige dataInicio e dataFim");
        };
    }

    public static PlantaoTurno fromPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio == null || dataFim == null) {
            return null;
        }
        if (dataInicio.toLocalTime().equals(DIURNO_INICIO)
                && dataFim.toLocalTime().equals(DIURNO_FIM)
                && dataInicio.toLocalDate().equals(dataFim.toLocalDate())) {
            return DIURNO;
        }
        if (dataInicio.toLocalTime().equals(NOTURNO_INICIO)
                && dataFim.toLocalTime().equals(NOTURNO_FIM)
                && dataInicio.toLocalDate().plusDays(1).equals(dataFim.toLocalDate())) {
            return NOTURNO;
        }
        return PERSONALIZADO;
    }
}
