package com.mss.medShift.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Doctor;

public interface DoctorService {
    Doctor findById(Long id);
    List<Doctor> findAll();
    Doctor create(Doctor doctorToCreate);
    Doctor update(Long id, Doctor doctorToUpdate);
    UserDetails findByEmail(String email);
    void delete(Long id);
} 
