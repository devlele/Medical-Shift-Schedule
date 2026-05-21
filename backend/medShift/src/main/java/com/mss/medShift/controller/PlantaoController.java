package com.mss.medShift.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Usuario;
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

    @PostMapping
    public ResponseEntity<Plantao> create(@RequestBody Plantao plantao, @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
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
            return ResponseEntity.created(location).body(plantaoCriado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plantao> getPlantao(@PathVariable Long id, @AuthenticationPrincipal Usuario user) {
        try {
            var plantao = findPlantaoForUser(id, user);
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plantao> update(@PathVariable Long id, @RequestBody Plantao plantao,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
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
            return ResponseEntity.ok(plantaoAtualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            plantaoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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
