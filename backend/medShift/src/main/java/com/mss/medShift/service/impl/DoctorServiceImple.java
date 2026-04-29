package com.mss.medShift.service.impl;

import java.util.NoSuchElementException;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.repository.DoctorRepository;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.service.DoctorService;

@Service
public class DoctorServiceImple implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImple(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    @Override
    public Doctor findById(Long id) {
        return doctorRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Doctor create(Doctor doctorToCreate) {
        if(doctorRepository.existsByCrm(doctorToCreate.getCrm())) {
            throw new IllegalArgumentException("This CRM is already registered");
        }
        if(doctorRepository.existsByEmail(doctorToCreate.getEmail())) {
            throw new IllegalArgumentException("This email is already registered");
        }

        doctorToCreate.setRole(UserRole.DOCTOR);
        doctorToCreate.setPassword(passwordEncoder.encode(doctorToCreate.getPassword()));

        return doctorRepository.save(doctorToCreate);
    }

    @Override
    public void delete(Long id) {
        if(doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
        }
        throw new NoSuchElementException("Id not founded");
    }
}
