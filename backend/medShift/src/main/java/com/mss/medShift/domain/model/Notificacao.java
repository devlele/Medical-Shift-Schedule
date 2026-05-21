package com.mss.medShift.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name = "tb_notificacao")
@Entity
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuarioDestino;

    @ManyToOne
    private PedidoCobertura pedidoCobertura;

    @ManyToOne
    private Plantao plantao;

    @Enumerated(EnumType.STRING)
    private NotificacaoTipo tipo;

    private String titulo;
    private String mensagem;
    private LocalDateTime lidaEm;
    private LocalDateTime criadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuarioDestino() {
        return usuarioDestino;
    }

    public void setUsuarioDestino(Usuario usuarioDestino) {
        this.usuarioDestino = usuarioDestino;
    }

    public PedidoCobertura getPedidoCobertura() {
        return pedidoCobertura;
    }

    public void setPedidoCobertura(PedidoCobertura pedidoCobertura) {
        this.pedidoCobertura = pedidoCobertura;
    }

    public Plantao getPlantao() {
        return plantao;
    }

    public void setPlantao(Plantao plantao) {
        this.plantao = plantao;
    }

    public NotificacaoTipo getTipo() {
        return tipo;
    }

    public void setTipo(NotificacaoTipo tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getLidaEm() {
        return lidaEm;
    }

    public void setLidaEm(LocalDateTime lidaEm) {
        this.lidaEm = lidaEm;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
