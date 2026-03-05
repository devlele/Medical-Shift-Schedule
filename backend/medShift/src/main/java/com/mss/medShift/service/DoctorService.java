package com.mss.medShift.service;

import com.mss.medShift.domain.model.Doctor;

public interface DoctorService {
    Doctor findById(Long id);
    Doctor create(Doctor doctorToCreate);
    void delete(Long id);
} 
