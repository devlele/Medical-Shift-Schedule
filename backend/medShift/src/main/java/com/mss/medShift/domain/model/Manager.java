package com.mss.medShift.domain.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Table(name = "tb_escalista")
@Entity
public class Manager extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnore
    private Usuario usuario;

    private String cargo;
    private Boolean ativo = true;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.ESCALISTA;

    @ManyToOne
    private Hospital hospital;

    /*
     * Transitional single-sector field kept for existing controllers.
     * The canonical N:N relationship is EscalistaSetor.
     */
    @ManyToOne
    private Setor setor;

    @OneToMany(mappedBy = "escalista")
    @JsonIgnore
    private List<EscalistaSetor> escalistaSetores;

    @OneToMany(mappedBy = "vinculadoPorEscalista")
    @JsonIgnore
    private List<MedicoSetor> medicoSetoresVinculados;

    @OneToMany(mappedBy = "criadoPorEscalista")
    @JsonIgnore
    private List<RegraPlantaoFixo> regrasPlantaoFixoCriadas;

    @OneToMany(mappedBy = "criadoPorEscalista")
    @JsonIgnore
    private List<Plantao> plantoesCriados;

    public Manager() {
    }

    public Manager(String name, String email, String cpf, Date birthday, String password, String department, UserRole role) {
        super(name, email, cpf, birthday, password);
        this.cargo = department;
        this.role = role != null ? role : UserRole.ESCALISTA;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getDepartment() {
        return cargo;
    }

    public void setDepartment(String department) {
        this.cargo = department;
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

    public UserRole getRole() {
        return usuario != null && usuario.getRole() != null ? usuario.getRole() : role;
    }

    public void setRole(UserRole role) {
        this.role = role;
        if (this.usuario != null) {
            this.usuario.setRole(role);
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

    public List<EscalistaSetor> getEscalistaSetores() {
        return escalistaSetores;
    }

    public void setEscalistaSetores(List<EscalistaSetor> escalistaSetores) {
        this.escalistaSetores = escalistaSetores;
    }

    public List<MedicoSetor> getMedicoSetoresVinculados() {
        return medicoSetoresVinculados;
    }

    public void setMedicoSetoresVinculados(List<MedicoSetor> medicoSetoresVinculados) {
        this.medicoSetoresVinculados = medicoSetoresVinculados;
    }

    public List<RegraPlantaoFixo> getRegrasPlantaoFixoCriadas() {
        return regrasPlantaoFixoCriadas;
    }

    public void setRegrasPlantaoFixoCriadas(List<RegraPlantaoFixo> regrasPlantaoFixoCriadas) {
        this.regrasPlantaoFixoCriadas = regrasPlantaoFixoCriadas;
    }

    public List<Plantao> getPlantoesCriados() {
        return plantoesCriados;
    }

    public void setPlantoesCriados(List<Plantao> plantoesCriados) {
        this.plantoesCriados = plantoesCriados;
    }

    @Override
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getPassword() {
        return usuario != null ? usuario.getPassword() : super.getPassword();
    }

}
