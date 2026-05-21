package com.mss.medShift.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.PedidoCoberturaStatus;

@Repository
public interface PedidoCoberturaRepository extends JpaRepository<PedidoCobertura, Long> {
    Optional<PedidoCobertura> findByPlantaoIdAndStatus(Long plantaoId, PedidoCoberturaStatus status);
    List<PedidoCobertura> findByHospitalIdAndSetorIdAndStatus(Long hospitalId, Long setorId, PedidoCoberturaStatus status);
    List<PedidoCobertura> findByMedicoSolicitanteId(Long medicoId);
    List<PedidoCobertura> findByMedicoCobridorId(Long medicoId);
}
