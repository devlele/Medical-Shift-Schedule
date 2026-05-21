package com.mss.medShift.controller.dto;

import java.time.LocalDateTime;

import com.mss.medShift.domain.model.Notificacao;
import com.mss.medShift.domain.model.NotificacaoTipo;

public record NotificacaoResponse(
        Long id,
        NotificacaoTipo tipo,
        String titulo,
        String mensagem,
        Boolean lida,
        LocalDateTime criadoEm,
        LocalDateTime lidaEm,
        Long pedidoCoberturaId,
        Long plantaoId,
        PlantaoSummaryResponse plantao) {

    public static NotificacaoResponse from(Notificacao notificacao) {
        var pedido = notificacao.getPedidoCobertura();
        var plantao = notificacao.getPlantao();

        return new NotificacaoResponse(
                notificacao.getId(),
                notificacao.getTipo(),
                notificacao.getTitulo(),
                notificacao.getMensagem(),
                notificacao.getLidaEm() != null,
                notificacao.getCriadoEm(),
                notificacao.getLidaEm(),
                pedido != null ? pedido.getId() : null,
                plantao != null ? plantao.getId() : null,
                plantao != null ? PlantaoSummaryResponse.from(plantao) : null);
    }
}
