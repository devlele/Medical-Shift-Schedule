package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mss.medShift.domain.model.Notificacao;
import com.mss.medShift.domain.model.NotificacaoTipo;
import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.repository.NotificacaoRepository;
import com.mss.medShift.service.NotificacaoService;

@Service
public class NotificacaoServiceImple implements NotificacaoService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoServiceImple(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    @Override
    @Transactional
    public Notificacao criarCoberturaAssumida(PedidoCobertura pedidoCobertura) {
        if (pedidoCobertura == null || pedidoCobertura.getMedicoSolicitante() == null) {
            throw new IllegalArgumentException("Pedido de cobertura sem medico solicitante");
        }
        if (pedidoCobertura.getMedicoSolicitante().getUsuario() == null) {
            throw new IllegalArgumentException("Medico solicitante sem usuario vinculado");
        }

        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioDestino(pedidoCobertura.getMedicoSolicitante().getUsuario());
        notificacao.setPedidoCobertura(pedidoCobertura);
        notificacao.setPlantao(pedidoCobertura.getPlantao());
        notificacao.setTipo(NotificacaoTipo.COBERTURA_ASSUMIDA);
        notificacao.setTitulo("Cobertura assumida");
        notificacao.setMensagem(buildCoberturaAssumidaMessage(pedidoCobertura));
        notificacao.setCriadoEm(LocalDateTime.now());
        return notificacaoRepository.save(notificacao);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacao> findByUsuario(Usuario usuario) {
        validateUsuario(usuario);
        return notificacaoRepository.findByUsuarioDestinoIdOrderByCriadoEmDesc(usuario.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacao> findNaoLidasByUsuario(Usuario usuario) {
        validateUsuario(usuario);
        return notificacaoRepository.findByUsuarioDestinoIdAndLidaEmIsNullOrderByCriadoEmDesc(usuario.getId());
    }

    @Override
    @Transactional
    public Notificacao marcarComoLida(Long notificacaoId, Usuario usuario) {
        validateUsuario(usuario);
        if (notificacaoId == null) {
            throw new IllegalArgumentException("Notificacao e obrigatoria");
        }

        Notificacao notificacao = notificacaoRepository
                .findByIdAndUsuarioDestinoId(notificacaoId, usuario.getId())
                .orElseThrow(() -> new NoSuchElementException("Notificacao nao encontrada"));

        if (notificacao.getLidaEm() == null) {
            notificacao.setLidaEm(LocalDateTime.now());
        }
        return notificacaoRepository.save(notificacao);
    }

    private String buildCoberturaAssumidaMessage(PedidoCobertura pedidoCobertura) {
        String medicoCobridor = pedidoCobertura.getMedicoCobridor() != null
                ? pedidoCobertura.getMedicoCobridor().getName()
                : "Outro medico";
        Plantao plantao = pedidoCobertura.getPlantao();
        String periodo = plantao != null && plantao.getDataInicio() != null
                ? plantao.getDataInicio().format(DATE_TIME_FORMATTER)
                : "data nao informada";
        String setor = pedidoCobertura.getSetor() != null
                ? pedidoCobertura.getSetor().getNome()
                : "setor nao informado";

        return medicoCobridor + " assumiu seu plantao de " + periodo + " no setor " + setor + ".";
    }

    private void validateUsuario(Usuario usuario) {
        if (usuario == null || usuario.getId() == null) {
            throw new IllegalArgumentException("Usuario logado e obrigatorio");
        }
    }
}
