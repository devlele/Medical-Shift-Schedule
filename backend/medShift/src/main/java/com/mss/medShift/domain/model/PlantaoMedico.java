package com.mss.medShift.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Table(name = "tb_plantao_medico")
@Entity
public class PlantaoMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Plantao plantao;

    @ManyToOne
    private Doctor medicoTitular;

    @ManyToOne
    private Doctor medicoResponsavelAtual;

    @Enumerated(EnumType.STRING)
    private PlantaoStatus status = PlantaoStatus.AGENDADO;

    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "plantaoMedico")
    @JsonIgnore
    private List<PedidoCobertura> pedidosCobertura;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Plantao getPlantao() {
        return plantao;
    }

    public void setPlantao(Plantao plantao) {
        this.plantao = plantao;
    }

    public Doctor getMedicoTitular() {
        return medicoTitular;
    }

    public void setMedicoTitular(Doctor medicoTitular) {
        this.medicoTitular = medicoTitular;
        if (this.medicoResponsavelAtual == null) {
            this.medicoResponsavelAtual = medicoTitular;
        }
    }

    public Doctor getMedicoResponsavelAtual() {
        return medicoResponsavelAtual;
    }

    public void setMedicoResponsavelAtual(Doctor medicoResponsavelAtual) {
        this.medicoResponsavelAtual = medicoResponsavelAtual;
    }

    public PlantaoStatus getStatus() {
        return status;
    }

    public void setStatus(PlantaoStatus status) {
        this.status = status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public List<PedidoCobertura> getPedidosCobertura() {
        return pedidosCobertura;
    }

    public void setPedidosCobertura(List<PedidoCobertura> pedidosCobertura) {
        this.pedidosCobertura = pedidosCobertura;
    }
}
