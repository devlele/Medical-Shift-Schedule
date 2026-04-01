package com.mss.medShift.service;

import org.springframework.beans.factory.BeanRegistrarDslMarker;
import org.springframework.security.core.userdetails.UserDetails;
import com.mss.medShift.domain.model.Manager;

public interface ManagerService {
    Manager findById(Long id);
    Manager create(Manager managerToCreate);
    UserDetails findByEmail(String email);
    void delete(Long id);
}
