package com.mss.medShift.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.controller.dto.PlantaoAvulsoRequest;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/plantao")
public class PlantaoController {

    private final PlantaoService plantaoService;
    private final AccessScopeService accessScopeService;

    public PlantaoController(PlantaoService plantaoService, AccessScopeService accessScopeService) {
        this.plantaoService = plantaoService;
        this.accessScopeService = accessScopeService;
    }

    @PostMapping("/avulso")
    public ResponseEntity<PlantaoSummaryResponse> createAvulso(@RequestBody PlantaoAvulsoRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Manager escalista = accessScopeService.requireEscalistaInSetor(usuarioLogado, request.setorId());
        var plantaoCriado = plantaoService.createAvulso(
                request.setorId(),
                request.medicoId(),
                request.data(),
                request.turno(),
                request.dataInicio(),
                request.dataFim(),
                escalista);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(plantaoCriado.getId())
                .toUri();
        return ResponseEntity.created(location).body(PlantaoSummaryResponse.from(plantaoCriado));
    }

    @PostMapping
    public ResponseEntity<PlantaoSummaryResponse> create(@RequestBody Plantao plantao, @AuthenticationPrincipal Usuario usuarioLogado) {
        if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
            throw new IllegalArgumentException("Setor is required");
        }
        Manager escalista = accessScopeService.requireEscalistaInSetor(usuarioLogado, plantao.getSetor().getId());
        plantao.setCriadoPorEscalista(escalista);
        plantao.setHospital(escalista.getHospital());

        var plantaoCriado = plantaoService.create(plantao);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(plantaoCriado.getId())
                .toUri();
        return ResponseEntity.created(location).body(PlantaoSummaryResponse.from(plantaoCriado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantaoSummaryResponse> getPlantao(@PathVariable Long id, @AuthenticationPrincipal Usuario user) {
        var plantao = findPlantaoForUser(id, user);
        return ResponseEntity.ok(PlantaoSummaryResponse.from(plantao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantaoSummaryResponse> update(@PathVariable Long id, @RequestBody Plantao plantao,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Plantao plantaoAtual = plantaoService.findById(id);
        if (plantaoAtual.getSetor() == null || plantaoAtual.getSetor().getId() == null) {
            throw new IllegalArgumentException("Plantão sem setor");
        }
        accessScopeService.requireEscalistaCanAccessSetor(usuarioLogado, plantaoAtual.getSetor().getId());
        if (plantao.getSetor() != null && plantao.getSetor().getId() != null) {
            Manager escalista = accessScopeService.requireEscalistaInSetor(usuarioLogado, plantao.getSetor().getId());
            plantao.setHospital(escalista.getHospital());
            plantao.setCriadoPorEscalista(escalista);
        }

        var plantaoAtualizado = plantaoService.update(id, plantao);
        return ResponseEntity.ok(PlantaoSummaryResponse.from(plantaoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        plantaoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Plantao findPlantaoForUser(Long id, Usuario user) {
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireHospitalProfile(user);
            return plantaoService.findByIdAndHospitalId(id, hospital.getId());
        }
        if (accessScopeService.isEscalista(user)) {
            Plantao plantao = plantaoService.findById(id);
            if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
                throw new IllegalArgumentException("Plantão sem setor");
            }
            accessScopeService.requireEscalistaCanAccessSetor(user, plantao.getSetor().getId());
            return plantao;
        }
        return plantaoService.findById(id);
    }
}
