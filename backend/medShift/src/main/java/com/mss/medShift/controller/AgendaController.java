package com.mss.medShift.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Comparator;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.service.PlantaoService;

@RestController
@RequestMapping("/agenda")
public class AgendaController {

    private final PlantaoService plantaoService;

    public AgendaController(PlantaoService plantaoService) {
        this.plantaoService = plantaoService;
    }

    @GetMapping("/setor/{setorId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getAgendaBySetor(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long setorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        try {
            return ResponseEntity.ok(toSummary(findAgendaBySetorForUser(user, setorId, dataInicio, dataFim)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/doctor/me")
    public ResponseEntity<List<PlantaoSummaryResponse>> getMyAgenda(
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
            return ResponseEntity.ok(toSummary(agenda));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getAgendaByHospital(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        try {
            return ResponseEntity.ok(toSummary(findAgendaByHospitalForUser(user, hospitalId, dataInicio, dataFim)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/doctor/me/hospital/{hospitalId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getMyAgendaByHospital(
            @AuthenticationPrincipal Doctor doctor,
            @PathVariable Long hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        try {
            List<Plantao> agenda;
            if (dataInicio != null && dataFim != null) {
                agenda = plantaoService.findByDoctorAndHospitalAndPeriod(doctor.getId(), hospitalId, dataInicio, dataFim);
            } else {
                agenda = plantaoService.findByDoctorAndHospital(doctor.getId(), hospitalId);
            }
            return ResponseEntity.ok(toSummary(agenda));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private List<PlantaoSummaryResponse> toSummary(List<Plantao> plantoes) {
        return plantoes.stream()
                .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(PlantaoSummaryResponse::from)
                .toList();
    }

    private List<Plantao> findAgendaByHospitalForUser(UserDetails user, Long hospitalId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (user instanceof Hospital hospital) {
            if (!hospital.getId().equals(hospitalId)) {
                throw new IllegalArgumentException("Hospital fora do contexto do token");
            }
            return findByHospital(hospital.getId(), dataInicio, dataFim);
        }
        if (user instanceof Manager manager) {
            if (manager.getHospital() == null || manager.getSetor() == null || !manager.getHospital().getId().equals(hospitalId)) {
                throw new IllegalArgumentException("Escalista fora do contexto do token");
            }
            return findByHospitalAndSetor(manager.getHospital().getId(), manager.getSetor().getId(), dataInicio, dataFim);
        }
        return findByHospital(hospitalId, dataInicio, dataFim);
    }

    private List<Plantao> findAgendaBySetorForUser(UserDetails user, Long setorId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (user instanceof Hospital hospital) {
            return findByHospitalAndSetor(hospital.getId(), setorId, dataInicio, dataFim);
        }
        if (user instanceof Manager manager) {
            if (manager.getHospital() == null || manager.getSetor() == null || !manager.getSetor().getId().equals(setorId)) {
                throw new IllegalArgumentException("Setor fora do contexto do token");
            }
            return findByHospitalAndSetor(manager.getHospital().getId(), manager.getSetor().getId(), dataInicio, dataFim);
        }
        return findBySetor(setorId, dataInicio, dataFim);
    }

    private List<Plantao> findByHospital(Long hospitalId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio != null && dataFim != null) {
            return plantaoService.findByHospitalAndPeriod(hospitalId, dataInicio, dataFim);
        }
        return plantaoService.findByHospitalId(hospitalId);
    }

    private List<Plantao> findByHospitalAndSetor(Long hospitalId, Long setorId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio != null && dataFim != null) {
            return plantaoService.findByHospitalAndSetorAndPeriod(hospitalId, setorId, dataInicio, dataFim);
        }
        return plantaoService.findByHospitalIdAndSetorId(hospitalId, setorId);
    }

    private List<Plantao> findBySetor(Long setorId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio != null && dataFim != null) {
            return plantaoService.findBySetorAndPeriod(setorId, dataInicio, dataFim);
        }
        return plantaoService.findBySetorId(setorId);
    }
}
