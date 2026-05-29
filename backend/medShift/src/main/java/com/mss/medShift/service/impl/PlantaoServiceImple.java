package com.mss.medShift.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.DayOfWeek;
import java.time.DateTimeException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoMedico;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.model.PlantaoTipo;
import com.mss.medShift.domain.model.PlantaoTurno;
import com.mss.medShift.domain.model.RegraPlantaoFixo;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.model.TipoRecorrenciaPlantao;
import com.mss.medShift.domain.repository.DoctorRepository;
import com.mss.medShift.domain.repository.MedicoSetorRepository;
import com.mss.medShift.domain.repository.PlantaoMedicoRepository;
import com.mss.medShift.domain.repository.PlantaoRepository;
import com.mss.medShift.domain.repository.RegraPlantaoFixoRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.service.PlantaoFixoCreationResult;
import com.mss.medShift.service.PlantaoService;
import com.mss.medShift.service.exception.ConflictException;

@Service
public class PlantaoServiceImple implements PlantaoService {

    private final PlantaoRepository plantaoRepository;
    private final SetorRepository setorRepository;
    private final DoctorRepository doctorRepository;
    private final MedicoSetorRepository medicoSetorRepository;
    private final PlantaoMedicoRepository plantaoMedicoRepository;
    private final RegraPlantaoFixoRepository regraPlantaoFixoRepository;

    public PlantaoServiceImple(PlantaoRepository plantaoRepository, SetorRepository setorRepository,
            DoctorRepository doctorRepository, MedicoSetorRepository medicoSetorRepository,
            PlantaoMedicoRepository plantaoMedicoRepository, RegraPlantaoFixoRepository regraPlantaoFixoRepository) {
        this.plantaoRepository = plantaoRepository;
        this.setorRepository = setorRepository;
        this.doctorRepository = doctorRepository;
        this.medicoSetorRepository = medicoSetorRepository;
        this.plantaoMedicoRepository = plantaoMedicoRepository;
        this.regraPlantaoFixoRepository = regraPlantaoFixoRepository;
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
        return createAvulso(setorId, medicoId != null ? List.of(medicoId) : List.of(), data, turno, dataInicio,
                dataFim, escalista);
    }

