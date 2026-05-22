package com.mss.medShift.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.RegraPlantaoFixo;
import com.mss.medShift.domain.model.TipoRecorrenciaPlantao;
import com.mss.medShift.service.PlantaoFixoCreationResult;

public record PlantaoFixoResponse(
        Long regraId,
        Long hospitalId,
        String hospitalNome,
        Long setorId,
        String setorNome,
        Long medicoId,
        String medicoNome,
        Long escalistaId,
        String escalistaNome,
        TipoRecorrenciaPlantao tipoRecorrencia,
        String diaSemana,
        Integer semanaDoMes,
        Integer diaDoMes,
        PlantaoTurno turno,
        LocalTime horaInicio,
        LocalTime horaFim,
        LocalDate dataInicioVigencia,
        LocalDate dataFimVigencia,
        Boolean ativo,
        Integer plantoesGerados,
        List<PlantaoSummaryResponse> plantoes) {

    public static PlantaoFixoResponse from(PlantaoFixoCreationResult result) {
        RegraPlantaoFixo regra = result.regra();
        var hospital = regra.getHospital();
        var setor = regra.getSetor();
        var medico = regra.getMedicoTitular();
        var escalista = regra.getCriadoPorEscalista();
        List<PlantaoSummaryResponse> plantoes = result.plantoes().stream()
                .map(PlantaoSummaryResponse::from)
                .toList();

        return new PlantaoFixoResponse(
                regra.getId(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                medico != null ? medico.getId() : null,
                medico != null ? medico.getName() : null,
                escalista != null ? escalista.getId() : null,
                escalista != null ? escalista.getName() : null,
                regra.getTipoRecorrencia(),
                regra.getDiaSemana(),
                regra.getSemanaDoMes(),
                regra.getDiaDoMes(),
                resolveTurno(regra),
                regra.getHoraInicio(),
                regra.getHoraFim(),
                regra.getDataInicioVigencia(),
                regra.getDataFimVigencia(),
                regra.getAtivo(),
                plantoes.size(),
                plantoes);
    }

    private static PlantaoTurno resolveTurno(RegraPlantaoFixo regra) {
        if (LocalTime.of(7, 0).equals(regra.getHoraInicio())
                && LocalTime.of(19, 0).equals(regra.getHoraFim())) {
            return PlantaoTurno.DIURNO;
        }
        if (LocalTime.of(19, 0).equals(regra.getHoraInicio())
                && LocalTime.of(7, 0).equals(regra.getHoraFim())) {
            return PlantaoTurno.NOTURNO;
        }
        return PlantaoTurno.PERSONALIZADO;
    }
}
