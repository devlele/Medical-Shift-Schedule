package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.model.PlantaoTipo;
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
        if (plantao.getMedicoTitular() == null && plantao.getMedicoResponsavelAtual() == null) {
            throw new IllegalArgumentException("Doctor is required");
        }
        if (plantao.getDataInicio() == null || plantao.getDataFim() == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (!plantao.getDataInicio().isBefore(plantao.getDataFim())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        if (plantao.getHospital() == null && plantao.getSetor() != null) {
            plantao.setHospital(plantao.getSetor().getHospital());
        }
        if (plantao.getMedicoTitular() == null) {
            plantao.setMedicoTitular(plantao.getMedicoResponsavelAtual());
        }
        if (plantao.getMedicoResponsavelAtual() == null) {
            plantao.setMedicoResponsavelAtual(plantao.getMedicoTitular());
        }
        if (plantao.getTipo() == null) {
            plantao.setTipo(plantao.getRegraPlantaoFixo() == null ? PlantaoTipo.AVULSO : PlantaoTipo.FIXO);
        }
        plantao.setStatus(PlantaoStatus.AGENDADO);
        return plantaoRepository.save(plantao);
    }

    @Override
    public Plantao findById(Long id) {
        return plantaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalId(Long id, Long hospitalId) {
        return plantaoRepository.findByIdAndHospitalId(id, hospitalId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId) {
        return plantaoRepository.findByIdAndHospitalIdAndSetorId(id, hospitalId, setorId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public List<Plantao> findBySetorId(Long setorId) {
        return plantaoRepository.findBySetorId(setorId);
    }

    @Override
    public List<Plantao> findByDoctorId(Long doctorId) {
        return plantaoRepository.findByMedicoResponsavelAtualId(doctorId);
    }

    @Override
    public List<Plantao> findByHospitalId(Long hospitalId) {
        return plantaoRepository.findByHospitalId(hospitalId);
    }

    @Override
    public List<Plantao> findByHospitalIdAndSetorId(Long hospitalId, Long setorId) {
        return plantaoRepository.findByHospitalIdAndSetorId(hospitalId, setorId);
    }

    @Override
    public List<Plantao> findBySetorAndPeriod(Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetorIdAndDataInicioBetween(setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndPeriod(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByMedicoResponsavelAtualIdAndDataInicioBetween(doctorId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndPeriod(Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByHospitalIdAndDataInicioBetween(hospitalId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndSetorAndPeriod(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByHospitalIdAndSetorIdAndDataInicioBetween(hospitalId, setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndHospital(Long doctorId, Long hospitalId) {
        return plantaoRepository.findByMedicoResponsavelAtualIdAndHospitalId(doctorId, hospitalId);
    }

    @Override
    public List<Plantao> findByDoctorAndHospitalAndPeriod(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findByMedicoResponsavelAtualIdAndHospitalIdAndDataInicioBetween(doctorId, hospitalId, start, end);
    }

    @Override
    public Plantao update(Long id, Plantao updatedPlantao) {
        Plantao plantao = findById(id);

        if (updatedPlantao.getSetor() != null) {
            plantao.setSetor(updatedPlantao.getSetor());
        }
        if (updatedPlantao.getMedicoTitular() != null) {
            plantao.setMedicoTitular(updatedPlantao.getMedicoTitular());
        }
        if (updatedPlantao.getMedicoResponsavelAtual() != null) {
            plantao.setMedicoResponsavelAtual(updatedPlantao.getMedicoResponsavelAtual());
        }
        if (updatedPlantao.getHospital() != null) {
            plantao.setHospital(updatedPlantao.getHospital());
        }
        if (updatedPlantao.getRegraPlantaoFixo() != null) {
            plantao.setRegraPlantaoFixo(updatedPlantao.getRegraPlantaoFixo());
        }
        if (updatedPlantao.getCriadoPorEscalista() != null) {
            plantao.setCriadoPorEscalista(updatedPlantao.getCriadoPorEscalista());
        }
        if (updatedPlantao.getTipo() != null) {
            plantao.setTipo(updatedPlantao.getTipo());
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

}
