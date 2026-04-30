package com.mss.medShift.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.service.DoctorService;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
    private DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long id) {
       try {
            var doctor = doctorService.findById(id);
            return ResponseEntity.ok(doctor);
       } catch (Exception e) {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyProfile(@AuthenticationPrincipal Doctor doctorLogado) {
        return ResponseEntity.ok(doctorLogado);
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
}
