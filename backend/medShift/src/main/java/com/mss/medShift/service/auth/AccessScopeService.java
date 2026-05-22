package com.mss.medShift.service.auth;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.UserRole;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.repository.MedicoSetorRepository;
import com.mss.medShift.service.DoctorService;
import com.mss.medShift.service.HospitalService;
import com.mss.medShift.service.ManagerService;
import com.mss.medShift.service.SetorService;

@Service
public class AccessScopeService {

    private final DoctorService doctorService;
    private final HospitalService hospitalService;
    private final ManagerService managerService;
    private final SetorService setorService;
    private final MedicoSetorRepository medicoSetorRepository;

    public AccessScopeService(DoctorService doctorService, HospitalService hospitalService,
            ManagerService managerService, SetorService setorService,
            MedicoSetorRepository medicoSetorRepository) {
        this.doctorService = doctorService;
        this.hospitalService = hospitalService;
        this.managerService = managerService;
        this.setorService = setorService;
        this.medicoSetorRepository = medicoSetorRepository;
    }

    public boolean isAdmin(Usuario usuario) {
        return hasRole(usuario, UserRole.ADMIN);
    }

    public boolean isHospital(Usuario usuario) {
        return hasRole(usuario, UserRole.HOSPITAL);
    }

    public boolean isEscalista(Usuario usuario) {
        return hasRole(usuario, UserRole.ESCALISTA) || hasRole(usuario, UserRole.MANAGER);
    }

    public boolean isMedico(Usuario usuario) {
        return hasRole(usuario, UserRole.MEDICO) || hasRole(usuario, UserRole.DOCTOR);
    }

    public Hospital requireHospitalProfile(Usuario usuario) {
        if (!isHospital(usuario)) {
            throw new AccessDeniedException("Usuário não possui perfil de hospital");
        }
        return hospitalService.findByUsuarioId(usuario.getId());
    }

    public Manager requireEscalistaProfile(Usuario usuario) {
        if (!isEscalista(usuario)) {
            throw new AccessDeniedException("Usuário não possui perfil de escalista");
        }
        return managerService.findByUsuarioId(usuario.getId());
    }

    public Doctor requireMedicoProfile(Usuario usuario) {
        if (!isMedico(usuario)) {
            throw new AccessDeniedException("Usuário não possui perfil de médico");
        }
        return doctorService.findByUsuarioId(usuario.getId());
    }

    public Hospital requireSameHospital(Usuario usuario, Long hospitalId) {
        Hospital hospital = requireHospitalProfile(usuario);
        if (!hospital.getId().equals(hospitalId)) {
            throw new AccessDeniedException("Hospital fora do escopo do usuário logado");
        }
        return hospital;
    }

    public Setor requireSetorOfAuthenticatedHospital(Usuario usuario, Long setorId) {
        Hospital hospital = requireHospitalProfile(usuario);
        return setorService.findById(setorId, hospital);
    }

    public Manager requireEscalistaInHospital(Usuario usuario, Long hospitalId) {
        List<Long> setorIds = resolveEscalistaSetorIdsInHospital(usuario, hospitalId);
        if (setorIds.isEmpty()) {
            throw new AccessDeniedException("Escalista fora do escopo do hospital");
        }
        return requireEscalistaProfile(usuario);
    }

    public Manager requireEscalistaInSetor(Usuario usuario, Long setorId) {
        Manager escalista = requireEscalistaProfile(usuario);
        if (!canEscalistaAccessSetor(escalista, setorId)) {
            throw new AccessDeniedException("Setor fora do escopo do escalista");
        }
        return escalista;
    }

    public Manager requireEscalistaWithSetor(Usuario usuario) {
        Manager escalista = requireEscalistaProfile(usuario);
        if (escalista.getHospital() == null || escalista.getSetor() == null) {
            throw new AccessDeniedException("Escalista sem hospital ou setor vinculado");
        }
        return escalista;
    }

    public List<Long> resolveEscalistaSetorIds(Usuario usuario) {
        Manager escalista = requireEscalistaProfile(usuario);

        if (escalista.getSetor() != null && escalista.getSetor().getId() != null) {
            return List.of(escalista.getSetor().getId());
        }
        throw new AccessDeniedException("Escalista sem setor vinculado");
    }

    public List<Long> resolveEscalistaSetorIdsInHospital(Usuario usuario, Long hospitalId) {
        return resolveEscalistaSetorIds(usuario).stream()
                .filter(setorId -> setorBelongsToHospital(setorId, hospitalId))
                .toList();
    }

    public void requireEscalistaCanAccessDoctor(Usuario usuario, Doctor doctor) {
        List<Long> setorIds = resolveEscalistaSetorIds(usuario);
        boolean legacySetorAllowed = doctor.getSetor() != null
                && doctor.getSetor().getId() != null
                && setorIds.contains(doctor.getSetor().getId());

        boolean linkedSetorAllowed = medicoSetorRepository.findByMedicoIdAndAtivoTrue(doctor.getId()).stream()
                .anyMatch(vinculo -> vinculo.getSetor() != null && setorIds.contains(vinculo.getSetor().getId()));

        if (!legacySetorAllowed && !linkedSetorAllowed) {
            throw new AccessDeniedException("Médico fora do escopo do escalista");
        }
    }

    public void requireEscalistaCanAccessSetor(Usuario usuario, Long setorId) {
        if (!resolveEscalistaSetorIds(usuario).contains(setorId)) {
            throw new AccessDeniedException("Setor fora do escopo do escalista");
        }
    }

    public Long resolveProfileId(Usuario usuario) {
        if (isMedico(usuario)) {
            return requireMedicoProfile(usuario).getId();
        }
        if (isHospital(usuario)) {
            return requireHospitalProfile(usuario).getId();
        }
        if (isEscalista(usuario)) {
            return requireEscalistaProfile(usuario).getId();
        }
        return usuario.getId();
    }

    public String resolveProfileName(Usuario usuario) {
        if (isMedico(usuario)) {
            return requireMedicoProfile(usuario).getName();
        }
        if (isHospital(usuario)) {
            return requireHospitalProfile(usuario).getNomeFantasia();
        }
        if (isEscalista(usuario)) {
            return requireEscalistaProfile(usuario).getName();
        }
        return usuario.getNome() != null ? usuario.getNome() : usuario.getUsername();
    }

    private boolean hasRole(Usuario usuario, UserRole role) {
        return usuario != null && usuario.getRole() == role;
    }

    private boolean canEscalistaAccessSetor(Manager escalista, Long setorId) {
        if (setorId == null) {
            return false;
        }
        if (escalista.getSetor() != null && escalista.getSetor().getId() != null) {
            return setorId.equals(escalista.getSetor().getId());
        }
        return false;
    }

    private boolean setorBelongsToHospital(Long setorId, Long hospitalId) {
        if (setorId == null || hospitalId == null) {
            return false;
        }
        Setor setor = setorService.findById(setorId);
        return setor.getHospital() != null && hospitalId.equals(setor.getHospital().getId());
    }
}
