package com.mss.medShift.controller;

import java.net.URI;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.controller.dto.EscalistaSetorResponse;
import com.mss.medShift.service.ManagerService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/manager")
public class ManagerController {
    private final ManagerService managerService;
    private final AccessScopeService accessScopeService;

    public ManagerController(ManagerService managerService, AccessScopeService accessScopeService) {
        this.managerService = managerService;
        this.accessScopeService = accessScopeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manager> getManager(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
       try {
            Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
            var manager = managerService.findById(id, hospitalLogado);
            return ResponseEntity.ok(manager);
       } catch (Exception e) {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping
    public ResponseEntity<List<Manager>> getManagersDoHospitalLogado(@AuthenticationPrincipal Usuario usuarioLogado) {
        Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
        var managers = managerService.findByHospitalId(hospitalLogado.getId());
        return ResponseEntity.ok(managers);
    }

    @PostMapping
    public ResponseEntity<Manager> create(@RequestBody Manager managerToCreate,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
        var managerCreated = managerService.create(managerToCreate, hospitalLogado);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(managerCreated.getId())
                        .toUri();

        return ResponseEntity.created(location).body(managerCreated);
    }

    @GetMapping("/{id}/setores")
    public ResponseEntity<List<EscalistaSetorResponse>> getSetoresVinculados(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
            var vinculos = managerService.findSetoresVinculados(id, hospitalLogado).stream()
                    .map(EscalistaSetorResponse::from)
                    .toList();
            return ResponseEntity.ok(vinculos);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/setores/{setorId}")
    public ResponseEntity<EscalistaSetorResponse> vincularSetor(@PathVariable Long id,
            @PathVariable Long setorId,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
            var vinculo = managerService.vincularSetor(id, setorId, hospitalLogado, usuarioLogado);
            return ResponseEntity.ok(EscalistaSetorResponse.from(vinculo));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/setores/{setorId}")
    public ResponseEntity<Void> desvincularSetor(@PathVariable Long id,
            @PathVariable Long setorId,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
            managerService.desvincularSetor(id, setorId, hospitalLogado);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manager> update(@PathVariable Long id, @RequestBody Manager manager,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
            managerService.findById(id, hospitalLogado);
            if (manager.getSetor() != null && manager.getSetor().getId() != null) {
                manager.setSetor(accessScopeService.requireSetorOfAuthenticatedHospital(usuarioLogado, manager.getSetor().getId()));
            }
            var managerAtualizado = managerService.update(id, manager);
            return ResponseEntity.ok(managerAtualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            managerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
