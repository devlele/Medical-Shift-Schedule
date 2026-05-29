package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.PedidoCoberturaStatus;

@Repository
public interface PedidoCoberturaRepository extends JpaRepository<PedidoCobertura, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select pedido from PedidoCobertura pedido where pedido.id = :id")
    Optional<PedidoCobertura> findByIdForUpdate(@Param("id") Long id);

    Optional<PedidoCobertura> findByPlantaoIdAndStatus(Long plantaoId, PedidoCoberturaStatus status);
    Optional<PedidoCobertura> findByPlantaoMedicoIdAndStatus(Long plantaoMedicoId, PedidoCoberturaStatus status);
    List<PedidoCobertura> findByHospitalIdAndSetorIdAndStatus(Long hospitalId, Long setorId, PedidoCoberturaStatus status);
    List<PedidoCobertura> findByMedicoSolicitanteId(Long medicoId);
    List<PedidoCobertura> findByMedicoSolicitanteIdOrderByAbertoEmDesc(Long medicoId);
    List<PedidoCobertura> findByMedicoCobridorId(Long medicoId);
    List<PedidoCobertura> findBySetorIdInAndStatusOrderByAbertoEmDesc(List<Long> setorIds, PedidoCoberturaStatus status);
}
