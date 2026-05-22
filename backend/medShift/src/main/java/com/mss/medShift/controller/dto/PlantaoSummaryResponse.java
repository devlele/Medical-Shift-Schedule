package com.mss.medShift.controller.dto;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.model.PlantaoTurno;

public record PlantaoSummaryResponse(
        Long id,
        String type,
        PlantaoTurno turno,
        String setor,
        Long setorId,
        String hospital,
        Long hospitalId,
        String local,
        String doctor,
        Long doctorId,
        LocalDate date,
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        String time,
        Long duracaoHoras,
        PlantaoStatus status) {

    public static PlantaoSummaryResponse from(Plantao plantao) {
        var setor = plantao.getSetor();
        var hospital = setor != null ? setor.getHospital() : null;
        var doctor = plantao.getMedicoResponsavelAtual();
        Long duracaoHoras = null;
        PlantaoTurno turno = resolveTurno(plantao);

        if (plantao.getDataInicio() != null && plantao.getDataFim() != null) {
            duracaoHoras = Duration.between(plantao.getDataInicio(), plantao.getDataFim()).toHours();
        }

        return new PlantaoSummaryResponse(
                plantao.getId(),
                resolveType(turno),
                turno,
                setor != null ? setor.getNome() : null,
                setor != null ? setor.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getEndereco() : null,
                doctor != null ? doctor.getName() : null,
                doctor != null ? doctor.getId() : null,
                plantao.getDataInicio() != null ? plantao.getDataInicio().toLocalDate() : null,
                plantao.getDataInicio(),
                plantao.getDataFim(),
                formatTime(plantao.getDataInicio(), plantao.getDataFim(), duracaoHoras),
                duracaoHoras,
                plantao.getStatus());
    }

    private static PlantaoTurno resolveTurno(Plantao plantao) {
        if (plantao.getTurno() != null) {
            return plantao.getTurno();
        }
        return PlantaoTurno.fromPeriodo(plantao.getDataInicio(), plantao.getDataFim());
    }

    private static String resolveType(PlantaoTurno turno) {
        if (turno == null) {
            return null;
        }
        return switch (turno) {
            case DIURNO -> "dia";
            case NOTURNO -> "noite";
            case PERSONALIZADO -> "personalizado";
        };
    }

    private static String formatTime(LocalDateTime dataInicio, LocalDateTime dataFim, Long duracaoHoras) {
        if (dataInicio == null || dataFim == null) {
            return null;
        }

        String periodo = String.format("%02d:%02d - %02d:%02d",
                dataInicio.getHour(),
                dataInicio.getMinute(),
                dataFim.getHour(),
                dataFim.getMinute());

        return duracaoHoras != null ? periodo + " (" + duracaoHoras + "h)" : periodo;
    }
}
