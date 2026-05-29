package com.mss.medShift.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.repository.EscalistaSetorRepository;
import com.mss.medShift.domain.repository.ManagerRepository;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.service.SetorService;
import com.mss.medShift.service.exception.ConflictException;

@Service
public class SetorServiceImple implements SetorService {

    private final SetorRepository setorRepository;
    private final ManagerRepository managerRepository;
    private final EscalistaSetorRepository escalistaSetorRepository;

    public SetorServiceImple(SetorRepository setorRepository, ManagerRepository managerRepository,
            EscalistaSetorRepository escalistaSetorRepository) {
        this.setorRepository = setorRepository;
        this.managerRepository = managerRepository;
        this.escalistaSetorRepository = escalistaSetorRepository;
    }

    @Override
    public Setor create(Setor setor, Hospital hospitalLogado) {
        setor.setHospital(hospitalLogado);
        return setorRepository.save(setor);
    }

    @Override
    public Setor findById(Long id) {
        return setorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Setor não encontrado"));
    }

    @Override
    public Setor findById(Long id, Hospital hospitalLogado) {
        return setorRepository.findByIdAndHospitalId(id, hospitalLogado.getId())
                .orElseThrow(() -> new NoSuchElementException("Setor não encontrado para o hospital logado"));
    }

    @Override
    public List<Setor> findByHospitalId(Long hospitalId) {
        return setorRepository.findByHospitalId(hospitalId).stream()
                .filter(this::isAtivo)
                .toList();
    }

    @Override
    public Setor update(Long id, Setor setor) {
        Setor existingSetor = findById(id);
        return updateFields(existingSetor, setor);
    }

    @Override
    public Setor update(Long id, Setor setor, Hospital hospitalLogado) {
        Setor existingSetor = findById(id, hospitalLogado);
        return updateFields(existingSetor, setor);
    }

    private Setor updateFields(Setor existingSetor, Setor setor) {
        
        if (setor.getNome() != null) {
            existingSetor.setNome(setor.getNome());
        }
        if (setor.getDescricao() != null) {
            existingSetor.setDescricao(setor.getDescricao());
        }
        
        return setorRepository.save(existingSetor);
    }

    @Override
    public void delete(Long id) {
        Setor setor = findById(id);
        if (hasEscalistaAtivoAssociado(setor)) {
            throw new ConflictException(
                    "Não é possível excluir este setor porque há um escalista ativo responsável. Remova ou transfira o escalista antes.");
        }

        LocalDateTime now = LocalDateTime.now();

        escalistaSetorRepository.findBySetorIdAndAtivoTrue(setor.getId())
                .forEach(vinculo -> {
                    vinculo.setAtivo(false);
                    vinculo.setDesvinculadoEm(now);
                    escalistaSetorRepository.save(vinculo);
                });

        setor.setAtivo(false);
        setor.setAtualizadoEm(now);
        setorRepository.save(setor);
    }

    private boolean hasEscalistaAtivoAssociado(Setor setor) {
        return managerRepository.findAllBySetorId(setor.getId()).stream()
                .anyMatch(this::isAtivo);
    }

    private boolean isAtivo(Setor setor) {
        return setor.getAtivo() == null || setor.getAtivo();
    }

    private boolean isAtivo(Manager manager) {
        return manager.getAtivo() == null || manager.getAtivo();
    }
}
