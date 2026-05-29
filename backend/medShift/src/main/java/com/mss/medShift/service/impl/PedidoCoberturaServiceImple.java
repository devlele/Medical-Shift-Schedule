package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.PedidoCobertura;
import com.mss.medShift.domain.model.PedidoCoberturaStatus;
import com.mss.medShift.domain.model.Plantao;
import com.mss.medShift.domain.model.PlantaoMedico;
import com.mss.medShift.domain.model.PlantaoStatus;
import com.mss.medShift.domain.repository.MedicoSetorRepository;
import com.mss.medShift.domain.repository.PedidoCoberturaRepository;
import com.mss.medShift.domain.repository.PlantaoMedicoRepository;
import com.mss.medShift.domain.repository.PlantaoRepository;
import com.mss.medShift.service.NotificacaoService;
import com.mss.medShift.service.PedidoCoberturaService;
import com.mss.medShift.service.exception.ConflictException;

@Service
public class PedidoCoberturaServiceImple implements PedidoCoberturaService {

    private final PedidoCoberturaRepository pedidoCoberturaRepository;
    private final PlantaoRepository plantaoRepository;
    private final PlantaoMedicoRepository plantaoMedicoRepository;
    private final MedicoSetorRepository medicoSetorRepository;
    private final NotificacaoService notificacaoService;

    public PedidoCoberturaServiceImple(PedidoCoberturaRepository pedidoCoberturaRepository,
            PlantaoRepository plantaoRepository, PlantaoMedicoRepository plantaoMedicoRepository,
            MedicoSetorRepository medicoSetorRepository,
            NotificacaoService notificacaoService) {
        this.pedidoCoberturaRepository = pedidoCoberturaRepository;
        this.plantaoRepository = plantaoRepository;
        this.plantaoMedicoRepository = plantaoMedicoRepository;
        this.medicoSetorRepository = medicoSetorRepository;
        this.notificacaoService = notificacaoService;
    }

    @Override
    @Transactional
    public PedidoCobertura abrirPedido(Long plantaoId, Doctor medicoSolicitante) {
        return abrirPedido(plantaoId, null, medicoSolicitante);
    }

