package com.mss.medShift.service.impl;

import java.util.List;
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
    public Doctor findByIdAndHospitalId(Long id, Long hospitalId) {
        return doctorRepository.findByIdAndHospitalId(id, hospitalId).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Doctor findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId) {
        return doctorRepository.findByIdAndHospitalIdAndSetorId(id, hospitalId, setorId).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> findByHospitalId(Long hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }

    @Override
    public List<Doctor> findByHospitalIdAndSetorId(Long hospitalId, Long setorId) {
        return doctorRepository.findByHospitalIdAndSetorId(hospitalId, setorId);
    }

    @Override
    public Doctor create(Doctor doctorToCreate) {
        if(doctorRepository.existsByCrm(doctorToCreate.getCrm())) {
            throw new IllegalArgumentException("This CRM is already registered");
        }
        if(doctorRepository.existsByEmail(doctorToCreate.getEmail())) {
            throw new IllegalArgumentException("This email is already registered");
        }

        if (doctorToCreate.getUf() == null && doctorToCreate.getCrm() != null && doctorToCreate.getCrm().contains("/")) {
            String[] crmParts = doctorToCreate.getCrm().split("/");
            if (crmParts.length > 1) {
                doctorToCreate.setUf(crmParts[1].toUpperCase());
            }
        }

        doctorToCreate.setRole(UserRole.DOCTOR);
        doctorToCreate.setPassword(passwordEncoder.encode(doctorToCreate.getPassword()));

        return doctorRepository.save(doctorToCreate);
    }

    @Override
    public Doctor update(Long id, Doctor doctorToUpdate) {
        Doctor doctor = findById(id);

        if (doctorToUpdate.getName() != null) {
            doctor.setName(doctorToUpdate.getName());
        }
        if (doctorToUpdate.getSpecialty() != null) {
            doctor.setSpecialty(doctorToUpdate.getSpecialty());
        }
        if (doctorToUpdate.getUf() != null) {
            doctor.setUf(doctorToUpdate.getUf());
        }
        if (doctorToUpdate.getTelefone() != null) {
            doctor.setTelefone(doctorToUpdate.getTelefone());
        }
        if (doctorToUpdate.getFotoPerfilUrl() != null) {
            doctor.setFotoPerfilUrl(doctorToUpdate.getFotoPerfilUrl());
        }
        if (doctorToUpdate.getHospital() != null) {
            doctor.setHospital(doctorToUpdate.getHospital());
        }
        if (doctorToUpdate.getSetor() != null) {
            doctor.setSetor(doctorToUpdate.getSetor());
        }

        return doctorRepository.save(doctor);
    }

    @Override
    public void delete(Long id) {
        if(doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return;
        }
        throw new NoSuchElementException("Id not founded");
    }
}
