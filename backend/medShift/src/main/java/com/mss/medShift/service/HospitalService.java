package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Hospital;

public interface HospitalService {
    Hospital create(Hospital hospital);
    Hospital findById(Long id);
    List<Hospital> findAll();
    Hospital update(Long id, Hospital hospital);
    void delete(Long id);
    Hospital findByCnpj(String cnpj);
    Hospital findByEmail(String email);
}