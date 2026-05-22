package com.mss.medShift.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/hospital").permitAll()
                        .requestMatchers(HttpMethod.POST, "/doctor/register").permitAll()

                        // Doctor endpoints - only DOCTOR role for their own data
                        .requestMatchers(HttpMethod.GET, "/doctor/me").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.GET, "/doctor/me/**").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.POST, "/doctor/me/**").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.PUT, "/doctor/me/**").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.GET, "/agenda/me").hasAnyRole("DOCTOR", "MEDICO", "HOSPITAL", "ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/agenda/doctor/me").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.GET, "/agenda/doctor/me/**").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.GET, "/agenda/setor/**").hasAnyRole("HOSPITAL", "ESCALISTA", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/agenda/hospital/**").hasAnyRole("HOSPITAL", "ESCALISTA", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/coberturas").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.GET, "/coberturas/disponiveis").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.GET, "/coberturas/me").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.POST, "/coberturas/{id}/assumir").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.POST, "/coberturas/{id}/cancelar").hasAnyRole("DOCTOR", "MEDICO")
                        .requestMatchers(HttpMethod.GET, "/notificacoes/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/notificacoes/{id}/lida").authenticated()
                        
                        // Admin-only lookups documented as administrative endpoints.
                        .requestMatchers(HttpMethod.GET, "/hospital").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/setor/hospital/**").hasRole("ADMIN")
                        
                        // Hospital-scoped endpoints.
                        .requestMatchers(HttpMethod.POST, "/setor").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/setor").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/setor/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.PUT, "/setor/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/manager/me/setores").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/manager").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/manager/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/manager/{id}/setores").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/manager").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/manager/**").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.PUT, "/manager/{id}").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.DELETE, "/manager/{id}/setores/{setorId}").hasRole("HOSPITAL")

                        // Manager endpoints - MANAGER, HOSPITAL or ADMIN role
                        .requestMatchers(HttpMethod.GET, "/doctor").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/doctor/link-candidates").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/doctor/{id}/setores").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/doctor/{id}/setores/{setorId}").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/doctor/{id}/setores/{setorId}").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/doctor/{id}").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/doctor/**").hasAnyRole("MANAGER", "HOSPITAL", "ADMIN")

                        // Shift scheduling is scoped to escalistas.
                        .requestMatchers(HttpMethod.POST, "/plantao").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/plantao/avulso").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/plantao/fixo").hasAnyRole("ESCALISTA", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/plantao/{id}").hasAnyRole("ESCALISTA", "MANAGER")
                        
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
