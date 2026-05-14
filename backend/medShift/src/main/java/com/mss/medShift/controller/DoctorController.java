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
import org.springframework.security.core.userdetails.UserDetails;
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
import com.mss.medShift.controller.dto.DoctorProfileResponse;
import com.mss.medShift.controller.dto.PlantaoSummaryResponse;
import com.mss.medShift.service.DoctorService;
import com.mss.medShift.service.PlantaoService;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
    private DoctorService doctorService;
    private PlantaoService plantaoService;

    public DoctorController(DoctorService doctorService, PlantaoService plantaoService) {
        this.doctorService = doctorService;
        this.plantaoService = plantaoService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(@AuthenticationPrincipal UserDetails user) {
        try {
            var doctors = findDoctorsForUser(user);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
       try {
            var doctor = findDoctorForUser(id, user);
            return ResponseEntity.ok(doctor);
       } catch (Exception e) {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyProfile(@AuthenticationPrincipal Doctor doctorLogado) {
        return ResponseEntity.ok(doctorLogado);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<DoctorProfileResponse> getMyCompleteProfile(@AuthenticationPrincipal Doctor doctorLogado) {
        List<PlantaoSummaryResponse> historico = plantaoService.findByDoctorId(doctorLogado.getId()).stream()
                .sorted(Comparator.comparing(Plantao::getDataInicio, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .map(PlantaoSummaryResponse::from)
                .toList();

        return ResponseEntity.ok(DoctorProfileResponse.from(doctorLogado, historico));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<DoctorProfileResponse> updateMyCompleteProfile(
            @AuthenticationPrincipal Doctor doctorLogado,
            @RequestBody Doctor doctor) {
        try {
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
            @AuthenticationPrincipal Doctor doctorLogado,
            @RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
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

    private List<Doctor> findDoctorsForUser(UserDetails user) {
        if (user instanceof Hospital hospital) {
            return doctorService.findByHospitalId(hospital.getId());
        }
        if (user instanceof Manager manager) {
            if (manager.getHospital() == null || manager.getSetor() == null) {
                return List.of();
            }
            return doctorService.findByHospitalIdAndSetorId(manager.getHospital().getId(), manager.getSetor().getId());
        }
        return doctorService.findAll();
    }

    private Doctor findDoctorForUser(Long id, UserDetails user) {
        if (user instanceof Hospital hospital) {
            return doctorService.findByIdAndHospitalId(id, hospital.getId());
        }
        if (user instanceof Manager manager) {
            if (manager.getHospital() == null || manager.getSetor() == null) {
                throw new IllegalArgumentException("Manager sem hospital ou setor");
            }
            return doctorService.findByIdAndHospitalIdAndSetorId(id, manager.getHospital().getId(), manager.getSetor().getId());
        }
        return doctorService.findById(id);
    }
}
