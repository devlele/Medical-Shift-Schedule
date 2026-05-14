package com.mss.medShift.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Plantao;

@Repository
public interface PlantaoRepository extends JpaRepository<Plantao, Long> {
    List<Plantao> findBySetorId(Long setorId);
    List<Plantao> findByDoctorAssignadoId(Long doctorId);
    List<Plantao> findByDataInicioBetween(LocalDateTime start, LocalDateTime end);
    List<Plantao> findBySetorIdAndDataInicioBetween(Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByDoctorAssignadoIdAndDataInicioBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findBySetorHospitalId(Long hospitalId);
    List<Plantao> findBySetorHospitalIdAndDataInicioBetween(Long hospitalId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByDoctorAssignadoIdAndSetorHospitalId(Long doctorId, Long hospitalId);
    List<Plantao> findByDoctorAssignadoIdAndSetorHospitalIdAndDataInicioBetween(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end);
    Optional<Plantao> findByIdAndSetorHospitalId(Long id, Long hospitalId);
    Optional<Plantao> findByIdAndSetorHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Plantao> findBySetorHospitalIdAndSetorId(Long hospitalId, Long setorId);
    List<Plantao> findBySetorHospitalIdAndSetorIdAndDataInicioBetween(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end);
}
