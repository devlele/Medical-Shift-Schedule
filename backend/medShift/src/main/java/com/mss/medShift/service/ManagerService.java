package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Hospital;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.EscalistaSetor;
import com.mss.medShift.domain.model.Usuario;

public interface ManagerService {
    Manager findById(Long id);
    Manager findByUsuarioId(Long usuarioId);
    Manager findById(Long id, Hospital hospitalLogado);
    List<Manager> findByHospitalId(Long hospitalId);
    Manager create(Manager managerToCreate);
    Manager create(Manager managerToCreate, Hospital hospitalLogado);
    List<EscalistaSetor> findSetoresVinculados(Long managerId, Hospital hospitalLogado);
    EscalistaSetor vincularSetor(Long managerId, Long setorId, Hospital hospitalLogado, Usuario usuarioLogado);
    void desvincularSetor(Long managerId, Long setorId, Hospital hospitalLogado);
    Manager update(Long id, Manager managerToUpdate);
    void delete(Long id);
}
