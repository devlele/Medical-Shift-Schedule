package com.mss.medShift.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.service.PlantaoService;

@RestController
@RequestMapping("/plantao")
public class PlantaoController {

    private final PlantaoService plantaoService;

    public PlantaoController(PlantaoService plantaoService) {
        this.plantaoService = plantaoService;
    }

    @PostMapping
    public ResponseEntity<Plantao> create(@RequestBody Plantao plantao) {
        try {
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
    public ResponseEntity<Plantao> getPlantao(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        try {
            var plantao = findPlantaoForUser(id, user);
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plantao> update(@PathVariable Long id, @RequestBody Plantao plantao) {
        try {
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

    @PostMapping("/{id}/check-in")
    public ResponseEntity<Plantao> checkIn(@PathVariable Long id, @AuthenticationPrincipal Doctor doctor) {
        try {
            var plantao = plantaoService.checkIn(id, doctor.getId());
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<Plantao> checkOut(@PathVariable Long id, @AuthenticationPrincipal Doctor doctor) {
        try {
            var plantao = plantaoService.checkOut(id, doctor.getId());
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/interesse")
    public ResponseEntity<Plantao> registerInterest(@PathVariable Long id, @AuthenticationPrincipal Doctor doctor) {
        try {
            var plantao = plantaoService.registerInterest(id, doctor);
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/troca")
    public ResponseEntity<Plantao> openForExchange(@PathVariable Long id) {
        try {
            var plantao = plantaoService.openForExchange(id);
            return ResponseEntity.ok(plantao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Plantao findPlantaoForUser(Long id, UserDetails user) {
        if (user instanceof Hospital hospital) {
            return plantaoService.findByIdAndHospitalId(id, hospital.getId());
        }
        if (user instanceof Manager manager) {
            if (manager.getHospital() == null || manager.getSetor() == null) {
                throw new IllegalArgumentException("Escalista sem hospital ou setor");
            }
            return plantaoService.findByIdAndHospitalIdAndSetorId(id, manager.getHospital().getId(), manager.getSetor().getId());
        }
        return plantaoService.findById(id);
    }
}
