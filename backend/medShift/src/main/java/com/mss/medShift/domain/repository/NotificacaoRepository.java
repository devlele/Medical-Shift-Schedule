package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Notificacao;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByUsuarioDestinoIdOrderByCriadoEmDesc(Long usuarioId);
    List<Notificacao> findByUsuarioDestinoIdAndLidaEmIsNullOrderByCriadoEmDesc(Long usuarioId);
    Optional<Notificacao> findByIdAndUsuarioDestinoId(Long id, Long usuarioId);
}
