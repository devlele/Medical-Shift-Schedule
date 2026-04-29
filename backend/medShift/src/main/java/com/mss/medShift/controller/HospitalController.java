package com.mss.medShift.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.service.HospitalService;

@RestController
@RequestMapping("/hospital")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public ResponseEntity<Hospital> create(@RequestBody Hospital hospitalToCreate) {
        var hospitalCreated = hospitalService.create(hospitalToCreate);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(hospitalCreated.getId())
                        .toUri();

        return ResponseEntity.created(location).body(hospitalCreated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospital(@PathVariable Long id) {
        try {
            var hospital = hospitalService.findById(id);
            return ResponseEntity.ok(hospital);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        var hospitals = hospitalService.findAll();
        return ResponseEntity.ok(hospitals);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> update(@PathVariable Long id, @RequestBody Hospital hospital) {
        try {
            var hospitalUpdated = hospitalService.update(id, hospital);
            return ResponseEntity.ok(hospitalUpdated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            hospitalService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}