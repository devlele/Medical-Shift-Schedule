package com.mss.medShift.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.controller.dto.PedidoCoberturaCreateRequest;
import com.mss.medShift.controller.dto.PedidoCoberturaResponse;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.service.PedidoCoberturaService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/coberturas")
public class PedidoCoberturaController {

    private final PedidoCoberturaService pedidoCoberturaService;
    private final AccessScopeService accessScopeService;

    public PedidoCoberturaController(PedidoCoberturaService pedidoCoberturaService,
            AccessScopeService accessScopeService) {
        this.pedidoCoberturaService = pedidoCoberturaService;
        this.accessScopeService = accessScopeService;
    }

    @PostMapping
    public ResponseEntity<PedidoCoberturaResponse> abrirPedido(@RequestBody PedidoCoberturaCreateRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor medicoLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        var pedido = pedidoCoberturaService.abrirPedido(request.plantaoId(), request.plantaoMedicoId(), medicoLogado);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(pedido.getId())
                .toUri();
        return ResponseEntity.created(location).body(PedidoCoberturaResponse.from(pedido));
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<PedidoCoberturaResponse>> getDisponiveis(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor medicoLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        var pedidos = pedidoCoberturaService.findDisponiveisParaMedico(medicoLogado).stream()
                .map(PedidoCoberturaResponse::from)
                .toList();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PedidoCoberturaResponse>> getMeusPedidos(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor medicoLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        var pedidos = pedidoCoberturaService.findSolicitadosPorMedico(medicoLogado).stream()
                .map(PedidoCoberturaResponse::from)
                .toList();
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/{id}/assumir")
    public ResponseEntity<PedidoCoberturaResponse> assumir(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor medicoLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        var pedido = pedidoCoberturaService.assumir(id, medicoLogado);
        return ResponseEntity.ok(PedidoCoberturaResponse.from(pedido));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<PedidoCoberturaResponse> cancelar(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor medicoLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        var pedido = pedidoCoberturaService.cancelar(id, medicoLogado);
        return ResponseEntity.ok(PedidoCoberturaResponse.from(pedido));
    }
}
