package com.mss.medShift.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.MedicoEspecialidade;

@Repository
public interface MedicoEspecialidadeRepository extends JpaRepository<MedicoEspecialidade, Long> {
    List<MedicoEspecialidade> findByMedicoId(Long medicoId);
}
