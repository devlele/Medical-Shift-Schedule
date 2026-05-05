package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Setor;

public interface SetorService {
    Setor create(Setor setor, Hospital hospital);
    Setor findById(Long id);
    Setor findById(Long id, Hospital hospital);
    List<Setor> findByHospitalId(Long hospitalId);
    Setor update(Long id, Setor setor);
    Setor update(Long id, Setor setor, Hospital hospital);
    void delete(Long id);
}
