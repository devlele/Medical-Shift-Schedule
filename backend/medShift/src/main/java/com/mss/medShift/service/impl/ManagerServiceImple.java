package com.mss.medShift.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.repository.ManagerRepository;
import com.mss.medShift.service.ManagerService;

@Service
public class ManagerServiceImple implements ManagerService {
    private final ManagerRepository managerRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerServiceImple(ManagerRepository managerRepository, PasswordEncoder passwordEncoder) {
        this.managerRepository = managerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails findByEmail(String email) {
        return managerRepository.findByEmail(email);
    }

    public Manager findById(Long id) {
        return managerRepository.findById(id).orElseThrow();
    }

    public Manager create(Manager managerToCreate) {
        if(managerRepository.existsByCpf(managerToCreate.getCpf())) {
            throw new IllegalArgumentException("This CPF is already registered");
        }
        if(managerRepository.existsByEmail(managerToCreate.getEmail())) {
            throw new IllegalArgumentException("This email is already registered");
        }

        managerToCreate.setRole(UserRole.ADMIN);
        managerToCreate.setPassword(passwordEncoder.encode(managerToCreate.getPassword()));

        return managerRepository.save(managerToCreate);
    }

    public void delete(Long id) {
        if(managerRepository.existsById(id)) {
            managerRepository.deleteById(id);
        }
        throw new IllegalArgumentException("Id not founded");
    }
}
