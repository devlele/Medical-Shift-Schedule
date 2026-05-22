package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.PedidoCobertura;

public interface PedidoCoberturaService {
    PedidoCobertura abrirPedido(Long plantaoId, Doctor medicoSolicitante);
    List<PedidoCobertura> findDisponiveisParaMedico(Doctor medico);
    List<PedidoCobertura> findSolicitadosPorMedico(Doctor medico);
    PedidoCobertura assumir(Long pedidoId, Doctor medicoCobridor);
    PedidoCobertura cancelar(Long pedidoId, Doctor medicoSolicitante);
}
