package com.mss.medShift.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.TipoRecorrenciaPlantao;

public record PlantaoFixoRequest(
        Long setorId,
        Long medicoId,
        TipoRecorrenciaPlantao tipoRecorrencia,
        String diaSemana,
        Integer semanaDoMes,
        Integer diaDoMes,
        PlantaoTurno turno,
        LocalTime horaInicio,
        LocalTime horaFim,
        LocalDate dataInicioVigencia,
        LocalDate dataFimVigencia) {
}
