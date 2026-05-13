package com.mss.medShift.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.service.PlantaoService;

@RestController
@RequestMapping("/agenda")
public class AgendaController {

    private final PlantaoService plantaoService;

    public AgendaController(PlantaoService plantaoService) {
        this.plantaoService = plantaoService;
    }

    @GetMapping("/setor/{setorId}")
    public ResponseEntity<List<Plantao>> getAgendaBySetor(
            @PathVariable Long setorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        try {
            List<Plantao> agenda;
            if (dataInicio != null && dataFim != null) {
                agenda = plantaoService.findBySetorAndPeriod(setorId, dataInicio, dataFim);
            } else {
                agenda = plantaoService.findBySetorId(setorId);
            }
            return ResponseEntity.ok(agenda);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/doctor/me")
    public ResponseEntity<List<Plantao>> getMyAgenda(
            @AuthenticationPrincipal Doctor doctor,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        try {
            List<Plantao> agenda;
            if (dataInicio != null && dataFim != null) {
                agenda = plantaoService.findByDoctorAndPeriod(doctor.getId(), dataInicio, dataFim);
            } else {
                agenda = plantaoService.findByDoctorId(doctor.getId());
            }
            return ResponseEntity.ok(agenda);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
