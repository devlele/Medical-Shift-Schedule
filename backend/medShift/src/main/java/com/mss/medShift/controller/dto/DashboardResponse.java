package com.mss.medShift.controller.dto;

import java.util.List;

import com.mss.medShift.domain.model.UserRole;

public record DashboardResponse(
        Long userId,
        String name,
        String email,
        UserRole role,
        long plantoesNoMes,
        long alertasConflito,
        List<PlantaoSummaryResponse> proximosPlantoes) {
}
