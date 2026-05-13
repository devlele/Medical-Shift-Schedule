package com.mss.medShift.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

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
}
