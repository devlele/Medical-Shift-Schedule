package com.mss.medShift.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.model.PlantaoTipo;
import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.repository.DoctorRepository;
import com.mss.medShift.domain.repository.MedicoSetorRepository;
import com.mss.medShift.domain.repository.PlantaoRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.exception.ConflictException;

@Service
public class PlantaoServiceImple implements PlantaoService {

    private final PlantaoRepository plantaoRepository;
    private final SetorRepository setorRepository;
    private final DoctorRepository doctorRepository;
    private final MedicoSetorRepository medicoSetorRepository;

    public PlantaoServiceImple(PlantaoRepository plantaoRepository, SetorRepository setorRepository,
            DoctorRepository doctorRepository, MedicoSetorRepository medicoSetorRepository) {
        this.plantaoRepository = plantaoRepository;
        this.setorRepository = setorRepository;
        this.doctorRepository = doctorRepository;
        this.medicoSetorRepository = medicoSetorRepository;
    }

    @Override
    public Plantao create(Plantao plantao) {
        if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
            throw new IllegalArgumentException("Setor is required");
        }
        if (plantao.getMedicoTitular() == null && plantao.getMedicoResponsavelAtual() == null) {
            throw new IllegalArgumentException("Doctor is required");
        }
        if (plantao.getCriadoPorEscalista() == null) {
            throw new IllegalArgumentException("Escalista criador is required");
        }

        Long medicoId = resolveMedicoId(plantao);
        return createAvulso(
                plantao.getSetor().getId(),
                medicoId,
                null,
                plantao.getTurno(),
                plantao.getDataInicio(),
                plantao.getDataFim(),
                plantao.getCriadoPorEscalista());
    }

    @Override
    public Plantao createAvulso(Long setorId, Long medicoId, LocalDate data, PlantaoTurno turno,
            LocalDateTime dataInicio, LocalDateTime dataFim, Manager escalista) {
        PlantaoPeriodo periodo = resolvePeriodo(data, turno, dataInicio, dataFim);
        validateCreateAvulsoRequest(setorId, medicoId, periodo.dataInicio(), periodo.dataFim(), escalista);

        Setor setor = setorRepository.findByIdAndHospitalId(setorId, escalista.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado para o hospital do escalista"));
        Doctor medico = doctorRepository.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico não encontrado"));

        boolean medicoAtuaNoSetor = medicoSetorRepository
                .findByMedicoIdAndSetorIdAndAtivoTrue(medico.getId(), setor.getId())
                .isPresent();
        if (!medicoAtuaNoSetor) {
            throw new IllegalArgumentException("Médico não possui vínculo ativo com o setor informado");
        }

        if (hasConflitoHorario(medico.getId(), periodo.dataInicio(), periodo.dataFim())) {
            throw new ConflictException("Médico já possui plantão conflitante no período informado");
        }

        LocalDateTime now = LocalDateTime.now();
        Plantao plantao = new Plantao();
        plantao.setHospital(setor.getHospital());
        plantao.setSetor(setor);
        plantao.setMedicoTitular(medico);
        plantao.setMedicoResponsavelAtual(medico);
        plantao.setCriadoPorEscalista(escalista);
        plantao.setTipo(PlantaoTipo.AVULSO);
        plantao.setTurno(resolveTurno(turno, periodo.dataInicio(), periodo.dataFim()));
        plantao.setStatus(PlantaoStatus.AGENDADO);
        plantao.setDataInicio(periodo.dataInicio());
        plantao.setDataFim(periodo.dataFim());
        plantao.setCriadoEm(now);
        plantao.setAtualizadoEm(now);

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
        if (updatedPlantao.getTurno() != null) {
            plantao.setTurno(updatedPlantao.getTurno());
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
        if (updatedPlantao.getTurno() == null
                && (updatedPlantao.getDataInicio() != null || updatedPlantao.getDataFim() != null)) {
            plantao.setTurno(PlantaoTurno.fromPeriodo(plantao.getDataInicio(), plantao.getDataFim()));
        }
        plantao.setAtualizadoEm(LocalDateTime.now());

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

    private void validateCreateAvulsoRequest(Long setorId, Long medicoId, LocalDateTime dataInicio,
            LocalDateTime dataFim, Manager escalista) {
        if (escalista == null) {
            throw new IllegalArgumentException("Usuário logado não possui perfil de escalista");
        }
        if (escalista.getHospital() == null || escalista.getHospital().getId() == null) {
            throw new IllegalArgumentException("Escalista sem hospital");
        }
        if (setorId == null) {
            throw new IllegalArgumentException("Setor is required");
        }
        if (medicoId == null) {
            throw new IllegalArgumentException("Doctor is required");
        }
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (!dataInicio.isBefore(dataFim)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
    }

    private PlantaoPeriodo resolvePeriodo(LocalDate data, PlantaoTurno turno, LocalDateTime dataInicio,
            LocalDateTime dataFim) {
        if (turno == PlantaoTurno.DIURNO || turno == PlantaoTurno.NOTURNO) {
            if (data == null) {
                throw new IllegalArgumentException("Data é obrigatória para plantão diurno ou noturno");
            }
            return new PlantaoPeriodo(turno.dataInicio(data), turno.dataFim(data));
        }
        return new PlantaoPeriodo(dataInicio, dataFim);
    }

    private PlantaoTurno resolveTurno(PlantaoTurno turno, LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (turno != null) {
            return turno;
        }
        return PlantaoTurno.fromPeriodo(dataInicio, dataFim);
    }

    private Long resolveMedicoId(Plantao plantao) {
        if (plantao.getMedicoTitular() != null && plantao.getMedicoTitular().getId() != null) {
            return plantao.getMedicoTitular().getId();
        }
        if (plantao.getMedicoResponsavelAtual() != null && plantao.getMedicoResponsavelAtual().getId() != null) {
            return plantao.getMedicoResponsavelAtual().getId();
        }
        throw new IllegalArgumentException("Doctor is required");
    }

    private boolean hasConflitoHorario(Long medicoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return plantaoRepository.existsByMedicoResponsavelAtualIdAndStatusNotAndDataInicioLessThanAndDataFimGreaterThan(
                medicoId,
                PlantaoStatus.CANCELADO,
                dataFim,
                dataInicio);
    }

    private record PlantaoPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
    }
}
