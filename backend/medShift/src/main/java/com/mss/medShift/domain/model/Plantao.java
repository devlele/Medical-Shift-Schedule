package com.mss.medShift.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;

@Table(name = "tb_plantao")
@Entity
public class Plantao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Setor setor;

    @ManyToOne
    private Doctor doctorAssignado;

    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    private PlantaoStatus status;

    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    @ManyToMany
    @JoinTable(
        name = "tb_plantao_interest",
        joinColumns = @JoinColumn(name = "plantao_id"),
        inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    private List<Doctor> doctorsInterested = new ArrayList<>();

    public Plantao() {
        this.status = PlantaoStatus.SCHEDULED;
    }

    public Plantao(Setor setor, Doctor doctorAssignado, LocalDateTime dataInicio, LocalDateTime dataFim) {
        this.setor = setor;
        this.doctorAssignado = doctorAssignado;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = PlantaoStatus.SCHEDULED;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

    public Doctor getDoctorAssignado() {
        return doctorAssignado;
    }

    public void setDoctorAssignado(Doctor doctorAssignado) {
        this.doctorAssignado = doctorAssignado;
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

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public List<Doctor> getDoctorsInterested() {
        return doctorsInterested;
    }

    public void setDoctorsInterested(List<Doctor> doctorsInterested) {
        this.doctorsInterested = doctorsInterested;
    }

    public void addInterestedDoctor(Doctor doctor) {
        if (!this.doctorsInterested.contains(doctor)) {
            this.doctorsInterested.add(doctor);
        }
    }

    public void removeInterestedDoctor(Doctor doctor) {
        this.doctorsInterested.remove(doctor);
    }
}
