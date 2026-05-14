package com.mss.medShift.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mss.medShift.controller.dto.DashboardResponse;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.service.PlantaoService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final PlantaoService plantaoService;

    public DashboardController(PlantaoService plantaoService) {
        this.plantaoService = plantaoService;
    }

    @GetMapping("/me")
    public ResponseEntity<DashboardResponse> getMyDashboard(@AuthenticationPrincipal UserDetails user) {
        LocalDate today = LocalDate.now();
        LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX);

        List<Plantao> allPlantoes = findPlantoesForUser(user);
        List<Plantao> plantoesDoMes = allPlantoes.stream()
                .filter(plantao -> isInsideMonth(plantao, monthStart, monthEnd))
                .toList();

        List<PlantaoSummaryResponse> proximosPlantoes = allPlantoes.stream()
                .filter(plantao -> plantao.getDataInicio() != null && !plantao.getDataInicio().isBefore(LocalDateTime.now()))
                .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .map(PlantaoSummaryResponse::from)
                .toList();

        return ResponseEntity.ok(new DashboardResponse(
                resolveId(user),
                resolveName(user),
                user.getUsername(),
                resolveRole(user),
                plantoesDoMes.size(),
                countConflicts(plantoesDoMes),
                proximosPlantoes));
    }

    private List<Plantao> findPlantoesForUser(UserDetails user) {
        if (user instanceof Doctor doctor) {
            return plantaoService.findByDoctorId(doctor.getId());
        }
        if (user instanceof Hospital hospital) {
            return plantaoService.findByHospitalId(hospital.getId());
        }
        if (user instanceof Manager manager && manager.getSetor() != null) {
            return plantaoService.findBySetorId(manager.getSetor().getId());
        }
        return List.of();
    }

    private boolean isInsideMonth(Plantao plantao, LocalDateTime monthStart, LocalDateTime monthEnd) {
        return plantao.getDataInicio() != null
                && !plantao.getDataInicio().isBefore(monthStart)
                && !plantao.getDataInicio().isAfter(monthEnd);
    }

    private long countConflicts(List<Plantao> plantoes) {
        long conflicts = 0;

        for (int i = 0; i < plantoes.size(); i++) {
            Plantao current = plantoes.get(i);
            for (int j = i + 1; j < plantoes.size(); j++) {
                Plantao next = plantoes.get(j);
                if (sameDoctor(current, next) && overlaps(current, next)) {
                    conflicts++;
                }
            }
        }

        return conflicts;
    }

    private boolean sameDoctor(Plantao first, Plantao second) {
        return first.getDoctorAssignado() != null
                && second.getDoctorAssignado() != null
                && first.getDoctorAssignado().getId().equals(second.getDoctorAssignado().getId());
    }

    private boolean overlaps(Plantao first, Plantao second) {
        return first.getDataInicio() != null
                && first.getDataFim() != null
                && second.getDataInicio() != null
                && second.getDataFim() != null
                && first.getDataInicio().isBefore(second.getDataFim())
                && second.getDataInicio().isBefore(first.getDataFim());
    }

    private Long resolveId(UserDetails user) {
        if (user instanceof Doctor doctor) {
            return doctor.getId();
        }
        if (user instanceof Hospital hospital) {
            return hospital.getId();
        }
        if (user instanceof Manager manager) {
            return manager.getId();
        }
        return null;
    }

    private String resolveName(UserDetails user) {
        if (user instanceof Doctor doctor) {
            return doctor.getName();
        }
        if (user instanceof Hospital hospital) {
            return hospital.getNomeFantasia();
        }
        if (user instanceof Manager manager) {
            return manager.getName();
        }
        return user.getUsername();
    }

    private UserRole resolveRole(UserDetails user) {
        if (user instanceof Doctor doctor) {
            return doctor.getRole();
        }
        if (user instanceof Hospital hospital) {
            return hospital.getRole();
        }
        if (user instanceof Manager manager) {
            return manager.getRole();
        }
        return null;
    }
}
