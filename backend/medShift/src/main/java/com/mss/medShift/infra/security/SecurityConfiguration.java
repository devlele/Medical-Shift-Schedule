package com.mss.medShift.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.mss.medShift.service.auth.AuthorizationService;
import com.mss.medShift.service.auth.TokenService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilter securityFilter(TokenService tokenService, AuthorizationService authorizationService) {
        return new SecurityFilter(tokenService, authorizationService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, SecurityFilter securityFilter) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/hospital").permitAll()
                        .requestMatchers(HttpMethod.POST, "/doctor/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/manager").permitAll()
                        
                        // Hospital endpoints - only HOSPITAL role
                        .requestMatchers(HttpMethod.POST, "/setor").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/manager/**").hasRole("HOSPITAL")
                        
                        // Manager endpoints - MANAGER or HOSPITAL role
                        .requestMatchers(HttpMethod.GET, "/doctor").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/doctor/**").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        
                        // Doctor endpoints - only DOCTOR role for their own data
                        .requestMatchers(HttpMethod.GET, "/doctor/me").hasRole("DOCTOR")
                        
                        // Admin only
                        .requestMatchers(HttpMethod.GET, "/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
                        
                        // Authenticated users
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
