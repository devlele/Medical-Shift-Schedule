package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Manager;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long>{
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    Optional<Manager> findByEmail(String email);
    Optional<Manager> findByCpf(String cpf);
    Optional<Manager> findByUsuarioId(Long usuarioId);
    List<Manager> findBySetor_Hospital_Id(Long hospitalId);
    Optional<Manager> findByIdAndSetor_Hospital_Id(Long id, Long hospitalId);
    List<Manager> findAllBySetorId(Long setorId);
}
