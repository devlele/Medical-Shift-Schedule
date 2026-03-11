package com.mss.medShift.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Habilita a configuração de segurança web 
// e delegua a configuração para as classes que estendem WebSecurityConfigurerAdapter
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
       return  httpSecurity
               .csrf(csrf  -> csrf.disable()) // Desabilita a proteção CSRF para facilitar o desenvolvimento
               .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Configura a política de criação de sessão para stateless, ou seja, sem estado      
               .build(); // Constrói a cadeia de filtros de segurança   
    }
}
