package com.mss.medShift.service;

import java.util.List;

import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.domain.model.Manager;
import com.mss.medShift.domain.model.MedicoSetor;

public interface DoctorService {
    Doctor findById(Long id);
    Doctor findByUsuarioId(Long usuarioId);
    Doctor findByIdAndHospitalId(Long id, Long hospitalId);
    Doctor findByIdAndHospitalIdAndSetorId(Long id, Long hospitalId, Long setorId);
    List<Doctor> findAll();
    List<Doctor> findByHospitalId(Long hospitalId);
    List<Doctor> findByHospitalIdAndSetorId(Long hospitalId, Long setorId);
    List<Doctor> findBySetorIds(List<Long> setorIds);
    List<Doctor> findLinkCandidates(Manager escalistaLogado, Long setorId, String termo);
    List<MedicoSetor> findActiveSetorLinksByDoctorIdAndHospitalId(Long doctorId, Long hospitalId);
    List<MedicoSetor> findActiveSetorLinksByDoctorIdAndSetorIds(Long doctorId, List<Long> setorIds);
    Doctor create(Doctor doctorToCreate);
    List<MedicoSetor> findSetoresVinculados(Long doctorId, Manager escalistaLogado, List<Long> setorIdsPermitidos);
    MedicoSetor vincularSetor(Long doctorId, Long setorId, Manager escalistaLogado);
    void desvincularSetor(Long doctorId, Long setorId, Manager escalistaLogado);
    Doctor update(Long id, Doctor doctorToUpdate);
    void delete(Long id);
} 
