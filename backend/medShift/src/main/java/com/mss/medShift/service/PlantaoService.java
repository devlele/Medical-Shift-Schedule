package com.mss.medShift.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.TipoRecorrenciaPlantao;

public interface PlantaoService {
    Plantao create(Plantao plantao);
    default Plantao createAvulso(Long setorId, Long medicoId, LocalDateTime dataInicio, LocalDateTime dataFim,
            Manager escalista) {
        return createAvulso(setorId, medicoId, null, null, dataInicio, dataFim, escalista);
    }

    Plantao createAvulso(Long setorId, Long medicoId, LocalDate data, PlantaoTurno turno,
            LocalDateTime dataInicio, LocalDateTime dataFim, Manager escalista);
    PlantaoFixoCreationResult createFixo(Long setorId, Long medicoId, TipoRecorrenciaPlantao tipoRecorrencia,
            String diaSemana, Integer semanaDoMes, Integer diaDoMes, PlantaoTurno turno,
            LocalTime horaInicio, LocalTime horaFim, LocalDate dataInicioVigencia,
            LocalDate dataFimVigencia, Manager escalista);
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
}
