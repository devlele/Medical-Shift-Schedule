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

@Table(name = "tb_pedido_cobertura")
@Entity
public class PedidoCobertura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Plantao plantao;

    @ManyToOne
    private Hospital hospital;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private Doctor medicoSolicitante;

    @ManyToOne
    private Doctor medicoCobridor;

    @Enumerated(EnumType.STRING)
    private PedidoCoberturaStatus status = PedidoCoberturaStatus.ABERTO;

    private String motivo;
    private LocalDateTime abertoEm;
    private LocalDateTime assumidoEm;
    private LocalDateTime canceladoEm;
    private LocalDateTime expiradoEm;
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "pedidoCobertura")
    @JsonIgnore
    private List<Notificacao> notificacoes;

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
        if (plantao != null) {
            this.hospital = plantao.getHospital();
            this.setor = plantao.getSetor();
        }
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

    public Doctor getMedicoSolicitante() {
        return medicoSolicitante;
    }

    public void setMedicoSolicitante(Doctor medicoSolicitante) {
        this.medicoSolicitante = medicoSolicitante;
    }

    public Doctor getMedicoCobridor() {
        return medicoCobridor;
    }

    public void setMedicoCobridor(Doctor medicoCobridor) {
        this.medicoCobridor = medicoCobridor;
    }

    public PedidoCoberturaStatus getStatus() {
        return status;
    }

    public void setStatus(PedidoCoberturaStatus status) {
        this.status = status;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDateTime getAbertoEm() {
        return abertoEm;
    }

    public void setAbertoEm(LocalDateTime abertoEm) {
        this.abertoEm = abertoEm;
    }

    public LocalDateTime getAssumidoEm() {
        return assumidoEm;
    }

    public void setAssumidoEm(LocalDateTime assumidoEm) {
        this.assumidoEm = assumidoEm;
    }

    public LocalDateTime getCanceladoEm() {
        return canceladoEm;
    }

    public void setCanceladoEm(LocalDateTime canceladoEm) {
        this.canceladoEm = canceladoEm;
    }

    public LocalDateTime getExpiradoEm() {
        return expiradoEm;
    }

    public void setExpiradoEm(LocalDateTime expiradoEm) {
        this.expiradoEm = expiradoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public List<Notificacao> getNotificacoes() {
        return notificacoes;
    }

    public void setNotificacoes(List<Notificacao> notificacoes) {
        this.notificacoes = notificacoes;
    }

    public boolean isAberto() {
        return PedidoCoberturaStatus.ABERTO.equals(status);
    }
}
