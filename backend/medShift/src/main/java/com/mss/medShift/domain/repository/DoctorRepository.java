package com.mss.medShift.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
        
        boolean existsByCrm(String crm); 
        boolean existsByEmail(String email);
        UserDetails findByEmail(String email);
}
