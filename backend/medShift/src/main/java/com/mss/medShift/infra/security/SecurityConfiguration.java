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

                        // Doctor endpoints - only DOCTOR role for their own data
                        .requestMatchers(HttpMethod.GET, "/doctor/me").hasRole("DOCTOR")
                        
                        // Admin-only lookups documented as administrative endpoints.
                        .requestMatchers(HttpMethod.GET, "/hospital").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/doctor/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/setor/hospital/**").hasRole("ADMIN")
                        
                        // Hospital-scoped endpoints.
                        .requestMatchers(HttpMethod.POST, "/setor").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/setor").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/setor/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.PUT, "/setor/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/manager").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/manager/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/manager").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/manager/**").hasRole("HOSPITAL")

                        // Manager endpoints - MANAGER, HOSPITAL or ADMIN role
                        .requestMatchers(HttpMethod.GET, "/doctor").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/doctor/**").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        
                        // Admin only
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
                        
                        // Authenticated users
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.setStatus(HttpStatus.FORBIDDEN.value())))
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
