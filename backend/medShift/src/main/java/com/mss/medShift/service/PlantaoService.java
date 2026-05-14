package com.mss.medShift.service;

import java.time.LocalDateTime;
import java.util.List;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Doctor;

public interface PlantaoService {
    Plantao create(Plantao plantao);
    Plantao findById(Long id);
    Plantao findByIdAndHospitalId(Long id, Long hospitalId);
    Plantao findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Plantao> findBySetorId(Long setorId);
    List<Plantao> findByDoctorId(Long doctorId);
    List<Plantao> findByHospitalId(Long hospitalId);
    List<Plantao> findByHospitalIdAndSetorId(Long hospitalId, Long setorId);
    List<Plantao> findBySetorAndPeriod(Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByDoctorAndPeriod(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByHospitalAndPeriod(Long hospitalId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByHospitalAndSetorAndPeriod(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByDoctorAndHospital(Long doctorId, Long hospitalId);
    List<Plantao> findByDoctorAndHospitalAndPeriod(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end);
    Plantao update(Long id, Plantao plantao);
    void delete(Long id);
    Plantao checkIn(Long plantaoId, Long doctorId);
    Plantao checkOut(Long plantaoId, Long doctorId);
    Plantao registerInterest(Long plantaoId, Doctor doctor);
    Plantao openForExchange(Long plantaoId);
}
