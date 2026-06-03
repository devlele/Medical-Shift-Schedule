package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.Notificacao;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByUsuarioDestinoIdOrderByCriadoEmDesc(Long usuarioId);
    List<Notificacao> findByUsuarioDestinoIdAndLidaEmIsNullOrderByCriadoEmDesc(Long usuarioId);
    Optional<Notificacao> findByIdAndUsuarioDestinoId(Long id, Long usuarioId);

    @Modifying
    @Query("delete from Notificacao notificacao where notificacao.plantao.id = :plantaoId")
    void deleteByPlantaoId(@Param("plantaoId") Long plantaoId);

    @Modifying
    @Query("""
            delete from Notificacao notificacao
            where notificacao.pedidoCobertura.id in (
                select pedido.id
                from PedidoCobertura pedido
                where pedido.plantao.id = :plantaoId
            )
            """)
    void deleteByPedidoCoberturaPlantaoId(@Param("plantaoId") Long plantaoId);
}
