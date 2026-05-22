package com.mss.medShift.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Table(name = "tb_setor")
@Entity
public class Setor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private Boolean ativo = true;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @ManyToOne
    @JsonIgnoreProperties({"password", "accountNonExpired", "accountNonLocked",
            "credentialsNonExpired", "enabled", "authorities",
            "doctors", "managers", "setores", "role", "username"})
    private Hospital hospital;

    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<EscalistaSetor> escalistaSetores;

    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<MedicoSetor> medicoSetores;

    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<RegraPlantaoFixo> regrasPlantaoFixo;

    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<Plantao> plantoes;

    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<PedidoCobertura> pedidosCobertura;

    public Setor() {
    }

    public Setor(String nome, String descricao, Hospital hospital) {
        this.nome = nome;
        this.descricao = descricao;
        this.hospital = hospital;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
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

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public List<EscalistaSetor> getEscalistaSetores() {
        return escalistaSetores;
    }

    public void setEscalistaSetores(List<EscalistaSetor> escalistaSetores) {
        this.escalistaSetores = escalistaSetores;
    }

    public List<MedicoSetor> getMedicoSetores() {
        return medicoSetores;
    }

    public void setMedicoSetores(List<MedicoSetor> medicoSetores) {
        this.medicoSetores = medicoSetores;
    }

    public List<RegraPlantaoFixo> getRegrasPlantaoFixo() {
        return regrasPlantaoFixo;
    }

    public void setRegrasPlantaoFixo(List<RegraPlantaoFixo> regrasPlantaoFixo) {
        this.regrasPlantaoFixo = regrasPlantaoFixo;
    }

    public List<Plantao> getPlantoes() {
        return plantoes;
    }

    public void setPlantoes(List<Plantao> plantoes) {
        this.plantoes = plantoes;
    }

    public List<PedidoCobertura> getPedidosCobertura() {
        return pedidosCobertura;
    }

    public void setPedidosCobertura(List<PedidoCobertura> pedidosCobertura) {
        this.pedidosCobertura = pedidosCobertura;
    }

    /**
     * Legacy accessor kept for old responses that expected a direct Setor -> Manager list.
     */
    @JsonIgnore
    public List<Manager> getManagers() {
        return escalistaSetores == null
                ? List.of()
                : escalistaSetores.stream().map(EscalistaSetor::getEscalista).toList();
    }

    public void setManagers(List<Manager> ignoredManagers) {
        // Use EscalistaSetor to manage this association.
    }

    /**
     * Legacy accessor kept for old responses that expected a direct Setor -> Doctor list.
     */
    @JsonIgnore
    public List<Doctor> getDoctors() {
        return medicoSetores == null
                ? List.of()
                : medicoSetores.stream().map(MedicoSetor::getMedico).toList();
    }

    public void setDoctors(List<Doctor> ignoredDoctors) {
        // Use MedicoSetor to manage this association.
    }
}
