package com.mss.medShift.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mss.medShift.controller.dto.AuthUserResponse;
import com.mss.medShift.service.auth.PasswordRecoveryService;
import com.mss.medShift.service.auth.TokenService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordRecoveryService passwordRecoveryService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService,
            PasswordRecoveryService passwordRecoveryService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.passwordRecoveryService = passwordRecoveryService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                loginRequest.email(), loginRequest.password());

        Authentication auth = authenticationManager.authenticate(usernamePassword);
        UserDetails user = (UserDetails) auth.getPrincipal();

        String token = tokenService.generateToken(user);

        return ResponseEntity.ok(new LoginResponse(token, AuthUserResponse.from(user)));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<PasswordRecoveryResponse> recoverPassword(@RequestParam String email) {
        passwordRecoveryService.recoverPassword(email);
        return ResponseEntity.ok(new PasswordRecoveryResponse(
                "Uma nova senha foi gerada e enviada para o e-mail informado."));
    }

    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String token, AuthUserResponse user) {}
    public record PasswordRecoveryResponse(String message) {}
}
