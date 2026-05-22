package com.mss.medShift.service.auth;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Usuario;

import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(UserDetails userDetails) {
        JwtBuilder builder = Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuer("MedShift API")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(generateExpirationDate()));

        if (userDetails instanceof Usuario usuario) {
            builder.claim("userId", usuario.getId());
            if (usuario.getRole() != null) {
                builder.claim("role", usuario.getRole().name());
            }
        }

        return builder.signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256).compact();
    }

    public String getSubject(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
