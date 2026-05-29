package com.mss.medShift.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoStatus;

@Repository
public interface PlantaoRepository extends JpaRepository<Plantao, Long> {
    List<Plantao> findBySetorId(Long setorId);
    List<Plantao> findByMedicoResponsavelAtualId(Long doctorId);
    List<Plantao> findByDataInicioBetween(LocalDateTime start, LocalDateTime end);
    List<Plantao> findBySetorIdAndDataInicioBetween(Long setorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findByMedicoResponsavelAtualIdAndDataInicioBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Plantao> findBySetor_Hospital_Id(Long hospitalId);
    List<Plantao> findBySetor_Hospital_IdAndDataInicioBetween(Long hospitalId, LocalDateTime start, LocalDateTime end);
    Optional<Plantao> findByIdAndSetor_Hospital_Id(Long id, Long hospitalId);
    Optional<Plantao> findByIdAndSetor_Hospital_IdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Plantao> findBySetor_Hospital_IdAndSetorId(Long hospitalId, Long setorId);
    List<Plantao> findBySetor_Hospital_IdAndSetorIdAndDataInicioBetween(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end);
    boolean existsByMedicoResponsavelAtualIdAndStatusNotAndDataInicioLessThanAndDataFimGreaterThan(
            Long medicoId,
            PlantaoStatus status,
            LocalDateTime dataFim,
            LocalDateTime dataInicio);
}
