package com.mss.medShift.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.RegraPlantaoFixo;

@Repository
public interface RegraPlantaoFixoRepository extends JpaRepository<RegraPlantaoFixo, Long> {
    List<RegraPlantaoFixo> findByHospitalIdAndAtivoTrue(Long hospitalId);
    List<RegraPlantaoFixo> findBySetorIdAndAtivoTrue(Long setorId);
    List<RegraPlantaoFixo> findByMedicoTitularIdAndAtivoTrue(Long medicoId);
}
