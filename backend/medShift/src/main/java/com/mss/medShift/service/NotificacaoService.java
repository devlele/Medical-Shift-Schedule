package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Notificacao;
import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.Usuario;

public interface NotificacaoService {
    Notificacao criarCoberturaAssumida(PedidoCobertura pedidoCobertura);
    List<Notificacao> findByUsuario(Usuario usuario);
    List<Notificacao> findNaoLidasByUsuario(Usuario usuario);
    Notificacao marcarComoLida(Long notificacaoId, Usuario usuario);
}
