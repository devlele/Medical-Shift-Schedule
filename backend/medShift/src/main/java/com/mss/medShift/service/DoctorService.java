package com.mss.medShift.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Doctor;

public interface DoctorService {
    Doctor findById(Long id);
    Doctor findByIdAndHospitalId(Long id, Long hospitalId);
    Doctor findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Doctor> findAll();
    List<Doctor> findByHospitalId(Long hospitalId);
    List<Doctor> findByHospitalIdAndSetorId(Long hospitalId, Long setorId);
    Doctor create(Doctor doctorToCreate);
    Doctor update(Long id, Doctor doctorToUpdate);
    UserDetails findByEmail(String email);
    void delete(Long id);
} 
