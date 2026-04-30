package com.mss.medShift.service;

import org.springframework.beans.factory.BeanRegistrarDslMarker;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;

public interface ManagerService {
    Manager findById(Long id);
    List<Manager> findByHospitalId(Long hospitalId);
    Manager create(Manager managerToCreate);
    Manager create(Manager managerToCreate, Hospital hospitalLogado);
    UserDetails findByEmail(String email);
    void delete(Long id);
}
