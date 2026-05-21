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

@Table(name = "tb_plantao")
@Entity
public class Plantao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hospital hospital;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private RegraPlantaoFixo regraPlantaoFixo;

    @ManyToOne
    private Doctor medicoTitular;

    @ManyToOne
    private Doctor medicoResponsavelAtual;

    @ManyToOne
    private Manager criadoPorEscalista;

    @Enumerated(EnumType.STRING)
    private PlantaoTipo tipo;

    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    private PlantaoStatus status = PlantaoStatus.AGENDADO;

    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "plantao")
    @JsonIgnore
    private List<PedidoCobertura> pedidosCobertura;

    @OneToMany(mappedBy = "plantao")
    @JsonIgnore
    private List<Notificacao> notificacoes;

    public Plantao() {
    }

    public Plantao(Setor setor, Doctor doctorAssignado, LocalDateTime dataInicio, LocalDateTime dataFim) {
        this.setor = setor;
        this.hospital = setor != null ? setor.getHospital() : null;
        this.medicoTitular = doctorAssignado;
        this.medicoResponsavelAtual = doctorAssignado;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = PlantaoStatus.AGENDADO;
        this.tipo = PlantaoTipo.AVULSO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        if (setor != null && this.hospital == null) {
            this.hospital = setor.getHospital();
        }
    }

    public RegraPlantaoFixo getRegraPlantaoFixo() {
        return regraPlantaoFixo;
    }

    public void setRegraPlantaoFixo(RegraPlantaoFixo regraPlantaoFixo) {
        this.regraPlantaoFixo = regraPlantaoFixo;
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

    public Manager getCriadoPorEscalista() {
        return criadoPorEscalista;
    }

    public void setCriadoPorEscalista(Manager criadoPorEscalista) {
        this.criadoPorEscalista = criadoPorEscalista;
    }

    public PlantaoTipo getTipo() {
        return tipo;
    }

    public void setTipo(PlantaoTipo tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
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

    public List<Notificacao> getNotificacoes() {
        return notificacoes;
    }

    public void setNotificacoes(List<Notificacao> notificacoes) {
        this.notificacoes = notificacoes;
    }

    /**
     * Legacy alias for existing services/DTOs. Use medicoResponsavelAtual.
     */
    public Doctor getDoctorAssignado() {
        return medicoResponsavelAtual;
    }

    public void setDoctorAssignado(Doctor doctorAssignado) {
        setMedicoTitular(doctorAssignado);
        setMedicoResponsavelAtual(doctorAssignado);
    }
}
