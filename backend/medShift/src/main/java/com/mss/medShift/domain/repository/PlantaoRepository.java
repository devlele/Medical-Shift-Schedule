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
    List<Plantao> findByMedicoResponsavelAtualId(Long doctorId);
    List<Plantao> findByDataInicioBetween(LocalDateTime start, LocalDateTime end);
    List<Plantao> findBySetorIdAndDataInicioBetween(Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByMedicoResponsavelAtualIdAndDataInicioBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByHospitalId(Long hospitalId);
    List<Plantao> findByHospitalIdAndDataInicioBetween(Long hospitalId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByMedicoResponsavelAtualIdAndHospitalId(Long doctorId, Long hospitalId);
    List<Plantao> findByMedicoResponsavelAtualIdAndHospitalIdAndDataInicioBetween(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end);
    Optional<Plantao> findByIdAndHospitalId(Long id, Long hospitalId);
    Optional<Plantao> findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Plantao> findByHospitalIdAndSetorId(Long hospitalId, Long setorId);
    List<Plantao> findByHospitalIdAndSetorIdAndDataInicioBetween(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end);
}
