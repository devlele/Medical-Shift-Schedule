package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.RegraPlantaoFixo;

public record PlantaoFixoCreationResult(
        RegraPlantaoFixo regra,
        List<Plantao> plantoes) {
}
