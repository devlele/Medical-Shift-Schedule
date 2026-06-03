package com.mss.medShift.service.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mss.medShift.domain.model.Usuario;
import com.mss.medShift.domain.repository.UsuarioRepository;

@Service
public class PasswordRecoveryServiceImpl implements PasswordRecoveryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordRecoveryServiceImpl.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%".toCharArray();

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final boolean mailEnabled;
    private final String from;
    private final String smtpUsername;
    private final String smtpPassword;

    public PasswordRecoveryServiceImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:true}") boolean mailEnabled,
            @Value("${app.mail.from:${spring.mail.username:}}") String from,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${spring.mail.password:}") String smtpPassword) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.mailEnabled = mailEnabled;
        this.from = from;
        this.smtpUsername = smtpUsername;
        this.smtpPassword = smtpPassword;
    }

    @Override
    @Transactional
    public void recoverPassword(String email) {
        String normalizedEmail = normalizeEmail(email);
        Usuario usuario = usuarioRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado para este e-mail"));

        String temporaryPassword = generateTemporaryPassword();
        usuario.setSenhaHash(passwordEncoder.encode(temporaryPassword));
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        sendTemporaryPassword(usuario, temporaryPassword);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }
        return email.trim().toLowerCase();
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            password.append(PASSWORD_CHARS[RANDOM.nextInt(PASSWORD_CHARS.length)]);
        }
        return password.toString();
    }

    private void sendTemporaryPassword(Usuario usuario, String temporaryPassword) {
        if (!mailEnabled) {
            LOGGER.info("Senha temporária gerada para {}: {}", usuario.getEmail(), temporaryPassword);
            return;
        }

        validateMailConfiguration();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from.isBlank() ? smtpUsername : from);
        message.setTo(usuario.getEmail());
        message.setSubject("Recuperação de senha - Medical Shift Schedule");
        message.setText("""
                Olá, %s.

                Uma nova senha temporária foi gerada para sua conta:

                %s

                Use esta senha para acessar o sistema e altere-a assim que possível.
                """.formatted(usuario.getNome() != null ? usuario.getNome() : "usuário", temporaryPassword));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            LOGGER.error("Falha ao enviar e-mail de recuperação de senha para {}", usuario.getEmail(), exception);
            throw exception;
        }
    }

    private void validateMailConfiguration() {
        if (smtpUsername == null || smtpUsername.isBlank()) {
            throw new IllegalArgumentException("SPRING_MAIL_USERNAME deve ser configurado para envio real de e-mail");
        }
        if (smtpPassword == null || smtpPassword.isBlank()) {
            throw new IllegalArgumentException("SPRING_MAIL_PASSWORD deve ser configurado para envio real de e-mail");
        }
        if (from == null || from.isBlank()) {
            throw new IllegalArgumentException("APP_MAIL_FROM ou SPRING_MAIL_USERNAME deve ser configurado para envio real de e-mail");
        }
    }
}
