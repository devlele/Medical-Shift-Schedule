package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
        
        boolean existsByCrm(String crm); 
        boolean existsByEmail(String email);
        Optional<Doctor> findByEmail(String email);
        Optional<Doctor> findByUsuarioId(Long usuarioId);
        List<Doctor> findByHospitalId(Long hospitalId);
        List<Doctor> findByHospitalIdAndSetorId(Long hospitalId, Long setorId);
        Optional<Doctor> findByIdAndHospitalId(Long id, Long hospitalId);
        Optional<Doctor> findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
}
