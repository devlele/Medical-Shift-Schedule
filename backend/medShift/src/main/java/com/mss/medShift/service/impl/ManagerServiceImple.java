package com.mss.medShift.service.impl;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
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
import com.mss.medShift.service.exception.ConflictException;

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
        return managerRepository.findByIdAndSetor_Hospital_Id(id, hospitalLogado.getId())
                .orElseThrow();
    }

    public List<Manager> findByHospitalId(Long hospitalId) {
        return managerRepository.findBySetor_Hospital_Id(hospitalId).stream()
                .filter(this::isAtivo)
                .filter(manager -> manager.getSetor() == null || isAtivo(manager.getSetor()))
                .toList();
    }

    public Manager create(Manager managerToCreate) {
        throw new UnsupportedOperationException("Use create(manager, hospitalLogado) to create a manager from an authenticated hospital");
    }

    public Manager create(Manager managerToCreate, Hospital hospitalLogado) {
        String cpf = managerToCreate.getCpf();
        if (cpf == null || cpf.isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
        cpf = cpf.trim();
        managerToCreate.setCpf(cpf);

        String email = managerToCreate.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        email = email.trim();
        managerToCreate.setEmail(email);

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

        Manager managerInativoParaReativar = null;
        var managerByCpf = managerRepository.findByCpf(cpf);
        if (managerByCpf.isPresent()) {
            Manager existingManager = managerByCpf.get();
            if (isAtivo(existingManager)) {
                throw new ConflictException("CPF já cadastrado");
            }
            managerInativoParaReativar = existingManager;
        }

        ensureManagerEmailDisponivel(email, managerInativoParaReativar);
        ensureUsuarioCpfDisponivel(cpf, managerInativoParaReativar);
        ensureUsuarioEmailDisponivel(email, managerInativoParaReativar);
        ensureSetorDisponivelParaEscalista(setor, managerInativoParaReativar);

        LocalDateTime now = LocalDateTime.now();
        if (managerInativoParaReativar != null) {
            return reactivateManager(managerInativoParaReativar, managerToCreate, setor, hospitalLogado, now);
        }

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
        managerToCreate.setSetor(setor);
        managerToCreate.setCriadoEm(now);
        managerToCreate.setAtualizadoEm(now);

        Manager managerCreated = managerRepository.save(managerToCreate);
        createOrReactivateVinculo(managerCreated, setor, hospitalLogado.getUsuario(), now);

        return managerCreated;
    }

    private Manager reactivateManager(Manager manager, Manager managerToCreate, Setor setor, Hospital hospitalLogado,
            LocalDateTime now) {
        Usuario usuario = manager.getUsuario();
        String senhaHash = passwordEncoder.encode(managerToCreate.getPassword());

        if (usuario == null) {
            usuario = new Usuario(
                    managerToCreate.getName(),
                    managerToCreate.getEmail(),
                    senhaHash,
                    managerToCreate.getCpf(),
                    managerToCreate.getBirthday(),
                    null,
                    UserRole.ESCALISTA);
            usuario.setCriadoEm(now);
        } else {
            usuario.setNome(managerToCreate.getName());
            usuario.setEmail(managerToCreate.getEmail());
            usuario.setCpf(managerToCreate.getCpf());
            usuario.setDataNascimento(managerToCreate.getBirthday());
            usuario.setSenhaHash(senhaHash);
            usuario.setRole(UserRole.ESCALISTA);
        }

        usuario.setAtivo(true);
        usuario.setAtualizadoEm(now);

        manager.setUsuario(usuarioRepository.save(usuario));
        manager.setName(managerToCreate.getName());
        manager.setEmail(managerToCreate.getEmail());
        manager.setCpf(managerToCreate.getCpf());
        manager.setBirthday(managerToCreate.getBirthday());
        manager.setDepartment(managerToCreate.getDepartment());
        manager.setRole(UserRole.ESCALISTA);
        manager.setPassword(senhaHash);
        manager.setAtivo(true);
        manager.setSetor(setor);
        if (manager.getCriadoEm() == null) {
            manager.setCriadoEm(now);
        }
        manager.setAtualizadoEm(now);

        Manager managerReativado = managerRepository.save(manager);
        assignSingleSetor(managerReativado, setor, hospitalLogado.getUsuario(), now);

        return managerReativado;
    }

    public List<EscalistaSetor> findSetoresVinculados(Long managerId, Hospital hospitalLogado) {
        Manager manager = findById(managerId, hospitalLogado);

        if (manager.getSetor() != null && manager.getSetor().getHospital() != null
                && manager.getSetor().getHospital().getId().equals(hospitalLogado.getId())) {
            return List.of(assignSingleSetor(manager, manager.getSetor(), hospitalLogado.getUsuario(), LocalDateTime.now()));
        }
        return List.of();
    }

    public EscalistaSetor vincularSetor(Long managerId, Long setorId, Hospital hospitalLogado, Usuario usuarioLogado) {
        Manager manager = findById(managerId, hospitalLogado);
        Setor setor = findSetorDoHospital(setorId, hospitalLogado);
        return assignSingleSetor(manager, setor, usuarioLogado, LocalDateTime.now());
    }

    public void desvincularSetor(Long managerId, Long setorId, Hospital hospitalLogado) {
        Manager manager = findById(managerId, hospitalLogado);
        Setor setor = findSetorDoHospital(setorId, hospitalLogado);

        if (isCanonicalSetor(manager, setor)) {
            throw new IllegalArgumentException("Escalista deve permanecer vinculado a um setor. Para trocar, vincule-o a outro setor.");
        }

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
    }

    public void delete(Long id) {
        Manager manager = managerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Escalista não encontrado"));
        LocalDateTime now = LocalDateTime.now();

        escalistaSetorRepository.findByEscalistaIdAndAtivoTrue(manager.getId())
                .forEach(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(now);
                    escalistaSetorRepository.save(vinculo);
                });

        manager.setAtivo(false);
        manager.setSetor(null);
        manager.setAtualizadoEm(now);

        if (manager.getUsuario() != null) {
            manager.getUsuario().setAtivo(false);
            manager.getUsuario().setAtualizadoEm(now);
            usuarioRepository.save(manager.getUsuario());
        }

        managerRepository.save(manager);
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
            assignSingleSetor(manager, setor, setor.getHospital() != null ? setor.getHospital().getUsuario() : null,
                    LocalDateTime.now());
        }

        manager.setAtualizadoEm(LocalDateTime.now());
        if (manager.getUsuario() != null) {
            manager.getUsuario().setAtualizadoEm(LocalDateTime.now());
            usuarioRepository.save(manager.getUsuario());
        }

        return managerRepository.save(manager);
    }

    private EscalistaSetor assignSingleSetor(Manager manager, Setor setor, Usuario usuarioLogado, LocalDateTime now) {
        ensureSetorDisponivelParaEscalista(setor, manager);
        deactivateOtherActiveVinculos(manager.getId(), setor.getId(), now);
        deactivateOtherActiveVinculosForSetor(manager.getId(), setor.getId(), now);
        EscalistaSetor vinculo = createOrReactivateVinculo(manager, setor, usuarioLogado, now);

        if (!isCanonicalSetor(manager, setor)) {
            manager.setSetor(setor);
        }
        manager.setAtualizadoEm(now);
        managerRepository.save(manager);

        return vinculo;
    }

    private void deactivateOtherActiveVinculos(Long managerId, Long setorId, LocalDateTime now) {
        escalistaSetorRepository.findByEscalistaIdAndAtivoTrue(managerId).stream()
                .filter(vinculo -> vinculo.getSetor() == null
                        || vinculo.getSetor().getId() == null
                        || !vinculo.getSetor().getId().equals(setorId))
                .forEach(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(now);
                    escalistaSetorRepository.save(vinculo);
                });
    }

    private void deactivateOtherActiveVinculosForSetor(Long managerId, Long setorId, LocalDateTime now) {
        escalistaSetorRepository.findBySetorIdAndAtivoTrue(setorId).stream()
                .filter(vinculo -> vinculo.getEscalista() == null
                        || vinculo.getEscalista().getId() == null
                        || !vinculo.getEscalista().getId().equals(managerId))
                .forEach(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(now);
                    escalistaSetorRepository.save(vinculo);
                });
    }

    private void ensureSetorDisponivelParaEscalista(Setor setor, Manager manager) {
        Long managerId = manager != null ? manager.getId() : null;
        boolean ocupadoPorOutroEscalista = managerRepository.findAllBySetorId(setor.getId()).stream()
                .filter(this::isAtivo)
                .anyMatch(existing -> existing.getId() != null && !existing.getId().equals(managerId));

        if (ocupadoPorOutroEscalista) {
            throw new ConflictException("Setor já possui um escalista responsável");
        }
    }

    private void ensureManagerEmailDisponivel(String email, Manager managerParaReativar) {
        managerRepository.findByEmail(email).ifPresent(existing -> {
            if (!isSameManager(existing, managerParaReativar)) {
                throw new ConflictException("Email já cadastrado");
            }
        });
    }

    private void ensureUsuarioCpfDisponivel(String cpf, Manager managerParaReativar) {
        usuarioRepository.findByCpf(cpf).ifPresent(existing -> {
            if (!isSameUsuario(existing, managerParaReativar)) {
                throw new ConflictException("CPF já cadastrado");
            }
        });
    }

    private void ensureUsuarioEmailDisponivel(String email, Manager managerParaReativar) {
        usuarioRepository.findByEmail(email).ifPresent(existing -> {
            if (!isSameUsuario(existing, managerParaReativar)) {
                throw new ConflictException("Email já cadastrado");
            }
        });
    }

    private boolean isSameManager(Manager manager, Manager other) {
        return manager != null && other != null && Objects.equals(manager.getId(), other.getId());
    }

    private boolean isSameUsuario(Usuario usuario, Manager manager) {
        return usuario != null
                && manager != null
                && manager.getUsuario() != null
                && Objects.equals(usuario.getId(), manager.getUsuario().getId());
    }

    private boolean isAtivo(Manager manager) {
        return manager.getAtivo() == null || manager.getAtivo();
    }

    private boolean isAtivo(Setor setor) {
        return setor.getAtivo() == null || setor.getAtivo();
    }

    private EscalistaSetor createOrReactivateVinculo(Manager manager, Setor setor, Usuario usuarioLogado, LocalDateTime now) {
        EscalistaSetor vinculo = escalistaSetorRepository
                .findFirstByEscalistaIdAndSetorIdOrderByIdAsc(manager.getId(), setor.getId())
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

    private boolean isCanonicalSetor(Manager manager, Setor setor) {
        return manager.getSetor() != null && manager.getSetor().getId() != null
                && setor != null && manager.getSetor().getId().equals(setor.getId());
    }
}
