package com.mss.medShift.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.repository.HospitalRepository;
import com.mss.medShift.service.HospitalService;

@Service
public class HospitalServiceImple implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;

    public HospitalServiceImple(HospitalRepository hospitalRepository, PasswordEncoder passwordEncoder) {
        this.hospitalRepository = hospitalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Hospital create(Hospital hospital) {
        if (hospitalRepository.existsByCnpj(hospital.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        if (hospitalRepository.existsByEmail(hospital.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
        return hospitalRepository.save(hospital);
    }

    @Override
    public Hospital findById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado"));
    }

    @Override
    public List<Hospital> findAll() {
        return hospitalRepository.findAll();
    }

    @Override
    public Hospital update(Long id, Hospital hospital) {
        Hospital existingHospital = findById(id);
        
        if (hospital.getNomeFantasia() != null) {
            existingHospital.setNomeFantasia(hospital.getNomeFantasia());
        }
        if (hospital.getEndereco() != null) {
            existingHospital.setEndereco(hospital.getEndereco());
        }
        if (hospital.getNomeGestor() != null) {
            existingHospital.setNomeGestor(hospital.getNomeGestor());
        }
        if (hospital.getPassword() != null && !hospital.getPassword().isEmpty()) {
            existingHospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
        }
        
        return hospitalRepository.save(existingHospital);
    }

    @Override
    public void delete(Long id) {
        Hospital hospital = findById(id);
        hospitalRepository.delete(hospital);
    }

    @Override
    public Hospital findByCnpj(String cnpj) {
        return hospitalRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado com este CNPJ"));
    }

    @Override
    public Hospital findByEmail(String email) {
        return hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado com este email"));
    }
}