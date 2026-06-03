package com.mss.medShift.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoMedico;
import com.mss.medShift.domain.model.PlantaoStatus;

@Repository
public interface PlantaoMedicoRepository extends JpaRepository<PlantaoMedico, Long> {

    List<PlantaoMedico> findByPlantaoId(Long plantaoId);

    Optional<PlantaoMedico> findByPlantaoIdAndMedicoResponsavelAtualId(Long plantaoId, Long medicoId);

    Optional<PlantaoMedico> findByPlantaoIdAndMedicoTitularId(Long plantaoId, Long medicoId);

    @Modifying
    @Query("delete from PlantaoMedico plantaoMedico where plantaoMedico.plantao.id = :plantaoId")
    void deleteByPlantaoId(@Param("plantaoId") Long plantaoId);

    @Query("""
            select distinct pm.plantao
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
            """)
    List<Plantao> findPlantoesByMedicoResponsavelAtualId(@Param("medicoId") Long medicoId);

    @Query("""
            select distinct pm.plantao
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
              and pm.plantao.dataInicio between :start and :end
            """)
    List<Plantao> findPlantoesByMedicoResponsavelAtualIdAndPeriodo(
            @Param("medicoId") Long medicoId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
            select distinct pm.plantao
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
              and pm.plantao.setor.hospital.id = :hospitalId
            """)
    List<Plantao> findPlantoesByMedicoResponsavelAtualIdAndHospitalId(
            @Param("medicoId") Long medicoId,
            @Param("hospitalId") Long hospitalId);

    @Query("""
            select distinct pm.plantao
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
              and pm.plantao.setor.hospital.id = :hospitalId
              and pm.plantao.dataInicio between :start and :end
            """)
    List<Plantao> findPlantoesByMedicoResponsavelAtualIdAndHospitalIdAndPeriodo(
            @Param("medicoId") Long medicoId,
            @Param("hospitalId") Long hospitalId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
            select count(pm) > 0
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
              and pm.status <> :statusIgnorado
              and pm.plantao.status <> :statusIgnorado
              and pm.plantao.dataInicio < :dataFim
              and pm.plantao.dataFim > :dataInicio
            """)
    boolean existsConflitoHorario(
            @Param("medicoId") Long medicoId,
            @Param("statusIgnorado") PlantaoStatus statusIgnorado,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("dataInicio") LocalDateTime dataInicio);

    @Query("""
            select count(pm) > 0
            from PlantaoMedico pm
            where pm.medicoResponsavelAtual.id = :medicoId
              and pm.status <> :statusIgnorado
              and pm.plantao.status <> :statusIgnorado
              and pm.plantao.id <> :plantaoIdIgnorado
              and pm.plantao.dataInicio < :dataFim
              and pm.plantao.dataFim > :dataInicio
            """)
    boolean existsConflitoHorarioExcluindoPlantao(
            @Param("medicoId") Long medicoId,
            @Param("statusIgnorado") PlantaoStatus statusIgnorado,
            @Param("plantaoIdIgnorado") Long plantaoIdIgnorado,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("dataInicio") LocalDateTime dataInicio);
}