    @Override
    @Transactional
    public PedidoCobertura abrirPedido(Long plantaoId, Long plantaoMedicoId, Doctor medicoSolicitante) {
        if (plantaoId == null) {
            throw new IllegalArgumentException("Plantão é obrigatório");
        }
        if (medicoSolicitante == null || medicoSolicitante.getId() == null) {
            throw new IllegalArgumentException("Médico solicitante é obrigatório");
        }

        Plantao plantao = plantaoRepository.findById(plantaoId)
                .orElseThrow(() -> new NoSuchElementException("Plantão não encontrado"));
        PlantaoMedico plantaoMedico = resolvePlantaoMedico(plantao, plantaoMedicoId, medicoSolicitante);
        validatePlantaoPodeSerOfertado(plantaoMedico, medicoSolicitante);

        pedidoCoberturaRepository.findByPlantaoMedicoIdAndStatus(plantaoMedico.getId(), PedidoCoberturaStatus.ABERTO)
                .ifPresent(pedido -> {
                    throw new ConflictException("Já existe pedido de cobertura aberto para esta atribuição");
                });

        LocalDateTime now = LocalDateTime.now();
        PedidoCobertura pedido = new PedidoCobertura();
        pedido.setPlantaoMedico(plantaoMedico);
        pedido.setMedicoSolicitante(medicoSolicitante);
        pedido.setStatus(PedidoCoberturaStatus.ABERTO);
        pedido.setAbertoEm(now);
        pedido.setAtualizadoEm(now);

        return pedidoCoberturaRepository.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoCobertura> findDisponiveisParaMedico(Doctor medico) {
        if (medico == null || medico.getId() == null) {
            throw new IllegalArgumentException("Médico é obrigatório");
        }

        List<Long> setorIds = resolveSetorIdsAtivos(medico);
        if (setorIds.isEmpty()) {
            return List.of();
        }

        return pedidoCoberturaRepository.findBySetorIdInAndStatusOrderByAbertoEmDesc(setorIds, PedidoCoberturaStatus.ABERTO)
                .stream()
                .filter(pedido -> pedido.getMedicoSolicitante() != null)
                .filter(pedido -> !medico.getId().equals(pedido.getMedicoSolicitante().getId()))
                .filter(pedido -> pedido.getPlantao() != null && PlantaoStatus.AGENDADO.equals(pedido.getPlantao().getStatus()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoCobertura> findSolicitadosPorMedico(Doctor medico) {
        if (medico == null || medico.getId() == null) {
            throw new IllegalArgumentException("Médico é obrigatório");
        }
        return pedidoCoberturaRepository.findByMedicoSolicitanteIdOrderByAbertoEmDesc(medico.getId());
    }

    @Override
    @Transactional
    public PedidoCobertura assumir(Long pedidoId, Doctor medicoCobridor) {
        if (pedidoId == null) {
            throw new IllegalArgumentException("Pedido de cobertura é obrigatório");
        }
        if (medicoCobridor == null || medicoCobridor.getId() == null) {
            throw new IllegalArgumentException("Médico cobridor é obrigatório");
        }

        PedidoCobertura pedido = pedidoCoberturaRepository.findByIdForUpdate(pedidoId)
                .orElseThrow(() -> new NoSuchElementException("Pedido de cobertura não encontrado"));
        validatePedidoPodeSerAssumido(pedido, medicoCobridor);

        LocalDateTime now = LocalDateTime.now();
        PlantaoMedico plantaoMedico = pedido.getPlantaoMedico();
        Plantao plantao = plantaoMedico.getPlantao();
        plantaoMedico.setMedicoResponsavelAtual(medicoCobridor);
        plantaoMedico.setAtualizadoEm(now);
        if (plantao.getMedicoResponsavelAtual() != null
                && pedido.getMedicoSolicitante() != null
                && plantao.getMedicoResponsavelAtual().getId().equals(pedido.getMedicoSolicitante().getId())) {
            plantao.setMedicoResponsavelAtual(medicoCobridor);
            plantao.setAtualizadoEm(now);
        }

        pedido.setMedicoCobridor(medicoCobridor);
        pedido.setStatus(PedidoCoberturaStatus.ASSUMIDO);
        pedido.setAssumidoEm(now);
        pedido.setAtualizadoEm(now);

        plantaoMedicoRepository.save(plantaoMedico);
        plantaoRepository.save(plantao);
        PedidoCobertura pedidoAssumido = pedidoCoberturaRepository.save(pedido);
        notificacaoService.criarCoberturaAssumida(pedidoAssumido);
        return pedidoAssumido;
    }

    @Override
    @Transactional
    public PedidoCobertura cancelar(Long pedidoId, Doctor medicoSolicitante) {
        if (pedidoId == null) {
            throw new IllegalArgumentException("Pedido de cobertura é obrigatório");
        }
        if (medicoSolicitante == null || medicoSolicitante.getId() == null) {
            throw new IllegalArgumentException("Médico solicitante é obrigatório");
        }

        PedidoCobertura pedido = pedidoCoberturaRepository.findById(pedidoId)
                .orElseThrow(() -> new NoSuchElementException("Pedido de cobertura não encontrado"));
        if (pedido.getMedicoSolicitante() == null
                || !medicoSolicitante.getId().equals(pedido.getMedicoSolicitante().getId())) {
            throw new IllegalArgumentException("Apenas o médico solicitante pode cancelar este pedido");
        }
        if (!PedidoCoberturaStatus.ABERTO.equals(pedido.getStatus())) {
            throw new ConflictException("Apenas pedidos abertos podem ser cancelados");
        }

        LocalDateTime now = LocalDateTime.now();
        pedido.setStatus(PedidoCoberturaStatus.CANCELADO);
        pedido.setCanceladoEm(now);
        pedido.setAtualizadoEm(now);
        return pedidoCoberturaRepository.save(pedido);
    }

    private void validatePedidoPodeSerAssumido(PedidoCobertura pedido, Doctor medicoCobridor) {
        if (!PedidoCoberturaStatus.ABERTO.equals(pedido.getStatus())) {
            throw new ConflictException("Apenas pedidos abertos podem ser assumidos");
        }
        if (pedido.getMedicoSolicitante() == null) {
            throw new IllegalArgumentException("Pedido sem médico solicitante");
        }
        if (medicoCobridor.getId().equals(pedido.getMedicoSolicitante().getId())) {
            throw new IllegalArgumentException("O médico solicitante não pode assumir o próprio pedido");
        }

        PlantaoMedico plantaoMedico = pedido.getPlantaoMedico();
        if (plantaoMedico == null) {
            throw new IllegalArgumentException("Pedido sem atribuição médica vinculada");
        }
        if (plantaoMedico.getMedicoResponsavelAtual() == null) {
            throw new IllegalArgumentException("Atribuição sem médico responsável atual");
        }
        Plantao plantao = plantaoMedico.getPlantao();
        if (plantao == null) {
            throw new IllegalArgumentException("Atribuição sem plantão vinculado");
        }
        if (!PlantaoStatus.AGENDADO.equals(plantao.getStatus())) {
            throw new IllegalArgumentException("Plantão precisa estar agendado para ser assumido");
        }
        if (!PlantaoStatus.AGENDADO.equals(plantaoMedico.getStatus())) {
            throw new IllegalArgumentException("Atribuição precisa estar agendada para ser assumida");
        }
        if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
            throw new IllegalArgumentException("Plantão sem setor vinculado");
        }
        if (plantao.getDataInicio() == null || plantao.getDataFim() == null) {
            throw new IllegalArgumentException("Plantão sem período definido");
        }
        if (!resolveSetorIdsAtivos(medicoCobridor).contains(plantao.getSetor().getId())) {
            throw new IllegalArgumentException("Médico cobridor não possui vínculo ativo com o setor do plantão");
        }
        if (hasConflitoHorario(medicoCobridor.getId(), plantao.getDataInicio(), plantao.getDataFim())) {
            throw new ConflictException("Médico cobridor já possui plantão conflitante no período informado");
        }
    }

    private void validatePlantaoPodeSerOfertado(PlantaoMedico plantaoMedico, Doctor medicoSolicitante) {
        Plantao plantao = plantaoMedico.getPlantao();
        if (!PlantaoStatus.AGENDADO.equals(plantao.getStatus())) {
            throw new IllegalArgumentException("Plantão precisa estar agendado para receber pedido de cobertura");
        }
        if (!PlantaoStatus.AGENDADO.equals(plantaoMedico.getStatus())) {
            throw new IllegalArgumentException("Atribuição precisa estar agendada para receber pedido de cobertura");
        }
        if (plantaoMedico.getMedicoResponsavelAtual() == null
                || !medicoSolicitante.getId().equals(plantaoMedico.getMedicoResponsavelAtual().getId())) {
            throw new IllegalArgumentException("Apenas o médico responsável atual pode abrir pedido de cobertura");
        }
        if (plantao.getSetor() == null || plantao.getSetor().getId() == null) {
            throw new IllegalArgumentException("Plantão sem setor vinculado");
        }
        if (plantao.getDataInicio() == null || plantao.getDataFim() == null) {
            throw new IllegalArgumentException("Plantão sem período definido");
        }
        if (!resolveSetorIdsAtivos(medicoSolicitante).contains(plantao.getSetor().getId())) {
            throw new IllegalArgumentException("Médico solicitante não possui vínculo ativo com o setor do plantão");
        }
    }

    private List<Long> resolveSetorIdsAtivos(Doctor medico) {
        List<Long> setorIds = new ArrayList<>();

        medicoSetorRepository.findByMedicoIdAndAtivoTrue(medico.getId()).stream()
                .map(vinculo -> vinculo.getSetor() != null ? vinculo.getSetor().getId() : null)
                .filter(id -> id != null)
                .forEach(setorIds::add);

        if (medico.getSetor() != null && medico.getSetor().getId() != null) {
            setorIds.add(medico.getSetor().getId());
        }

        return setorIds.stream().distinct().toList();
    }

    private PlantaoMedico resolvePlantaoMedico(Plantao plantao, Long plantaoMedicoId, Doctor medicoSolicitante) {
        if (plantaoMedicoId != null) {
            PlantaoMedico plantaoMedico = plantaoMedicoRepository.findById(plantaoMedicoId)
                    .orElseThrow(() -> new NoSuchElementException("Atribuição médica não encontrada"));
            if (plantaoMedico.getPlantao() == null || !plantao.getId().equals(plantaoMedico.getPlantao().getId())) {
                throw new IllegalArgumentException("Atribuição médica não pertence ao plantão informado");
            }
            return plantaoMedico;
        }

        return plantaoMedicoRepository
                .findByPlantaoIdAndMedicoResponsavelAtualId(plantao.getId(), medicoSolicitante.getId())
                .or(() -> plantaoMedicoRepository.findByPlantaoIdAndMedicoTitularId(plantao.getId(), medicoSolicitante.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Médico não possui atribuição neste plantão"));
    }

    private boolean hasConflitoHorario(Long medicoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return plantaoMedicoRepository.existsConflitoHorario(
                medicoId,
                PlantaoStatus.CANCELADO,
                dataFim,
                dataInicio);
    }
}
