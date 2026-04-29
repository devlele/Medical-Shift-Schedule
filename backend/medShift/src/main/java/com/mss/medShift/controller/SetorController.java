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
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.service.SetorService;

@RestController
@RequestMapping("/setor")
public class SetorController {

    private final SetorService setorService;

    public SetorController(SetorService setorService) {
        this.setorService = setorService;
    }

    /*@PostMapping
    public ResponseEntity<Setor> create(@RequestBody Setor setorToCreate) {
        var setorCreated = setorService.create(setorToCreate);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(setorCreated.getId())
                        .toUri();

        return ResponseEntity.created(location).body(setorCreated);
    }*/

    @PostMapping
    public ResponseEntity<Setor> create(@RequestBody Setor setorToCreate, @AuthenticationPrincipal Hospital hospitalLogado) {  // ← pega direto do token

        var setorCreated = setorService.create(setorToCreate, hospitalLogado);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(setorCreated.getId())
                    .toUri();

        return ResponseEntity.created(location).body(setorCreated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setor> getSetor(@PathVariable Long id) {
        try {
            var setor = setorService.findById(id);
            return ResponseEntity.ok(setor);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Setor>> getSetoresByHospital(@PathVariable Long hospitalId) {
        var setores = setorService.findByHospitalId(hospitalId);
        return ResponseEntity.ok(setores);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Setor> update(@PathVariable Long id, @RequestBody Setor setor) {
        try {
            var setorUpdated = setorService.update(id, setor);
            return ResponseEntity.ok(setorUpdated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            setorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}