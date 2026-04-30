package com.mss.medShift.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.service.ManagerService;

@RestController
@RequestMapping("/manager")
public class ManagerController {
    private ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manager> getManager(@PathVariable Long id) {
       try {
            var manager = managerService.findById(id);
            return ResponseEntity.ok(manager);
       } catch (Exception e) {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping
    public ResponseEntity<List<Manager>> getManagersDoHospitalLogado(@AuthenticationPrincipal Hospital hospitalLogado) {
        var managers = managerService.findByHospitalId(hospitalLogado.getId());
        return ResponseEntity.ok(managers);
    }

    @PostMapping
    public ResponseEntity<Manager> create(@RequestBody Manager managerToCreate,
            @AuthenticationPrincipal Hospital hospitalLogado) {
        var managerCreated = managerService.create(managerToCreate, hospitalLogado);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(managerCreated.getId())
                        .toUri();

        return ResponseEntity.created(location).body(managerCreated);
    }
}
