package com.mss.medShift.service.impl;

import java.util.List;
import java.util.NoSuchElementException;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.EscalistaSetor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.repository.EscalistaSetorRepository;
import com.mss.medShift.domain.repository.ManagerRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.domain.repository.UsuarioRepository;
import com.mss.medShift.service.ManagerService;

@Service
public class ManagerServiceImple implements ManagerService {
    private final ManagerRepository managerRepository;
    private final SetorRepository setorRepository;
    private final EscalistaSetorRepository escalistaSetorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerServiceImple(ManagerRepository managerRepository, SetorRepository setorRepository,
            EscalistaSetorRepository escalistaSetorRepository, UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.managerRepository = managerRepository;
        this.setorRepository = setorRepository;
        this.escalistaSetorRepository = escalistaSetorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Manager findById(Long id) {
        return managerRepository.findById(id).orElseThrow();
    }

    public Manager findByUsuarioId(Long usuarioId) {
        return managerRepository.findByUsuarioId(usuarioId).orElseThrow();
    }

    public Manager findById(Long id, Hospital hospitalLogado) {
        return managerRepository.findByIdAndHospitalId(id, hospitalLogado.getId())
                .orElseThrow();
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
        String email = managerToCreate.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (usuarioRepository.existsByEmail(email) || managerRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("This email is already registered");
        }
        if (managerToCreate.getPassword() == null || managerToCreate.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (managerToCreate.getSetor() == null || managerToCreate.getSetor().getId() == null) {
            throw new IllegalArgumentException("Setor must be provided and must include a valid id");
        }

        Setor setor = setorRepository.findById(managerToCreate.getSetor().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado"));

        if (setor.getHospital() == null || !setor.getHospital().getId().equals(hospitalLogado.getId())) {
            throw new IllegalArgumentException("O setor informado não pertence ao hospital logado");
        }

        LocalDateTime now = LocalDateTime.now();
        Usuario usuario = new Usuario(
                managerToCreate.getName(),
                email,
                passwordEncoder.encode(managerToCreate.getPassword()),
                managerToCreate.getCpf(),
                managerToCreate.getBirthday(),
                null,
                UserRole.ESCALISTA);
        usuario.setCriadoEm(now);
        usuario.setAtualizadoEm(now);

        managerToCreate.setUsuario(usuarioRepository.save(usuario));
        managerToCreate.setRole(UserRole.ESCALISTA);
        managerToCreate.setPassword(usuario.getSenhaHash());
        managerToCreate.setHospital(hospitalLogado);
        managerToCreate.setSetor(setor);
        managerToCreate.setCriadoEm(now);
        managerToCreate.setAtualizadoEm(now);

        Manager managerCreated = managerRepository.save(managerToCreate);
        createOrReactivateVinculo(managerCreated, setor, hospitalLogado.getUsuario(), now);

        return managerCreated;
    }

    public List<EscalistaSetor> findSetoresVinculados(Long managerId, Hospital hospitalLogado) {
        Manager manager = findById(managerId, hospitalLogado);
        List<EscalistaSetor> vinculos = escalistaSetorRepository.findByEscalistaIdAndAtivoTrue(manager.getId());

        if (!vinculos.isEmpty()) {
            return vinculos;
        }
        if (manager.getSetor() != null && manager.getSetor().getHospital() != null
                && manager.getSetor().getHospital().getId().equals(hospitalLogado.getId())) {
            return List.of(createOrReactivateVinculo(manager, manager.getSetor(), hospitalLogado.getUsuario(), LocalDateTime.now()));
        }
        return List.of();
    }

    public EscalistaSetor vincularSetor(Long managerId, Long setorId, Hospital hospitalLogado, Usuario usuarioLogado) {
        Manager manager = findById(managerId, hospitalLogado);
        Setor setor = findSetorDoHospital(setorId, hospitalLogado);
        EscalistaSetor vinculo = createOrReactivateVinculo(manager, setor, usuarioLogado, LocalDateTime.now());

        if (manager.getSetor() == null) {
            manager.setSetor(setor);
            manager.setAtualizadoEm(LocalDateTime.now());
            managerRepository.save(manager);
        }

        return vinculo;
    }

    public void desvincularSetor(Long managerId, Long setorId, Hospital hospitalLogado) {
        Manager manager = findById(managerId, hospitalLogado);
        Setor setor = findSetorDoHospital(setorId, hospitalLogado);

        escalistaSetorRepository.findByEscalistaIdAndSetorIdAndAtivoTrue(manager.getId(), setor.getId())
                .ifPresentOrElse(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(LocalDateTime.now());
                    escalistaSetorRepository.save(vinculo);
                }, () -> {
                    if (!isLegacySetor(manager, setor)) {
                        throw new IllegalArgumentException("Vínculo entre escalista e setor não encontrado");
                    }
                });

        if (isLegacySetor(manager, setor)) {
            manager.setSetor(resolveNextSetor(manager.getId(), setor.getId()));
            manager.setAtualizadoEm(LocalDateTime.now());
            managerRepository.save(manager);
        }
    }

    public void delete(Long id) {
        if(managerRepository.existsById(id)) {
            managerRepository.deleteById(id);
            return;
        }
        throw new NoSuchElementException("Escalista não encontrado");
    }

    public Manager update(Long id, Manager managerToUpdate) {
        Manager manager = findById(id);

        if (managerToUpdate.getName() != null) {
            manager.setName(managerToUpdate.getName());
            if (manager.getUsuario() != null) {
                manager.getUsuario().setNome(managerToUpdate.getName());
            }
        }
        if (managerToUpdate.getDepartment() != null) {
            manager.setDepartment(managerToUpdate.getDepartment());
        }
        if (managerToUpdate.getSetor() != null && managerToUpdate.getSetor().getId() != null) {
            Setor setor = setorRepository.findById(managerToUpdate.getSetor().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado"));
            manager.setSetor(setor);
        }

        manager.setAtualizadoEm(LocalDateTime.now());
        if (manager.getUsuario() != null) {
            manager.getUsuario().setAtualizadoEm(LocalDateTime.now());
            usuarioRepository.save(manager.getUsuario());
        }

        return managerRepository.save(manager);
    }

    private EscalistaSetor createOrReactivateVinculo(Manager manager, Setor setor, Usuario usuarioLogado, LocalDateTime now) {
        EscalistaSetor vinculo = escalistaSetorRepository
                .findByEscalistaIdAndSetorId(manager.getId(), setor.getId())
                .orElseGet(EscalistaSetor::new);

        vinculo.setEscalista(manager);
        vinculo.setSetor(setor);
        vinculo.setVinculadoPorUsuario(usuarioLogado);
        vinculo.setAtivo(true);
        if (vinculo.getVinculadoEm() == null) {
            vinculo.setVinculadoEm(now);
        }
        vinculo.setDesvinculadoEm(null);

        return escalistaSetorRepository.save(vinculo);
    }

    private Setor findSetorDoHospital(Long setorId, Hospital hospitalLogado) {
        return setorRepository.findByIdAndHospitalId(setorId, hospitalLogado.getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado para o hospital logado"));
    }

    private boolean isLegacySetor(Manager manager, Setor setor) {
        return manager.getSetor() != null && manager.getSetor().getId() != null
                && manager.getSetor().getId().equals(setor.getId());
    }

    private Setor resolveNextSetor(Long managerId, Long setorRemovidoId) {
        return escalistaSetorRepository.findByEscalistaIdAndAtivoTrue(managerId).stream()
                .map(EscalistaSetor::getSetor)
                .filter(setor -> setor != null && setor.getId() != null && !setor.getId().equals(setorRemovidoId))
                .findFirst()
                .orElse(null);
    }
}
