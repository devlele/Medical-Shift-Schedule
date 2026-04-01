package com.mss.medShift.service.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mss.medShift.service.DoctorService;
import com.mss.medShift.service.ManagerService;

@Service
public class AuthorizationService implements UserDetailsService {

    private final DoctorService doctorService;
    private final ManagerService managerService;

    public AuthorizationService(DoctorService doctorService, ManagerService managerService) {
        this.doctorService = doctorService;
        this.managerService = managerService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails user = doctorService.findByEmail(username);
        if (user == null) {
            user = managerService.findByEmail(username);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
        return user;
    }
}
