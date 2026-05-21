package com.mss.medShift.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name = "tb_escalista_setor")
@Entity
public class EscalistaSetor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Manager escalista;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private Usuario vinculadoPorUsuario;

    private Boolean ativo = true;
    private LocalDateTime vinculadoEm;
    private LocalDateTime desvinculadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Manager getEscalista() {
        return escalista;
    }

    public void setEscalista(Manager escalista) {
        this.escalista = escalista;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

    public Usuario getVinculadoPorUsuario() {
        return vinculadoPorUsuario;
    }

    public void setVinculadoPorUsuario(Usuario vinculadoPorUsuario) {
        this.vinculadoPorUsuario = vinculadoPorUsuario;
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
