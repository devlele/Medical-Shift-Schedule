package com.mss.medShift.controller.dto;

import com.mss.medShift.domain.model.Doctor;

public record DoctorLookupResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String crm,
        String specialty,
        Long hospitalId,
        Long setorId) {

    public static DoctorLookupResponse from(Doctor doctor) {
        var hospital = doctor.getHospital();
        var setor = doctor.getSetor();

        return new DoctorLookupResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCpf(),
                doctor.getCrm(),
                doctor.getSpecialty(),
                hospital != null ? hospital.getId() : null,
                setor != null ? setor.getId() : null);
    }
}
