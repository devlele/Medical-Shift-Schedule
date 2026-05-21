package com.mss.medShift.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mss.medShift.controller.dto.NotificacaoResponse;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.service.NotificacaoService;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificacaoResponse>> getMinhasNotificacoes(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestParam(defaultValue = "false") Boolean apenasNaoLidas) {
        var notificacoes = Boolean.TRUE.equals(apenasNaoLidas)
                ? notificacaoService.findNaoLidasByUsuario(usuarioLogado)
                : notificacaoService.findByUsuario(usuarioLogado);
        return ResponseEntity.ok(notificacoes.stream()
                .map(NotificacaoResponse::from)
                .toList());
    }

    @PostMapping("/{id}/lida")
    public ResponseEntity<NotificacaoResponse> marcarComoLida(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        var notificacao = notificacaoService.marcarComoLida(id, usuarioLogado);
        return ResponseEntity.ok(NotificacaoResponse.from(notificacao));
    }
}
