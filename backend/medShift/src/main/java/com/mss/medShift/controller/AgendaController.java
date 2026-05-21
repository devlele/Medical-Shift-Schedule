package com.mss.medShift.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Comparator;

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
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/agenda")
public class AgendaController {

    private final PlantaoService plantaoService;
    private final AccessScopeService accessScopeService;

    public AgendaController(PlantaoService plantaoService, AccessScopeService accessScopeService) {
        this.plantaoService = plantaoService;
        this.accessScopeService = accessScopeService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<PlantaoSummaryResponse>> getMinhaAgenda(
            @AuthenticationPrincipal Usuario user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(toSummary(findAgendaForUser(user, dataInicio, dataFim)));
    }

    @GetMapping("/setor/{setorId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getAgendaBySetor(
            @AuthenticationPrincipal Usuario user,
            @PathVariable Long setorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(toSummary(findAgendaBySetorForUser(user, setorId, dataInicio, dataFim)));
    }

    @GetMapping("/doctor/me")
    public ResponseEntity<List<PlantaoSummaryResponse>> getMyAgenda(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(toSummary(findDoctorAgenda(usuarioLogado, dataInicio, dataFim)));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getAgendaByHospital(
            @AuthenticationPrincipal Usuario user,
            @PathVariable Long hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(toSummary(findAgendaByHospitalForUser(user, hospitalId, dataInicio, dataFim)));
    }

    @GetMapping("/doctor/me/hospital/{hospitalId}")
    public ResponseEntity<List<PlantaoSummaryResponse>> getMyAgendaByHospital(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @PathVariable Long hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        Doctor doctor = accessScopeService.requireMedicoProfile(usuarioLogado);
        List<Plantao> agenda;
        if (dataInicio != null && dataFim != null) {
            agenda = plantaoService.findByDoctorAndHospitalAndPeriod(doctor.getId(), hospitalId, dataInicio, dataFim);
        } else {
            agenda = plantaoService.findByDoctorAndHospital(doctor.getId(), hospitalId);
        }
        return ResponseEntity.ok(toSummary(agenda));
    }

    private List<PlantaoSummaryResponse> toSummary(List<Plantao> plantoes) {
        return plantoes.stream()
                .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(PlantaoSummaryResponse::from)
                .toList();
    }

    private List<Plantao> findAgendaForUser(Usuario user, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (accessScopeService.isMedico(user)) {
            return findDoctorAgenda(user, dataInicio, dataFim);
        }
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireHospitalProfile(user);
            return findByHospital(hospital.getId(), dataInicio, dataFim);
        }
        if (accessScopeService.isEscalista(user)) {
            Manager manager = accessScopeService.requireEscalistaProfile(user);
            if (manager.getHospital() == null || manager.getHospital().getId() == null) {
                return List.of();
            }
            return findByHospitalAndSetores(
                    manager.getHospital().getId(),
                    accessScopeService.resolveEscalistaSetorIds(user),
                    dataInicio,
                    dataFim);
        }
        return List.of();
    }

    private List<Plantao> findDoctorAgenda(Usuario user, LocalDateTime dataInicio, LocalDateTime dataFim) {
        Doctor doctor = accessScopeService.requireMedicoProfile(user);
        if (dataInicio != null && dataFim != null) {
            return plantaoService.findByDoctorAndPeriod(doctor.getId(), dataInicio, dataFim);
        }
        return plantaoService.findByDoctorId(doctor.getId());
    }

    private List<Plantao> findAgendaByHospitalForUser(Usuario user, Long hospitalId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireSameHospital(user, hospitalId);
            return findByHospital(hospital.getId(), dataInicio, dataFim);
        }
        if (accessScopeService.isEscalista(user)) {
            accessScopeService.requireEscalistaInHospital(user, hospitalId);
            return findByHospitalAndSetores(hospitalId,
                    accessScopeService.resolveEscalistaSetorIdsInHospital(user, hospitalId),
                    dataInicio,
                    dataFim);
        }
        return findByHospital(hospitalId, dataInicio, dataFim);
    }

    private List<Plantao> findAgendaBySetorForUser(Usuario user, Long setorId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireHospitalProfile(user);
            return findByHospitalAndSetor(hospital.getId(), setorId, dataInicio, dataFim);
        }
        if (accessScopeService.isEscalista(user)) {
            Manager manager = accessScopeService.requireEscalistaInSetor(user, setorId);
            return findByHospitalAndSetor(manager.getHospital().getId(), setorId, dataInicio, dataFim);
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

    private List<Plantao> findByHospitalAndSetores(Long hospitalId, List<Long> setorIds, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return setorIds.stream()
                .flatMap(setorId -> findByHospitalAndSetor(hospitalId, setorId, dataInicio, dataFim).stream())
                .toList();
    }

    private List<Plantao> findBySetor(Long setorId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio != null && dataFim != null) {
            return plantaoService.findBySetorAndPeriod(setorId, dataInicio, dataFim);
        }
        return plantaoService.findBySetorId(setorId);
    }
}
