package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.EscalistaSetor;

@Repository
public interface EscalistaSetorRepository extends JpaRepository<EscalistaSetor, Long> {
    List<EscalistaSetor> findByEscalistaIdAndAtivoTrue(Long escalistaId);
    List<EscalistaSetor> findBySetorIdAndAtivoTrue(Long setorId);
    Optional<EscalistaSetor> findByEscalistaIdAndSetorId(Long escalistaId, Long setorId);
    Optional<EscalistaSetor> findByEscalistaIdAndSetorIdAndAtivoTrue(Long escalistaId, Long setorId);
}
