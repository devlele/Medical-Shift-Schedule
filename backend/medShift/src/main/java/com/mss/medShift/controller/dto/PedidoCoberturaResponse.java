package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.PedidoCoberturaStatus;

public record PedidoCoberturaResponse(
        Long id,
        PedidoCoberturaStatus status,
        Long hospitalId,
        String hospitalNome,
        Long setorId,
        String setorNome,
        Long medicoSolicitanteId,
        String medicoSolicitanteNome,
        Long medicoCobridorId,
        String medicoCobridorNome,
        LocalDateTime abertoEm,
        LocalDateTime assumidoEm,
        LocalDateTime canceladoEm,
        LocalDateTime expiradoEm,
        LocalDateTime atualizadoEm,
        PlantaoSummaryResponse plantao) {

    public static PedidoCoberturaResponse from(PedidoCobertura pedido) {
        var hospital = pedido.getHospital();
        var setor = pedido.getSetor();
        var solicitante = pedido.getMedicoSolicitante();
        var cobridor = pedido.getMedicoCobridor();

        return new PedidoCoberturaResponse(
                pedido.getId(),
                pedido.getStatus(),
                hospital != null ? hospital.getId() : null,
                hospital != null ? hospital.getNomeFantasia() : null,
                setor != null ? setor.getId() : null,
                setor != null ? setor.getNome() : null,
                solicitante != null ? solicitante.getId() : null,
                solicitante != null ? solicitante.getName() : null,
                cobridor != null ? cobridor.getId() : null,
                cobridor != null ? cobridor.getName() : null,
                pedido.getAbertoEm(),
                pedido.getAssumidoEm(),
                pedido.getCanceladoEm(),
                pedido.getExpiradoEm(),
                pedido.getAtualizadoEm(),
                pedido.getPlantao() != null ? PlantaoSummaryResponse.from(pedido.getPlantao()) : null);
    }
}
