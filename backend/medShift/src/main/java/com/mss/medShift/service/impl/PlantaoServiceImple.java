package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.repository.PlantaoRepository;
import com.mss.medShift.service.PlantaoService;

@Service
public class PlantaoServiceImple implements PlantaoService {

    private final PlantaoRepository plantaoRepository;

    public PlantaoServiceImple(PlantaoRepository plantaoRepository) {
        this.plantaoRepository = plantaoRepository;
    }

    @Override
    public Plantao create(Plantao plantao) {
        if (plantao.getSetor() == null) {
            throw new IllegalArgumentException("Setor is required");
        }
        if (plantao.getDoctorAssignado() == null) {
            throw new IllegalArgumentException("Doctor is required");
        }
        if (plantao.getDataInicio() == null || plantao.getDataFim() == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (!plantao.getDataInicio().isBefore(plantao.getDataFim())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        plantao.setStatus(PlantaoStatus.SCHEDULED);
        return plantaoRepository.save(plantao);
    }

    @Override
    public Plantao findById(Long id) {
        return plantaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalId(Long id, Long hospitalId) {
        return plantaoRepository.findByIdAndSetorHospitalId(id, hospitalId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId) {
        return plantaoRepository.findByIdAndSetorHospitalIdAndSetorId(id, hospitalId, setorId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public List<Plantao> findBySetorId(Long setorId) {
        return plantaoRepository.findBySetorId(setorId);
    }

    @Override
    public List<Plantao> findByDoctorId(Long doctorId) {
        return plantaoRepository.findByDoctorAssignadoId(doctorId);
    }

    @Override
    public List<Plantao> findByHospitalId(Long hospitalId) {
        return plantaoRepository.findBySetorHospitalId(hospitalId);
    }

    @Override
    public List<Plantao> findByHospitalIdAndSetorId(Long hospitalId, Long setorId) {
        return plantaoRepository.findBySetorHospitalIdAndSetorId(hospitalId, setorId);
    }

    @Override
    public List<Plantao> findBySetorAndPeriod(Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetorIdAndDataInicioBetween(setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndPeriod(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByDoctorAssignadoIdAndDataInicioBetween(doctorId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndPeriod(Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetorHospitalIdAndDataInicioBetween(hospitalId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndSetorAndPeriod(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetorHospitalIdAndSetorIdAndDataInicioBetween(hospitalId, setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndHospital(Long doctorId, Long hospitalId) {
        return plantaoRepository.findByDoctorAssignadoIdAndSetorHospitalId(doctorId, hospitalId);
    }

    @Override
    public List<Plantao> findByDoctorAndHospitalAndPeriod(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByDoctorAssignadoIdAndSetorHospitalIdAndDataInicioBetween(doctorId, hospitalId, start, end);
    }

    @Override
    public Plantao update(Long id, Plantao updatedPlantao) {
        Plantao plantao = findById(id);

        if (updatedPlantao.getSetor() != null) {
            plantao.setSetor(updatedPlantao.getSetor());
        }
        if (updatedPlantao.getDoctorAssignado() != null) {
            plantao.setDoctorAssignado(updatedPlantao.getDoctorAssignado());
        }
        if (updatedPlantao.getDataInicio() != null) {
            plantao.setDataInicio(updatedPlantao.getDataInicio());
        }
        if (updatedPlantao.getDataFim() != null) {
            plantao.setDataFim(updatedPlantao.getDataFim());
        }
        if (updatedPlantao.getStatus() != null) {
            plantao.setStatus(updatedPlantao.getStatus());
        }

        return plantaoRepository.save(plantao);
    }

    @Override
    public void delete(Long id) {
        if (plantaoRepository.existsById(id)) {
            plantaoRepository.deleteById(id);
            return;
        }
        throw new NoSuchElementException("Plantao not found with id: " + id);
    }

    @Override
    public Plantao checkIn(Long plantaoId, Long doctorId) {
        Plantao plantao = findById(plantaoId);

        if (!plantao.getDoctorAssignado().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Only the assigned doctor can check in");
        }

        plantao.setCheckInTime(LocalDateTime.now());
        plantao.setStatus(PlantaoStatus.CHECK_IN);

        return plantaoRepository.save(plantao);
    }

    @Override
    public Plantao checkOut(Long plantaoId, Long doctorId) {
        Plantao plantao = findById(plantaoId);

        if (!plantao.getDoctorAssignado().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Only the assigned doctor can check out");
        }

        plantao.setCheckOutTime(LocalDateTime.now());
        plantao.setStatus(PlantaoStatus.CHECK_OUT);

        return plantaoRepository.save(plantao);
    }

    @Override
    public Plantao registerInterest(Long plantaoId, Doctor doctor) {
        Plantao plantao = findById(plantaoId);

        if (plantao.getStatus().equals(PlantaoStatus.SCHEDULED)) {
            plantao.setStatus(PlantaoStatus.PENDING_INTEREST);
        }

        plantao.addInterestedDoctor(doctor);
        return plantaoRepository.save(plantao);
    }

    @Override
    public Plantao openForExchange(Long plantaoId) {
        Plantao plantao = findById(plantaoId);
        plantao.setStatus(PlantaoStatus.PENDING_INTEREST);
        return plantaoRepository.save(plantao);
    }
}
