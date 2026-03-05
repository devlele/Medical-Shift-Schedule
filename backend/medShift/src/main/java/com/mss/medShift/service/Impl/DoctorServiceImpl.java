package com.mss.medShift.service.Impl;

import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.mss.medShift.domain.repository.DoctorRepository;
import com.mss.medShift.domain.model.Doctor;
import com.mss.medShift.service.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor findById(Long id) {
        return doctorRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Doctor create(Doctor doctorToCreate) {
        if(doctorRepository.existsByCrm(doctorToCreate.getCrm())) {
            throw new IllegalArgumentException("This CRM is already registered");
        }

        return doctorRepository.save(doctorToCreate);
    }

    @Override
    public void delete(Long id) {
        if(doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
        }
        throw new NoSuchElementException("Id not founded");
    }
}
