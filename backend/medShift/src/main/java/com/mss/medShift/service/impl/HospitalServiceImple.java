package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.repository.HospitalRepository;
import com.mss.medShift.domain.repository.UsuarioRepository;
import com.mss.medShift.service.HospitalService;

@Service
public class HospitalServiceImple implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public HospitalServiceImple(HospitalRepository hospitalRepository, UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.hospitalRepository = hospitalRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Hospital create(Hospital hospital) {
        if (hospitalRepository.existsByCnpj(hospital.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        String email = hospital.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        if (usuarioRepository.existsByEmail(email) || hospitalRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado");
        }

        String rawPassword = hospital.getPassword();
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        LocalDateTime now = LocalDateTime.now();
        Usuario usuario = new Usuario(
                hospital.getNomeGestor() != null ? hospital.getNomeGestor() : hospital.getNomeFantasia(),
                email,
                passwordEncoder.encode(rawPassword),
                null,
                null,
                hospital.getTelefone(),
                UserRole.HOSPITAL);
        usuario.setCriadoEm(now);
        usuario.setAtualizadoEm(now);

        hospital.setUsuario(usuarioRepository.save(usuario));
        hospital.setRole(UserRole.HOSPITAL);
        hospital.setPassword(usuario.getSenhaHash());
        hospital.setCriadoEm(now);
        hospital.setAtualizadoEm(now);
        return hospitalRepository.save(hospital);
    }

    @Override
    public Hospital findById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado"));
    }

    @Override
    public Hospital findByUsuarioId(Long usuarioId) {
        return hospitalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado para este usuário"));
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
            String encodedPassword = passwordEncoder.encode(hospital.getPassword());
            existingHospital.setPassword(encodedPassword);
            if (existingHospital.getUsuario() != null) {
                existingHospital.getUsuario().setSenhaHash(encodedPassword);
                existingHospital.getUsuario().setAtualizadoEm(LocalDateTime.now());
                usuarioRepository.save(existingHospital.getUsuario());
            }
        }
        existingHospital.setAtualizadoEm(LocalDateTime.now());
        
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
