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
import com.mss.medShift.service.DoctorService;
import com.mss.medShift.service.PedidoCoberturaService;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/coberturas")
public class PedidoCoberturaController {

    private final PedidoCoberturaService pedidoCoberturaService;
    private final AccessScopeService accessScopeService;
    private final DoctorService doctorService;
    private final PlantaoService plantaoService;

    public PedidoCoberturaController(PedidoCoberturaService pedidoCoberturaService,
            AccessScopeService accessScopeService, DoctorService doctorService, PlantaoService plantaoService) {
        this.pedidoCoberturaService = pedidoCoberturaService;
        this.accessScopeService = accessScopeService;
        this.doctorService = doctorService;
        this.plantaoService = plantaoService;
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

    @PostMapping("/escalista")
    public ResponseEntity<PedidoCoberturaResponse> abrirPedidoPeloEscalista(
            @RequestBody PedidoCoberturaCreateRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        if (request.medicoSolicitanteId() == null) {
            throw new IllegalArgumentException("Médico solicitante é obrigatório");
        }

        var plantao = plantaoService.findById(request.plantaoId());
        if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
            throw new IllegalArgumentException("Plantão sem setor");
        }
        accessScopeService.requireEscalistaCanAccessSetor(usuarioLogado, plantao.getSetor().getId());

        Doctor medicoSolicitante = doctorService.findById(request.medicoSolicitanteId());
        accessScopeService.requireEscalistaCanAccessDoctor(usuarioLogado, medicoSolicitante);

        var pedido = pedidoCoberturaService.abrirPedido(
                request.plantaoId(),
                request.plantaoMedicoId(),
                medicoSolicitante);

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

    @GetMapping("/setor")
    public ResponseEntity<List<PedidoCoberturaResponse>> getPedidosDoSetorDoEscalista(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        var setorIds = accessScopeService.resolveEscalistaSetorIds(usuarioLogado);
        var pedidos = pedidoCoberturaService.findBySetorIds(setorIds).stream()
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
