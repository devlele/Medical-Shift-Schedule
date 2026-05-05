package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.medShift.domain.model.Setor;

public interface SetorRepository extends JpaRepository<Setor, Long> {
    List<Setor> findByHospitalId(Long hospitalId);
    Optional<Setor> findByIdAndHospitalId(Long id, Long hospitalId);
    Optional<Setor> findByNomeAndHospitalId(String nome, Long hospitalId);
    boolean existsByNomeAndHospitalId(String nome, Long hospitalId);
}
