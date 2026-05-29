package com.mss.medShift.domain.model;

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
import jakarta.persistence.Transient;

@Table(name = "tb_hospital")
@Entity
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne
    private Usuario criadoPorUsuario;

    private String nomeFantasia;
    private String razaoSocial;
    private String cnpj;
    private String telefone;
    private String endereco;
    private String nomeGestor;
    private Boolean ativo = true;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    /*
     * Transitional fields kept for request/legacy schema compatibility.
     * The canonical identity, password and role are stored in Usuario.
     */
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.HOSPITAL;

    @OneToMany(mappedBy = "hospital")
    @JsonIgnore
    private List<Setor> setores;

    @Transient
    @JsonIgnore
    private List<Manager> managers;

    @OneToMany(mappedBy = "hospital")
    @JsonIgnore
    private List<Doctor> doctors;

    @OneToMany(mappedBy = "hospital")
    @JsonIgnore
    private List<RegraPlantaoFixo> regrasPlantaoFixo;

    @Transient
    @JsonIgnore
    private List<Plantao> plantoes;

    @OneToMany(mappedBy = "hospital")
    @JsonIgnore
    private List<PedidoCobertura> pedidosCobertura;

    public Hospital() {
    }

    public Hospital(String nomeFantasia, String cnpj, String endereco, String nomeGestor, String email, String password) {
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.nomeGestor = nomeGestor;
        this.email = email;
        this.password = password;
        this.role = UserRole.HOSPITAL;
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

    public Usuario getCriadoPorUsuario() {
        return criadoPorUsuario;
    }

    public void setCriadoPorUsuario(Usuario criadoPorUsuario) {
        this.criadoPorUsuario = criadoPorUsuario;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getNomeGestor() {
        return nomeGestor;
    }

    public void setNomeGestor(String nomeGestor) {
        this.nomeGestor = nomeGestor;
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

    public String getEmail() {
        return usuario != null ? usuario.getEmail() : email;
    }

    public void setEmail(String email) {
        this.email = email;
        if (this.usuario != null) {
            this.usuario.setEmail(email);
        }
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getPassword() {
        return usuario != null ? usuario.getPassword() : password;
    }

    public void setPassword(String password) {
        this.password = password;
        if (this.usuario != null) {
            this.usuario.setSenhaHash(password);
        }
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

    public List<Setor> getSetores() {
        return setores;
    }

    public void setSetores(List<Setor> setores) {
        this.setores = setores;
    }

    public List<Manager> getManagers() {
        return managers;
    }

    public void setManagers(List<Manager> managers) {
        this.managers = managers;
    }

    public List<Doctor> getDoctors() {
        return doctors;
    }

    public void setDoctors(List<Doctor> doctors) {
        this.doctors = doctors;
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

}
