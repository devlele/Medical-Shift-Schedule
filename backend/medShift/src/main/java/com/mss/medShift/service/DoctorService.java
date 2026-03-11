package com.mss.medShift.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Doctor;

public interface DoctorService {
    Doctor findById(Long id);
    Doctor create(Doctor doctorToCreate);
    UserDetails findByEmail(String email);
    void delete(Long id);
} 
