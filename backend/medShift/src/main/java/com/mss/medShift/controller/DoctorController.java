package com.mss.medShift.controller;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.controller.dto.DoctorProfileResponse;
import com.mss.medShift.controller.dto.MedicoSetorResponse;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.service.DoctorService;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.auth.AccessScopeService;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
    private final DoctorService doctorService;
    private final PlantaoService plantaoService;
    private final AccessScopeService accessScopeService;

    public DoctorController(DoctorService doctorService, PlantaoService plantaoService,
            AccessScopeService accessScopeService) {
        this.doctorService = doctorService;
        this.plantaoService = plantaoService;
        this.accessScopeService = accessScopeService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(@AuthenticationPrincipal Usuario user) {
        try {
            var doctors = findDoctorsForUser(user);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long id, @AuthenticationPrincipal Usuario user) {
       try {
            var doctor = findDoctorForUser(id, user);
            return ResponseEntity.ok(doctor);
       } catch (Exception e) {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyProfile(@AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor doctorLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        return ResponseEntity.ok(doctorLogado);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<DoctorProfileResponse> getMyCompleteProfile(@AuthenticationPrincipal Usuario usuarioLogado) {
        Doctor doctorLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
        List<PlantaoSummaryResponse> historico = plantaoService.findByDoctorId(doctorLogado.getId()).stream()
                .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .map(PlantaoSummaryResponse::from)
                .toList();

        return ResponseEntity.ok(DoctorProfileResponse.from(doctorLogado, historico));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<DoctorProfileResponse> updateMyCompleteProfile(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody Doctor doctor) {
        try {
            Doctor doctorLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
            var doctorAtualizado = doctorService.update(doctorLogado.getId(), doctor);
            List<PlantaoSummaryResponse> historico = plantaoService.findByDoctorId(doctorAtualizado.getId()).stream()
                    .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .limit(5)
                    .map(PlantaoSummaryResponse::from)
                    .toList();

            return ResponseEntity.ok(DoctorProfileResponse.from(doctorAtualizado, historico));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/me/profile-photo")
    public ResponseEntity<DoctorProfileResponse> uploadMyProfilePhoto(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Doctor doctorLogado = accessScopeService.requireMedicoProfile(usuarioLogado);
            String extension = getSafeExtension(file.getOriginalFilename());
            Path uploadDir = Path.of("uploads", "profile-photos");
            Files.createDirectories(uploadDir);

            String filename = "doctor-" + doctorLogado.getId() + "-" + System.currentTimeMillis() + extension;
            Path destination = uploadDir.resolve(filename);
            file.transferTo(destination);

            Doctor update = new Doctor();
            update.setFotoPerfilUrl("/uploads/profile-photos/" + filename);
            var doctorAtualizado = doctorService.update(doctorLogado.getId(), update);

            List<PlantaoSummaryResponse> historico = plantaoService.findByDoctorId(doctorAtualizado.getId()).stream()
                    .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .limit(5)
                    .map(PlantaoSummaryResponse::from)
                    .toList();

            return ResponseEntity.ok(DoctorProfileResponse.from(doctorAtualizado, historico));
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String getSafeExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ".jpg";
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase(Locale.ROOT);
        return switch (extension) {
            case ".jpg", ".jpeg", ".png", ".webp" -> extension;
            default -> ".jpg";
        };
    }

    @PostMapping("/register")
    public ResponseEntity<Doctor> create(@RequestBody Doctor doctorToCreate) {
        var doctorCreated = doctorService.create(doctorToCreate);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(doctorToCreate.getId())
                        .toUri();

        return ResponseEntity.created(location).body(doctorCreated);
    }

    @GetMapping("/{id}/setores")
    public ResponseEntity<List<MedicoSetorResponse>> getSetoresVinculados(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Manager escalistaLogado = accessScopeService.requireEscalistaProfile(usuarioLogado);
            var setorIdsPermitidos = accessScopeService.resolveEscalistaSetorIds(usuarioLogado);
            var vinculos = doctorService.findSetoresVinculados(id, escalistaLogado, setorIdsPermitidos).stream()
                    .map(MedicoSetorResponse::from)
                    .toList();
            return ResponseEntity.ok(vinculos);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/setores/{setorId}")
    public ResponseEntity<MedicoSetorResponse> vincularSetor(@PathVariable Long id,
            @PathVariable Long setorId,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Manager escalistaLogado = accessScopeService.requireEscalistaInSetor(usuarioLogado, setorId);
            var vinculo = doctorService.vincularSetor(id, setorId, escalistaLogado);
            return ResponseEntity.ok(MedicoSetorResponse.from(vinculo));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/setores/{setorId}")
    public ResponseEntity<Void> desvincularSetor(@PathVariable Long id,
            @PathVariable Long setorId,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            Manager escalistaLogado = accessScopeService.requireEscalistaInSetor(usuarioLogado, setorId);
            doctorService.desvincularSetor(id, setorId, escalistaLogado);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            var doctorAtualizado = doctorService.update(id, doctor);
            return ResponseEntity.ok(doctorAtualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            doctorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private List<Doctor> findDoctorsForUser(Usuario user) {
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireHospitalProfile(user);
            return doctorService.findByHospitalId(hospital.getId());
        }
        if (accessScopeService.isEscalista(user)) {
            Manager manager = accessScopeService.requireEscalistaProfile(user);
            if (manager.getHospital() == null) {
                return List.of();
            }
            return accessScopeService.resolveEscalistaSetorIds(user).stream()
                    .flatMap(setorId -> doctorService.findByHospitalIdAndSetorId(manager.getHospital().getId(), setorId).stream())
                    .toList();
        }
        return doctorService.findAll();
    }

    private Doctor findDoctorForUser(Long id, Usuario user) {
        if (accessScopeService.isHospital(user)) {
            Hospital hospital = accessScopeService.requireHospitalProfile(user);
            return doctorService.findByIdAndHospitalId(id, hospital.getId());
        }
        if (accessScopeService.isEscalista(user)) {
            Doctor doctor = doctorService.findById(id);
            accessScopeService.requireEscalistaCanAccessDoctor(user, doctor);
            return doctor;
        }
        return doctorService.findById(id);
    }
}
