package com.mss.medShift.service.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.repository.ManagerRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.service.ManagerService;

@Service
public class ManagerServiceImple implements ManagerService {
    private final ManagerRepository managerRepository;
    private final SetorRepository setorRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerServiceImple(ManagerRepository managerRepository, SetorRepository setorRepository,
            PasswordEncoder passwordEncoder) {
        this.managerRepository = managerRepository;
        this.setorRepository = setorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails findByEmail(String email) {
        return managerRepository.findByEmail(email);
    }

    public Manager findById(Long id) {
        return managerRepository.findById(id).orElseThrow();
    }

    public List<Manager> findByHospitalId(Long hospitalId) {
        return managerRepository.findByHospitalId(hospitalId);
    }

    public Manager create(Manager managerToCreate) {
        throw new UnsupportedOperationException("Use create(manager, hospitalLogado) to create a manager from an authenticated hospital");
    }

    public Manager create(Manager managerToCreate, Hospital hospitalLogado) {
        if (managerRepository.existsByCpf(managerToCreate.getCpf())) {
            throw new IllegalArgumentException("This CPF is already registered");
        }
        if (managerRepository.existsByEmail(managerToCreate.getEmail())) {
            throw new IllegalArgumentException("This email is already registered");
        }
        if (managerToCreate.getSetor() == null || managerToCreate.getSetor().getId() == null) {
            throw new IllegalArgumentException("Setor must be provided and must include a valid id");
        }

        Setor setor = setorRepository.findById(managerToCreate.getSetor().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado"));

        if (setor.getHospital() == null || !setor.getHospital().getId().equals(hospitalLogado.getId())) {
            throw new IllegalArgumentException("O setor informado não pertence ao hospital logado");
        }

        managerToCreate.setRole(UserRole.MANAGER);
        managerToCreate.setPassword(passwordEncoder.encode(managerToCreate.getPassword()));
        managerToCreate.setHospital(hospitalLogado);
        managerToCreate.setSetor(setor);

        return managerRepository.save(managerToCreate);
    }

    public void delete(Long id) {
        if(managerRepository.existsById(id)) {
            managerRepository.deleteById(id);
        }
        throw new IllegalArgumentException("Id not founded");
    }
}
