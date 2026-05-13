package com.mss.medShift.service;

import java.time.LocalDateTime;
import java.util.List;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Doctor;

public interface PlantaoService {
    Plantao create(Plantao plantao);
    Plantao findById(Long id);
    List<Plantao> findBySetorId(Long setorId);
    List<Plantao> findByDoctorId(Long doctorId);
    List<Plantao> findBySetorAndPeriod(Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByDoctorAndPeriod(Long doctorId, LocalDateTime start, LocalDateTime end);
    Plantao update(Long id, Plantao plantao);
    void delete(Long id);
    Plantao checkIn(Long plantaoId, Long doctorId);
    Plantao checkOut(Long plantaoId, Long doctorId);
    Plantao registerInterest(Long plantaoId, Doctor doctor);
    Plantao openForExchange(Long plantaoId);
}
