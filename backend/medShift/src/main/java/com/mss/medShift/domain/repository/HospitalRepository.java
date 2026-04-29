package com.mss.medShift.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.medShift.domain.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByEmail(String email);
    Optional<Hospital> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    boolean existsByEmail(String email);
}