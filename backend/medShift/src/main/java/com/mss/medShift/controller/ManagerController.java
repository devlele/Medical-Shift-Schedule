package com.mss.medShift.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    @PostMapping
    public ResponseEntity<Manager> create(@RequestBody Manager managerToCreate) {
        var managerCreated = managerService.create(managerToCreate);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(managerToCreate.getId())
                        .toUri();

        return ResponseEntity.created(location).body(managerCreated);
    }
}
