package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.repository.DoctorRepository;
import com.mss.medShift.domain.repository.MedicoSetorRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.domain.repository.UsuarioRepository;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.MedicoSetor;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.service.DoctorService;

@Service
public class DoctorServiceImple implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final MedicoSetorRepository medicoSetorRepository;
    private final SetorRepository setorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImple(DoctorRepository doctorRepository, MedicoSetorRepository medicoSetorRepository,
            SetorRepository setorRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.medicoSetorRepository = medicoSetorRepository;
        this.setorRepository = setorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Doctor findByUsuarioId(Long usuarioId) {
        return doctorRepository.findByUsuarioId(usuarioId).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Doctor findById(Long id) {
        return doctorRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Doctor findByIdAndHospitalId(Long id, Long hospitalId) {
        Doctor doctor = findById(id);
        if (!doctorBelongsToHospital(doctor, hospitalId)) {
            throw new NoSuchElementException();
        }
        return doctor;
    }

    @Override
    public Doctor findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId) {
        Doctor doctor = findById(id);
        if (!doctorBelongsToSetor(doctor, setorId) || !setorBelongsToHospital(setorId, hospitalId)) {
            throw new NoSuchElementException();
        }
        return doctor;
    }

    @Override
    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> findByHospitalId(Long hospitalId) {
        if (hospitalId == null) {
            return List.of();
        }

        List<Long> setorIds = setorRepository.findByHospitalId(hospitalId).stream()
                .map(Setor::getId)
                .filter(id -> id != null)
                .toList();

        var doctorsById = new LinkedHashMap<Long, Doctor>();

        findBySetorIds(setorIds).forEach(doctor -> doctorsById.putIfAbsent(doctor.getId(), doctor));

        doctorRepository.findByHospitalId(hospitalId).stream()
                .filter(doctor -> doctor.getId() != null)
                .forEach(doctor -> doctorsById.putIfAbsent(doctor.getId(), doctor));

        return List.copyOf(doctorsById.values());
    }

    @Override
    public List<Doctor> findByHospitalIdAndSetorId(Long hospitalId, Long setorId) {
        if (!setorBelongsToHospital(setorId, hospitalId)) {
            return List.of();
        }
        return findBySetorIds(List.of(setorId));
    }

    @Override
    public List<Doctor> findBySetorIds(List<Long> setorIds) {
        if (setorIds == null || setorIds.isEmpty()) {
            return List.of();
        }

        var doctorsById = new LinkedHashMap<Long, Doctor>();

        medicoSetorRepository.findBySetorIdInAndAtivoTrue(setorIds).stream()
                .map(MedicoSetor::getMedico)
                .filter(doctor -> doctor != null && doctor.getId() != null)
                .forEach(doctor -> doctorsById.putIfAbsent(doctor.getId(), doctor));

        doctorRepository.findAll().stream()
                .filter(doctor -> doctor.getId() != null)
                .filter(doctor -> doctor.getSetor() != null
                        && doctor.getSetor().getId() != null
                        && setorIds.contains(doctor.getSetor().getId()))
                .forEach(doctor -> doctorsById.putIfAbsent(doctor.getId(), doctor));

        return List.copyOf(doctorsById.values());
    }

    @Override
    public List<Doctor> findLinkCandidates(Manager escalistaLogado, Long setorId, String termo) {
        if (escalistaLogado.getHospital() == null || escalistaLogado.getHospital().getId() == null) {
            throw new IllegalArgumentException("Escalista sem hospital");
        }

        String termoNormalizado = termo != null ? termo.trim().toLowerCase() : "";

        return doctorRepository.findAll().stream()
                .filter(doctor -> setorId == null
                        || medicoSetorRepository.findByMedicoIdAndSetorIdAndAtivoTrue(doctor.getId(), setorId).isEmpty())
                .filter(doctor -> matchesTermo(doctor, termoNormalizado))
                .toList();
    }

    @Override
    public Doctor create(Doctor doctorToCreate) {
        if(doctorRepository.existsByCrm(doctorToCreate.getCrm())) {
            throw new IllegalArgumentException("This CRM is already registered");
        }
        String email = doctorToCreate.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if(usuarioRepository.existsByEmail(email) || doctorRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("This email is already registered");
        }
        if (doctorToCreate.getPassword() == null || doctorToCreate.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        if (doctorToCreate.getUf() == null && doctorToCreate.getCrm() != null && doctorToCreate.getCrm().contains("/")) {
            String[] crmParts = doctorToCreate.getCrm().split("/");
            if (crmParts.length > 1) {
                doctorToCreate.setUf(crmParts[1].toUpperCase());
            }
        }

        LocalDateTime now = LocalDateTime.now();
        Usuario usuario = new Usuario(
                doctorToCreate.getName(),
                email,
                passwordEncoder.encode(doctorToCreate.getPassword()),
                doctorToCreate.getCpf(),
                doctorToCreate.getBirthday(),
                doctorToCreate.getTelefone(),
                UserRole.MEDICO);
        usuario.setCriadoEm(now);
        usuario.setAtualizadoEm(now);

        doctorToCreate.setUsuario(usuarioRepository.save(usuario));
        doctorToCreate.setRole(UserRole.MEDICO);
        doctorToCreate.setPassword(usuario.getSenhaHash());
        doctorToCreate.setCriadoEm(now);
        doctorToCreate.setAtualizadoEm(now);

        return doctorRepository.save(doctorToCreate);
    }

    @Override
    public List<MedicoSetor> findSetoresVinculados(Long doctorId, Manager escalistaLogado, List<Long> setorIdsPermitidos) {
        Doctor doctor = findById(doctorId);
        List<MedicoSetor> vinculos = medicoSetorRepository.findByMedicoIdAndAtivoTrue(doctor.getId()).stream()
                .filter(vinculo -> vinculo.getSetor() != null
                        && vinculo.getSetor().getId() != null
                        && setorIdsPermitidos.contains(vinculo.getSetor().getId()))
                .toList();

        if (!vinculos.isEmpty()) {
            return vinculos;
        }
        if (doctor.getSetor() != null && doctor.getSetor().getId() != null
                && setorIdsPermitidos.contains(doctor.getSetor().getId())) {
            return List.of(createOrReactivateVinculo(doctor, doctor.getSetor(), escalistaLogado, LocalDateTime.now()));
        }
        return List.of();
    }

    @Override
    public MedicoSetor vincularSetor(Long doctorId, Long setorId, Manager escalistaLogado) {
        Doctor doctor = findById(doctorId);
        Setor setor = findSetorDoHospital(setorId, escalistaLogado);

        if (doctor.getHospital() == null) {
            doctor.setHospital(escalistaLogado.getHospital());
        }
        if (doctor.getSetor() == null) {
            doctor.setSetor(setor);
        }
        doctor.setAtualizadoEm(LocalDateTime.now());
        doctorRepository.save(doctor);

        return createOrReactivateVinculo(doctor, setor, escalistaLogado, LocalDateTime.now());
    }

    @Override
    public void desvincularSetor(Long doctorId, Long setorId, Manager escalistaLogado) {
        Doctor doctor = findById(doctorId);
        Setor setor = findSetorDoHospital(setorId, escalistaLogado);

        medicoSetorRepository.findByMedicoIdAndSetorIdAndAtivoTrue(doctor.getId(), setor.getId())
                .ifPresentOrElse(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(LocalDateTime.now());
                    medicoSetorRepository.save(vinculo);
                }, () -> {
                    if (!isLegacySetor(doctor, setor)) {
                        throw new IllegalArgumentException("Vínculo entre médico e setor não encontrado");
                    }
                });

        if (isLegacySetor(doctor, setor)) {
            doctor.setSetor(resolveNextSetor(doctor.getId(), setor.getId()));
            syncLegacyHospitalFromSetor(doctor);
            doctor.setAtualizadoEm(LocalDateTime.now());
            doctorRepository.save(doctor);
        }
    }

    @Override
    public Doctor update(Long id, Doctor doctorToUpdate) {
        Doctor doctor = findById(id);

        if (doctorToUpdate.getName() != null) {
            doctor.setName(doctorToUpdate.getName());
            if (doctor.getUsuario() != null) {
                doctor.getUsuario().setNome(doctorToUpdate.getName());
            }
        }
        if (doctorToUpdate.getSpecialty() != null) {
            doctor.setSpecialty(doctorToUpdate.getSpecialty());
        }
        if (doctorToUpdate.getUf() != null) {
            doctor.setUf(doctorToUpdate.getUf());
        }
        if (doctorToUpdate.getTelefone() != null) {
            doctor.setTelefone(doctorToUpdate.getTelefone());
            if (doctor.getUsuario() != null) {
                doctor.getUsuario().setTelefone(doctorToUpdate.getTelefone());
            }
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
        doctor.setAtualizadoEm(LocalDateTime.now());
        if (doctor.getUsuario() != null) {
            doctor.getUsuario().setAtualizadoEm(LocalDateTime.now());
            usuarioRepository.save(doctor.getUsuario());
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

    private MedicoSetor createOrReactivateVinculo(Doctor doctor, Setor setor, Manager escalistaLogado, LocalDateTime now) {
        MedicoSetor vinculo = medicoSetorRepository
                .findByMedicoIdAndSetorId(doctor.getId(), setor.getId())
                .orElseGet(MedicoSetor::new);

        vinculo.setMedico(doctor);
        vinculo.setSetor(setor);
        vinculo.setVinculadoPorEscalista(escalistaLogado);
        vinculo.setAtivo(true);
        if (vinculo.getVinculadoEm() == null) {
            vinculo.setVinculadoEm(now);
        }
        vinculo.setDesvinculadoEm(null);

        return medicoSetorRepository.save(vinculo);
    }

    private Setor findSetorDoHospital(Long setorId, Manager escalistaLogado) {
        if (escalistaLogado.getHospital() == null) {
            throw new IllegalArgumentException("Escalista sem hospital");
        }
        return setorRepository.findByIdAndHospitalId(setorId, escalistaLogado.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado para o hospital do escalista"));
    }

    private boolean isLegacySetor(Doctor doctor, Setor setor) {
        return doctor.getSetor() != null && doctor.getSetor().getId() != null
                && doctor.getSetor().getId().equals(setor.getId());
    }

    private Setor resolveNextSetor(Long doctorId, Long setorRemovidoId) {
        return medicoSetorRepository.findByMedicoIdAndAtivoTrue(doctorId).stream()
                .map(MedicoSetor::getSetor)
                .filter(setor -> setor != null && setor.getId() != null && !setor.getId().equals(setorRemovidoId))
                .findFirst()
                .orElse(null);
    }

    private boolean doctorBelongsToHospital(Doctor doctor, Long hospitalId) {
        if (doctor == null || doctor.getId() == null || hospitalId == null) {
            return false;
        }

        boolean legacyHospital = doctor.getHospital() != null
                && hospitalId.equals(doctor.getHospital().getId());

        boolean linkedHospital = medicoSetorRepository.findByMedicoIdAndAtivoTrue(doctor.getId()).stream()
                .map(MedicoSetor::getSetor)
                .anyMatch(setor -> setor != null
                        && setor.getHospital() != null
                        && hospitalId.equals(setor.getHospital().getId()));

        return legacyHospital || linkedHospital;
    }

    private boolean doctorBelongsToSetor(Doctor doctor, Long setorId) {
        if (doctor == null || doctor.getId() == null || setorId == null) {
            return false;
        }

        boolean legacySetor = doctor.getSetor() != null
                && setorId.equals(doctor.getSetor().getId());

        boolean linkedSetor = medicoSetorRepository
                .findByMedicoIdAndSetorIdAndAtivoTrue(doctor.getId(), setorId)
                .isPresent();

        return legacySetor || linkedSetor;
    }

    private boolean setorBelongsToHospital(Long setorId, Long hospitalId) {
        if (setorId == null || hospitalId == null) {
            return false;
        }
        return setorRepository.findByIdAndHospitalId(setorId, hospitalId).isPresent();
    }

    private void syncLegacyHospitalFromSetor(Doctor doctor) {
        doctor.setHospital(doctor.getSetor() != null ? doctor.getSetor().getHospital() : null);
    }

    private boolean matchesTermo(Doctor doctor, String termo) {
        if (termo == null || termo.isBlank()) {
            return true;
        }
        return containsIgnoreCase(doctor.getName(), termo)
                || containsIgnoreCase(doctor.getEmail(), termo)
                || containsIgnoreCase(doctor.getCpf(), termo)
                || containsIgnoreCase(doctor.getCrm(), termo);
    }

    private boolean containsIgnoreCase(String value, String termo) {
        return value != null && value.toLowerCase().contains(termo);
    }
}
