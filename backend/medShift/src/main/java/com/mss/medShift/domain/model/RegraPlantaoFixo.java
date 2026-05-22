package com.mss.medShift.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

@Table(name = "tb_regra_plantao_fixo")
@Entity
public class RegraPlantaoFixo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hospital hospital;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private Doctor medicoTitular;

    @ManyToOne
    private Manager criadoPorEscalista;

    @Enumerated(EnumType.STRING)
    private TipoRecorrenciaPlantao tipoRecorrencia;

    private String diaSemana;
    private Integer semanaDoMes;
    private Integer diaDoMes;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private LocalDate dataInicioVigencia;
    private LocalDate dataFimVigencia;
    private Boolean ativo = true;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "regraPlantaoFixo")
    @JsonIgnore
    private List<Plantao> plantoes;

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

    public Doctor getMedicoTitular() {
        return medicoTitular;
    }

    public void setMedicoTitular(Doctor medicoTitular) {
        this.medicoTitular = medicoTitular;
    }

    public Manager getCriadoPorEscalista() {
        return criadoPorEscalista;
    }

    public void setCriadoPorEscalista(Manager criadoPorEscalista) {
        this.criadoPorEscalista = criadoPorEscalista;
    }

    public TipoRecorrenciaPlantao getTipoRecorrencia() {
        return tipoRecorrencia;
    }

    public void setTipoRecorrencia(TipoRecorrenciaPlantao tipoRecorrencia) {
        this.tipoRecorrencia = tipoRecorrencia;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public Integer getSemanaDoMes() {
        return semanaDoMes;
    }

    public void setSemanaDoMes(Integer semanaDoMes) {
        this.semanaDoMes = semanaDoMes;
    }

    public Integer getDiaDoMes() {
        return diaDoMes;
    }

    public void setDiaDoMes(Integer diaDoMes) {
        this.diaDoMes = diaDoMes;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public LocalDate getDataInicioVigencia() {
        return dataInicioVigencia;
    }

    public void setDataInicioVigencia(LocalDate dataInicioVigencia) {
        this.dataInicioVigencia = dataInicioVigencia;
    }

    public LocalDate getDataFimVigencia() {
        return dataFimVigencia;
    }

    public void setDataFimVigencia(LocalDate dataFimVigencia) {
        this.dataFimVigencia = dataFimVigencia;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
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

    public List<Plantao> getPlantoes() {
        return plantoes;
    }

    public void setPlantoes(List<Plantao> plantoes) {
        this.plantoes = plantoes;
    }
}