    @Override
    @Transactional
    public Plantao createAvulso(Long setorId, List<Long> medicoIds, LocalDate data, PlantaoTurno turno,
            LocalDateTime dataInicio, LocalDateTime dataFim, Manager escalista) {
        PlantaoPeriodo periodo = resolvePeriodo(data, turno, dataInicio, dataFim);
        List<Long> medicoIdsNormalizados = normalizeMedicoIds(medicoIds);
        validateCreateAvulsoRequest(setorId, medicoIdsNormalizados, periodo.dataInicio(), periodo.dataFim(), escalista);

        Setor setor = setorRepository.findByIdAndHospitalId(setorId, escalista.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado para o hospital do escalista"));
        List<Doctor> medicos = loadAndValidateMedicos(medicoIdsNormalizados, setor, List.of(periodo));
        Doctor medicoPrincipal = medicos.get(0);

        LocalDateTime now = LocalDateTime.now();
        Plantao plantao = new Plantao();
        plantao.setSetor(setor);
        plantao.setMedicoTitular(medicoPrincipal);
        plantao.setMedicoResponsavelAtual(medicoPrincipal);
        plantao.setCriadoPorEscalista(escalista);
        plantao.setTipo(PlantaoTipo.AVULSO);
        plantao.setTurno(resolveTurno(turno, periodo.dataInicio(), periodo.dataFim()));
        plantao.setStatus(PlantaoStatus.AGENDADO);
        plantao.setDataInicio(periodo.dataInicio());
        plantao.setDataFim(periodo.dataFim());
        plantao.setCriadoEm(now);
        plantao.setAtualizadoEm(now);

        Plantao plantaoSalvo = plantaoRepository.save(plantao);
        plantaoSalvo.setMedicos(criarAlocacoes(plantaoSalvo, medicos, now));
        return plantaoSalvo;
    }

    @Override
    @Transactional
    public PlantaoFixoCreationResult createFixo(Long setorId, Long medicoId, TipoRecorrenciaPlantao tipoRecorrencia,
            String diaSemana, Integer semanaDoMes, Integer diaDoMes, PlantaoTurno turno,
            LocalTime horaInicio, LocalTime horaFim, LocalDate dataInicioVigencia,
            LocalDate dataFimVigencia, Manager escalista) {
        return createFixo(setorId, medicoId != null ? List.of(medicoId) : List.of(), tipoRecorrencia, diaSemana,
                semanaDoMes, diaDoMes, turno, horaInicio, horaFim, dataInicioVigencia, dataFimVigencia, escalista);
    }

    @Override
    @Transactional
    public PlantaoFixoCreationResult createFixo(Long setorId, List<Long> medicoIds, TipoRecorrenciaPlantao tipoRecorrencia,
            String diaSemana, Integer semanaDoMes, Integer diaDoMes, PlantaoTurno turno,
            LocalTime horaInicio, LocalTime horaFim, LocalDate dataInicioVigencia,
            LocalDate dataFimVigencia, Manager escalista) {
        TimeRange timeRange = resolveTimeRange(turno, horaInicio, horaFim);
        List<Long> medicoIdsNormalizados = normalizeMedicoIds(medicoIds);
        validateCreateFixoRequest(setorId, medicoIdsNormalizados, tipoRecorrencia, diaSemana, semanaDoMes, diaDoMes,
                dataInicioVigencia, dataFimVigencia, escalista);

        Setor setor = setorRepository.findByIdAndHospitalId(setorId, escalista.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado para o hospital do escalista"));

        validateGenerationWindow(dataInicioVigencia, dataFimVigencia);

        List<LocalDate> datas = gerarDatasRecorrentes(tipoRecorrencia, diaSemana, semanaDoMes, diaDoMes,
                dataInicioVigencia, dataFimVigencia);
        if (datas.isEmpty()) {
            throw new IllegalArgumentException("A regra fixa não gerou nenhum plantão dentro da vigência informada");
        }

        List<PlantaoPeriodo> periodos = datas.stream()
                .map(data -> toPeriodo(data, timeRange))
                .toList();
        validatePeriodosFuturos(periodos);
        List<Doctor> medicos = loadAndValidateMedicos(medicoIdsNormalizados, setor, periodos);
        Doctor medicoPrincipal = medicos.get(0);

        LocalDateTime now = LocalDateTime.now();
        RegraPlantaoFixo regra = new RegraPlantaoFixo();
        regra.setHospital(setor.getHospital());
        regra.setSetor(setor);
        regra.setMedicoTitular(medicoPrincipal);
        regra.setCriadoPorEscalista(escalista);
        regra.setTipoRecorrencia(tipoRecorrencia);
        regra.setDiaSemana(resolveDiaSemanaParaSalvar(tipoRecorrencia, diaSemana));
        regra.setSemanaDoMes(semanaDoMes);
        regra.setDiaDoMes(diaDoMes);
        regra.setHoraInicio(timeRange.horaInicio());
        regra.setHoraFim(timeRange.horaFim());
        regra.setDataInicioVigencia(dataInicioVigencia);
        regra.setDataFimVigencia(dataFimVigencia);
        regra.setAtivo(true);
        regra.setCriadoEm(now);
        regra.setAtualizadoEm(now);

        RegraPlantaoFixo regraSalva = regraPlantaoFixoRepository.save(regra);

        List<Plantao> plantoes = periodos.stream()
                .map(periodo -> buildPlantaoFixo(setor, medicoPrincipal, escalista, regraSalva, resolveTurno(turno,
                        periodo.dataInicio(), periodo.dataFim()), periodo, now))
                .toList();

        List<Plantao> plantoesSalvos = plantaoRepository.saveAll(plantoes);
        plantoesSalvos.forEach(plantao -> plantao.setMedicos(criarAlocacoes(plantao, medicos, now)));
        return new PlantaoFixoCreationResult(regraSalva, plantoesSalvos);
    }

    @Override
    public Plantao findById(Long id) {
        return plantaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalId(Long id, Long hospitalId) {
        return plantaoRepository.findByIdAndSetor_Hospital_Id(id, hospitalId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public Plantao findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId) {
        return plantaoRepository.findByIdAndSetor_Hospital_IdAndSetorId(id, hospitalId, setorId)
                .orElseThrow(() -> new NoSuchElementException("Plantao not found with id: " + id));
    }

    @Override
    public List<Plantao> findBySetorId(Long setorId) {
        return plantaoRepository.findBySetorId(setorId);
    }

    @Override
    public List<Plantao> findByDoctorId(Long doctorId) {
        return plantaoMedicoRepository.findPlantoesByMedicoResponsavelAtualId(doctorId);
    }

    @Override
    public List<Plantao> findByHospitalId(Long hospitalId) {
        return plantaoRepository.findBySetor_Hospital_Id(hospitalId);
    }

    @Override
    public List<Plantao> findByHospitalIdAndSetorId(Long hospitalId, Long setorId) {
        return plantaoRepository.findBySetor_Hospital_IdAndSetorId(hospitalId, setorId);
    }

    @Override
    public List<Plantao> findBySetorAndPeriod(Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetorIdAndDataInicioBetween(setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndPeriod(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return plantaoMedicoRepository.findPlantoesByMedicoResponsavelAtualIdAndPeriodo(doctorId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndPeriod(Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetor_Hospital_IdAndDataInicioBetween(hospitalId, start, end);
    }

    @Override
    public List<Plantao> findByHospitalAndSetorAndPeriod(Long hospitalId, Long setorId, LocalDateTime start, LocalDateTime end) {
        return plantaoRepository.findBySetor_Hospital_IdAndSetorIdAndDataInicioBetween(hospitalId, setorId, start, end);
    }

    @Override
    public List<Plantao> findByDoctorAndHospital(Long doctorId, Long hospitalId) {
        return plantaoMedicoRepository.findPlantoesByMedicoResponsavelAtualIdAndHospitalId(doctorId, hospitalId);
    }

    @Override
    public List<Plantao> findByDoctorAndHospitalAndPeriod(Long doctorId, Long hospitalId, LocalDateTime start, LocalDateTime end) {
        return plantaoMedicoRepository.findPlantoesByMedicoResponsavelAtualIdAndHospitalIdAndPeriodo(doctorId, hospitalId, start, end);
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

    private void validateCreateAvulsoRequest(Long setorId, List<Long> medicoIds, LocalDateTime dataInicio,
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
        if (medicoIds.isEmpty()) {
            throw new IllegalArgumentException("Ao menos um médico é obrigatório");
        }
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (!dataInicio.isBefore(dataFim)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        if (!dataInicio.isAfter(LocalDateTime.now())) {
            throw new ConflictException("Não é possível criar plantão com início no passado");
        }
        if (escalista.getSetor() == null || escalista.getSetor().getId() == null
                || !escalista.getSetor().getId().equals(setorId)) {
            throw new IllegalArgumentException("Escalista não é responsável pelo setor informado");
        }
    }

    private void validateCreateFixoRequest(Long setorId, List<Long> medicoIds, TipoRecorrenciaPlantao tipoRecorrencia,
            String diaSemana, Integer semanaDoMes, Integer diaDoMes, LocalDate dataInicioVigencia,
            LocalDate dataFimVigencia, Manager escalista) {
        if (escalista == null) {
            throw new IllegalArgumentException("Usuário logado não possui perfil de escalista");
        }
        if (escalista.getHospital() == null || escalista.getHospital().getId() == null) {
            throw new IllegalArgumentException("Escalista sem hospital");
        }
        if (escalista.getSetor() == null || escalista.getSetor().getId() == null
                || !escalista.getSetor().getId().equals(setorId)) {
            throw new IllegalArgumentException("Escalista não é responsável pelo setor informado");
        }
        if (setorId == null) {
            throw new IllegalArgumentException("Setor is required");
        }
        if (medicoIds.isEmpty()) {
            throw new IllegalArgumentException("Ao menos um médico é obrigatório");
        }
        if (tipoRecorrencia == null) {
            throw new IllegalArgumentException("Tipo de recorrência é obrigatório");
        }
        if (dataInicioVigencia == null) {
            throw new IllegalArgumentException("Data de início da vigência é obrigatória");
        }
        if (dataFimVigencia == null) {
            throw new IllegalArgumentException("Data final da vigência é obrigatória");
        }
        if (dataFimVigencia != null && dataFimVigencia.isBefore(dataInicioVigencia)) {
            throw new IllegalArgumentException("Data final da vigência não pode ser anterior à data inicial");
        }

        switch (tipoRecorrencia) {
            case SEMANAL -> parseDiaSemana(diaSemana);
            case MENSAL_N_ESIMO_DIA_SEMANA -> {
                parseDiaSemana(diaSemana);
                if (semanaDoMes == null || semanaDoMes < 1 || semanaDoMes > 5) {
                    throw new IllegalArgumentException("Semana do mês deve estar entre 1 e 5");
                }
            }
            case MENSAL_DIA_FIXO -> {
                if (diaDoMes == null || diaDoMes < 1 || diaDoMes > 31) {
                    throw new IllegalArgumentException("Dia do mês deve estar entre 1 e 31");
                }
            }
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
        return plantaoMedicoRepository.existsConflitoHorario(
                medicoId,
                PlantaoStatus.CANCELADO,
                dataFim,
                dataInicio);
    }

    private void validateMedicoAtuaNoSetor(Doctor medico, Setor setor) {
        boolean medicoAtuaNoSetor = medicoSetorRepository
                .findByMedicoIdAndSetorIdAndAtivoTrue(medico.getId(), setor.getId())
                .isPresent();
        if (!medicoAtuaNoSetor) {
            throw new IllegalArgumentException("Médico não possui vínculo ativo com o setor informado");
        }
    }

    private void validateGenerationWindow(LocalDate dataInicioVigencia, LocalDate dataFimGeracao) {
        long dias = ChronoUnit.DAYS.between(dataInicioVigencia, dataFimGeracao);
        if (dias > 366) {
            throw new IllegalArgumentException("A geração inicial de plantões fixos deve ter no máximo 366 dias");
        }
    }

    private void validatePeriodosFuturos(List<PlantaoPeriodo> periodos) {
        LocalDateTime now = LocalDateTime.now();
        boolean hasPeriodoNoPassado = periodos.stream()
                .anyMatch(periodo -> !periodo.dataInicio().isAfter(now));

        if (hasPeriodoNoPassado) {
            throw new ConflictException("Não é possível criar plantões com início no passado");
        }
    }

    private void validateNoConflicts(Doctor medico, List<PlantaoPeriodo> periodos) {
        for (PlantaoPeriodo periodo : periodos) {
            if (hasConflitoHorario(medico.getId(), periodo.dataInicio(), periodo.dataFim())) {
                throw new ConflictException("Médico já possui plantão conflitante no período informado: "
                        + periodo.dataInicio());
            }
        }
    }

    private List<Long> normalizeMedicoIds(List<Long> medicoIds) {
        if (medicoIds == null) {
            return List.of();
        }

        Set<Long> normalized = new LinkedHashSet<>();
        medicoIds.stream()
                .filter(id -> id != null)
                .forEach(normalized::add);

        if (normalized.size() > 4) {
            throw new IllegalArgumentException("Um plantão pode ter no máximo 4 médicos");
        }
        return List.copyOf(normalized);
    }

    private List<Doctor> loadAndValidateMedicos(List<Long> medicoIds, Setor setor, List<PlantaoPeriodo> periodos) {
        if (medicoIds.isEmpty()) {
            throw new IllegalArgumentException("Ao menos um médico é obrigatório");
        }

        List<Doctor> medicos = medicoIds.stream()
                .map(medicoId -> doctorRepository.findById(medicoId)
                        .orElseThrow(() -> new IllegalArgumentException("Médico não encontrado: " + medicoId)))
                .toList();

        medicos.forEach(medico -> {
            validateMedicoAtuaNoSetor(medico, setor);
            validateNoConflicts(medico, periodos);
        });

        return medicos;
    }

    private List<PlantaoMedico> criarAlocacoes(Plantao plantao, List<Doctor> medicos, LocalDateTime now) {
        List<PlantaoMedico> alocacoes = medicos.stream()
                .map(medico -> {
                    PlantaoMedico plantaoMedico = new PlantaoMedico();
                    plantaoMedico.setPlantao(plantao);
                    plantaoMedico.setMedicoTitular(medico);
                    plantaoMedico.setMedicoResponsavelAtual(medico);
                    plantaoMedico.setStatus(PlantaoStatus.AGENDADO);
                    plantaoMedico.setCriadoEm(now);
                    plantaoMedico.setAtualizadoEm(now);
                    return plantaoMedico;
                })
                .toList();

        return plantaoMedicoRepository.saveAll(alocacoes);
    }

    private TimeRange resolveTimeRange(PlantaoTurno turno, LocalTime horaInicio, LocalTime horaFim) {
        if (turno == PlantaoTurno.DIURNO) {
            return new TimeRange(LocalTime.of(7, 0), LocalTime.of(19, 0));
        }
        if (turno == PlantaoTurno.NOTURNO) {
            return new TimeRange(LocalTime.of(19, 0), LocalTime.of(7, 0));
        }
        if (horaInicio == null || horaFim == null) {
            throw new IllegalArgumentException("Hora início e hora fim são obrigatórias para plantão fixo personalizado");
        }
        if (horaInicio.equals(horaFim)) {
            throw new IllegalArgumentException("Hora início e hora fim não podem ser iguais");
        }
        return new TimeRange(horaInicio, horaFim);
    }

    private PlantaoPeriodo toPeriodo(LocalDate data, TimeRange timeRange) {
        LocalDateTime dataInicio = data.atTime(timeRange.horaInicio());
        LocalDateTime dataFim = timeRange.horaFim().isAfter(timeRange.horaInicio())
                ? data.atTime(timeRange.horaFim())
                : data.plusDays(1).atTime(timeRange.horaFim());
        return new PlantaoPeriodo(dataInicio, dataFim);
    }

    private Plantao buildPlantaoFixo(Setor setor, Doctor medico, Manager escalista, RegraPlantaoFixo regra,
            PlantaoTurno turno, PlantaoPeriodo periodo, LocalDateTime now) {
        Plantao plantao = new Plantao();
        plantao.setSetor(setor);
        plantao.setRegraPlantaoFixo(regra);
        plantao.setMedicoTitular(medico);
        plantao.setMedicoResponsavelAtual(medico);
        plantao.setCriadoPorEscalista(escalista);
        plantao.setTipo(PlantaoTipo.FIXO);
        plantao.setTurno(turno);
        plantao.setStatus(PlantaoStatus.AGENDADO);
        plantao.setDataInicio(periodo.dataInicio());
        plantao.setDataFim(periodo.dataFim());
        plantao.setCriadoEm(now);
        plantao.setAtualizadoEm(now);
        return plantao;
    }

    private List<LocalDate> gerarDatasRecorrentes(TipoRecorrenciaPlantao tipoRecorrencia, String diaSemana,
            Integer semanaDoMes, Integer diaDoMes, LocalDate inicio, LocalDate fim) {
        return switch (tipoRecorrencia) {
            case SEMANAL -> gerarDatasSemanais(parseDiaSemana(diaSemana), inicio, fim);
            case MENSAL_N_ESIMO_DIA_SEMANA -> gerarDatasMensaisPorSemana(parseDiaSemana(diaSemana), semanaDoMes,
                    inicio, fim);
            case MENSAL_DIA_FIXO -> gerarDatasMensaisPorDiaFixo(diaDoMes, inicio, fim);
        };
    }

    private List<LocalDate> gerarDatasSemanais(DayOfWeek diaSemana, LocalDate inicio, LocalDate fim) {
        List<LocalDate> datas = new ArrayList<>();
        LocalDate current = inicio;
        while (current.getDayOfWeek() != diaSemana) {
            current = current.plusDays(1);
        }
        while (!current.isAfter(fim)) {
            datas.add(current);
            current = current.plusWeeks(1);
        }
        return datas;
    }

    private List<LocalDate> gerarDatasMensaisPorSemana(DayOfWeek diaSemana, Integer semanaDoMes, LocalDate inicio,
            LocalDate fim) {
        List<LocalDate> datas = new ArrayList<>();
        YearMonth current = YearMonth.from(inicio);
        YearMonth end = YearMonth.from(fim);

        while (!current.isAfter(end)) {
            LocalDate candidate = nthDayOfWeek(current, diaSemana, semanaDoMes);
            if (candidate != null && !candidate.isBefore(inicio) && !candidate.isAfter(fim)) {
                datas.add(candidate);
            }
            current = current.plusMonths(1);
        }
        return datas;
    }

    private List<LocalDate> gerarDatasMensaisPorDiaFixo(Integer diaDoMes, LocalDate inicio, LocalDate fim) {
        List<LocalDate> datas = new ArrayList<>();
        YearMonth current = YearMonth.from(inicio);
        YearMonth end = YearMonth.from(fim);

        while (!current.isAfter(end)) {
            if (diaDoMes <= current.lengthOfMonth()) {
                LocalDate candidate = current.atDay(diaDoMes);
                if (!candidate.isBefore(inicio) && !candidate.isAfter(fim)) {
                    datas.add(candidate);
                }
            }
            current = current.plusMonths(1);
        }
        return datas;
    }

    private LocalDate nthDayOfWeek(YearMonth yearMonth, DayOfWeek diaSemana, Integer semanaDoMes) {
        LocalDate firstDay = yearMonth.atDay(1);
        int daysToAdd = Math.floorMod(diaSemana.getValue() - firstDay.getDayOfWeek().getValue(), 7)
                + ((semanaDoMes - 1) * 7);
        LocalDate candidate = firstDay.plusDays(daysToAdd);
        return YearMonth.from(candidate).equals(yearMonth) ? candidate : null;
    }

    private DayOfWeek parseDiaSemana(String diaSemana) {
        if (diaSemana == null || diaSemana.isBlank()) {
            throw new IllegalArgumentException("Dia da semana é obrigatório para esta recorrência");
        }
        String normalized = diaSemana.trim()
                .toUpperCase(Locale.ROOT)
                .replace("Ç", "C")
                .replace("Á", "A")
                .replace("É", "E")
                .replace("Í", "I")
                .replace("Ó", "O")
                .replace("Ú", "U")
                .replace("-", "_")
                .replace(" ", "_");

        try {
            return DayOfWeek.of(Integer.parseInt(normalized));
        } catch (NumberFormatException ignored) {
            // textual formats are handled below
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Dia da semana inválido: " + diaSemana);
        }

        return switch (normalized) {
            case "MONDAY", "SEGUNDA", "SEGUNDA_FEIRA" -> DayOfWeek.MONDAY;
            case "TUESDAY", "TERCA", "TERCA_FEIRA" -> DayOfWeek.TUESDAY;
            case "WEDNESDAY", "QUARTA", "QUARTA_FEIRA" -> DayOfWeek.WEDNESDAY;
            case "THURSDAY", "QUINTA", "QUINTA_FEIRA" -> DayOfWeek.THURSDAY;
            case "FRIDAY", "SEXTA", "SEXTA_FEIRA" -> DayOfWeek.FRIDAY;
            case "SATURDAY", "SABADO" -> DayOfWeek.SATURDAY;
            case "SUNDAY", "DOMINGO" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Dia da semana inválido: " + diaSemana);
        };
    }

    private String resolveDiaSemanaParaSalvar(TipoRecorrenciaPlantao tipoRecorrencia, String diaSemana) {
        if (tipoRecorrencia == TipoRecorrenciaPlantao.MENSAL_DIA_FIXO) {
            return null;
        }
        return parseDiaSemana(diaSemana).name();
    }

    private record PlantaoPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
    }

    private record TimeRange(LocalTime horaInicio, LocalTime horaFim) {
    }
}
