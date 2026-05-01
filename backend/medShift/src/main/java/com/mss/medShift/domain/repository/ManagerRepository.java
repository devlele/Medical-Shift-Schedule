package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Manager;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long>{
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    UserDetails findByEmail(String email);
    List<Manager> findByHospitalId(Long hospitalId);
    Optional<Manager> findByIdAndHospitalId(Long id, Long hospitalId);
}
