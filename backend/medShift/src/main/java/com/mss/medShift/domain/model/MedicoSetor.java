package com.mss.medShift.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name = "tb_medico_setor")
@Entity
public class MedicoSetor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor medico;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private Manager vinculadoPorEscalista;

    private Boolean ativo = true;
    private LocalDateTime vinculadoEm;
    private LocalDateTime desvinculadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getMedico() {
        return medico;
    }

    public void setMedico(Doctor medico) {
        this.medico = medico;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

    public Manager getVinculadoPorEscalista() {
        return vinculadoPorEscalista;
    }

    public void setVinculadoPorEscalista(Manager vinculadoPorEscalista) {
        this.vinculadoPorEscalista = vinculadoPorEscalista;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getVinculadoEm() {
        return vinculadoEm;
    }

    public void setVinculadoEm(LocalDateTime vinculadoEm) {
        this.vinculadoEm = vinculadoEm;
    }

    public LocalDateTime getDesvinculadoEm() {
        return desvinculadoEm;
    }

    public void setDesvinculadoEm(LocalDateTime desvinculadoEm) {
        this.desvinculadoEm = desvinculadoEm;
    }
}
