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

@Table(name = "tb_medico")
@Entity
public class Doctor extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnore
    private Usuario usuario;

    private String crm;
    private String ufCrm;
    private String telefone;
    private String fotoPerfilUrl;
    private Boolean ativo = true;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    /*
     * Transitional free-text specialty kept for existing profile endpoints.
     * The canonical relationship is MedicoEspecialidade.
     */
    private String specialty;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.MEDICO;

    /*
     * Transitional single hospital/sector fields kept for existing services.
     * The canonical sector relationship is MedicoSetor.
     */
    @ManyToOne
    private Hospital hospital;

    @ManyToOne
    private Setor setor;

    @OneToMany(mappedBy = "medico")
    @JsonIgnore
    private List<MedicoSetor> medicoSetores;

    @OneToMany(mappedBy = "medico")
    @JsonIgnore
    private List<MedicoEspecialidade> medicoEspecialidades;

    @OneToMany(mappedBy = "medicoTitular")
    @JsonIgnore
    private List<RegraPlantaoFixo> regrasPlantaoFixo;

    @OneToMany(mappedBy = "medicoTitular")
    @JsonIgnore
    private List<Plantao> plantoesComoTitular;

    @OneToMany(mappedBy = "medicoResponsavelAtual")
    @JsonIgnore
    private List<Plantao> plantoesComoResponsavelAtual;

    @OneToMany(mappedBy = "medicoSolicitante")
    @JsonIgnore
    private List<PedidoCobertura> pedidosSolicitados;

    @OneToMany(mappedBy = "medicoCobridor")
    @JsonIgnore
    private List<PedidoCobertura> pedidosAssumidos;

    public Doctor() {
    }

    public Doctor(String name, String email, String cpf, Date birthday, String password, String specialty, String crm, UserRole role) {
        super(name, email, cpf, birthday, password);
        this.specialty = specialty;
        this.crm = crm;
        this.role = role != null ? role : UserRole.MEDICO;
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

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public String getUfCrm() {
        return ufCrm;
    }

    public void setUfCrm(String ufCrm) {
        this.ufCrm = ufCrm;
    }

    public String getUf() {
        return ufCrm;
    }

    public void setUf(String uf) {
        this.ufCrm = uf;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getFotoPerfilUrl() {
        return fotoPerfilUrl;
    }

    public void setFotoPerfilUrl(String fotoPerfilUrl) {
        this.fotoPerfilUrl = fotoPerfilUrl;
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

    public List<MedicoSetor> getMedicoSetores() {
        return medicoSetores;
    }

    public void setMedicoSetores(List<MedicoSetor> medicoSetores) {
        this.medicoSetores = medicoSetores;
    }

    public List<MedicoEspecialidade> getMedicoEspecialidades() {
        return medicoEspecialidades;
    }

    public void setMedicoEspecialidades(List<MedicoEspecialidade> medicoEspecialidades) {
        this.medicoEspecialidades = medicoEspecialidades;
    }

    public List<RegraPlantaoFixo> getRegrasPlantaoFixo() {
        return regrasPlantaoFixo;
    }

    public void setRegrasPlantaoFixo(List<RegraPlantaoFixo> regrasPlantaoFixo) {
        this.regrasPlantaoFixo = regrasPlantaoFixo;
    }

    public List<Plantao> getPlantoesComoTitular() {
        return plantoesComoTitular;
    }

    public void setPlantoesComoTitular(List<Plantao> plantoesComoTitular) {
        this.plantoesComoTitular = plantoesComoTitular;
    }

    public List<Plantao> getPlantoesComoResponsavelAtual() {
        return plantoesComoResponsavelAtual;
    }

    public void setPlantoesComoResponsavelAtual(List<Plantao> plantoesComoResponsavelAtual) {
        this.plantoesComoResponsavelAtual = plantoesComoResponsavelAtual;
    }

    public List<PedidoCobertura> getPedidosSolicitados() {
        return pedidosSolicitados;
    }

    public void setPedidosSolicitados(List<PedidoCobertura> pedidosSolicitados) {
        this.pedidosSolicitados = pedidosSolicitados;
    }

    public List<PedidoCobertura> getPedidosAssumidos() {
        return pedidosAssumidos;
    }

    public void setPedidosAssumidos(List<PedidoCobertura> pedidosAssumidos) {
        this.pedidosAssumidos = pedidosAssumidos;
    }

    @Override
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getPassword() {
        return usuario != null ? usuario.getPassword() : super.getPassword();
    }

}
