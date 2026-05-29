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

import com.mss.medShift.controller.dto.SetorResponse;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.service.SetorService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/setor")
public class SetorController {

    private final SetorService setorService;
    private final AccessScopeService accessScopeService;

    public SetorController(SetorService setorService, AccessScopeService accessScopeService) {
        this.setorService = setorService;
        this.accessScopeService = accessScopeService;
    }

    @PostMapping
    public ResponseEntity<SetorResponse> create(@RequestBody Setor setorToCreate, @AuthenticationPrincipal Usuario usuarioLogado) {
        Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);

        var setorCreated = setorService.create(setorToCreate, hospitalLogado);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(setorCreated.getId())
                    .toUri();

        return ResponseEntity.created(location).body(SetorResponse.from(setorCreated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SetorResponse> getSetor(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        var setor = accessScopeService.requireSetorOfAuthenticatedHospital(usuarioLogado, id);
        return ResponseEntity.ok(SetorResponse.from(setor));
    }

    @GetMapping
    public ResponseEntity<List<SetorResponse>> getSetoresDoHospitalLogado(@AuthenticationPrincipal Usuario usuarioLogado) {
        Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
        var setores = setorService.findByHospitalId(hospitalLogado.getId());
        return ResponseEntity.ok(setores.stream()
                .map(SetorResponse::from)
                .toList());
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<SetorResponse>> getSetoresByHospital(@PathVariable Long hospitalId) {
        var setores = setorService.findByHospitalId(hospitalId);
        return ResponseEntity.ok(setores.stream()
                .map(SetorResponse::from)
                .toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SetorResponse> update(@PathVariable Long id, @RequestBody Setor setor,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        Hospital hospitalLogado = accessScopeService.requireHospitalProfile(usuarioLogado);
        var setorUpdated = setorService.update(id, setor, hospitalLogado);
        return ResponseEntity.ok(SetorResponse.from(setorUpdated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        accessScopeService.requireSetorOfAuthenticatedHospital(usuarioLogado, id);
        setorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
