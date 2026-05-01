package com.mss.medShift.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Setor;
import com.mss.medShift.domain.repository.SetorRepository;
import com.mss.medShift.service.SetorService;

@Service
public class SetorServiceImple implements SetorService {

    private final SetorRepository setorRepository;

    public SetorServiceImple(SetorRepository setorRepository) {
        this.setorRepository = setorRepository;
    }

    @Override
    public Setor create(Setor setor, Hospital hospitalLogado) {
        setor.setHospital(hospitalLogado);
        return setorRepository.save(setor);
    }

    @Override
    public Setor findById(Long id) {
        return setorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setor não encontrado"));
    }

    @Override
    public Setor findById(Long id, Hospital hospitalLogado) {
        return setorRepository.findByIdAndHospitalId(id, hospitalLogado.getId())
                .orElseThrow(() -> new RuntimeException("Setor não encontrado para o hospital logado"));
    }

    @Override
    public List<Setor> findByHospitalId(Long hospitalId) {
        return setorRepository.findByHospitalId(hospitalId);
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
        setorRepository.delete(setor);
    }
}
