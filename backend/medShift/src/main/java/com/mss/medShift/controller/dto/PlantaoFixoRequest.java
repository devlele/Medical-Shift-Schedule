package com.mss.medShift.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.TipoRecorrenciaPlantao;

public record PlantaoFixoRequest(
        Long setorId,
        Long medicoId,
        List<Long> medicoIds,
        TipoRecorrenciaPlantao tipoRecorrencia,
        String diaSemana,
        Integer semanaDoMes,
        Integer diaDoMes,
        PlantaoTurno turno,
        LocalTime horaInicio,
        LocalTime horaFim,
        LocalDate dataInicioVigencia,
        LocalDate dataFimVigencia) {

    public List<Long> resolveMedicoIds() {
        if (medicoIds != null && !medicoIds.isEmpty()) {
            return medicoIds;
        }
        return medicoId != null ? List.of(medicoId) : List.of();
    }
}
