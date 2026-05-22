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

import com.mss.medShift.controller.dto.HospitalResponse;
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
    public ResponseEntity<HospitalResponse> create(@RequestBody Hospital hospitalToCreate) {
        var hospitalCreated = hospitalService.create(hospitalToCreate);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(hospitalCreated.getId())
                        .toUri();

        return ResponseEntity.created(location).body(HospitalResponse.from(hospitalCreated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getHospital(@PathVariable Long id) {
        var hospital = hospitalService.findById(id);
        return ResponseEntity.ok(HospitalResponse.from(hospital));
    }

    @GetMapping
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() {
        var hospitals = hospitalService.findAll();
        return ResponseEntity.ok(hospitals.stream()
                .map(HospitalResponse::from)
                .toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospitalResponse> update(@PathVariable Long id, @RequestBody Hospital hospital) {
        var hospitalUpdated = hospitalService.update(id, hospital);
        return ResponseEntity.ok(HospitalResponse.from(hospitalUpdated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hospitalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
