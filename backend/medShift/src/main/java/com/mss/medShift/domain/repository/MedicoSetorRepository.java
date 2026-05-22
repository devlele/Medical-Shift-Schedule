package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.MedicoSetor;

@Repository
public interface MedicoSetorRepository extends JpaRepository<MedicoSetor, Long> {
    List<MedicoSetor> findByMedicoIdAndAtivoTrue(Long medicoId);
    List<MedicoSetor> findBySetorIdAndAtivoTrue(Long setorId);
    List<MedicoSetor> findBySetorIdInAndAtivoTrue(List<Long> setorIds);
    Optional<MedicoSetor> findByMedicoIdAndSetorId(Long medicoId, Long setorId);
    Optional<MedicoSetor> findByMedicoIdAndSetorIdAndAtivoTrue(Long medicoId, Long setorId);
}
