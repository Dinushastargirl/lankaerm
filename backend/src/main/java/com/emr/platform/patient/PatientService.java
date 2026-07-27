package com.emr.platform.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Patient> getPatientById(UUID id) {
        return patientRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Patient> getPatientByMrn(String mrn) {
        return patientRepository.findByMedicalRecordNumber(mrn);
    }

    @Transactional
    public Patient registerPatient(Patient patient) {
        if (patientRepository.findByMedicalRecordNumber(patient.getMedicalRecordNumber()).isPresent()) {
            throw new IllegalArgumentException("Medical Record Number already registered");
        }
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        return patientRepository.save(patient);
    }

    @Transactional
    public Patient updatePatient(UUID id, Patient updatedDetails) {
        return patientRepository.findById(id).map(patient -> {
            patient.setFirstName(updatedDetails.getFirstName());
            patient.setLastName(updatedDetails.getLastName());
            patient.setDateOfBirth(updatedDetails.getDateOfBirth());
            patient.setGender(updatedDetails.getGender());
            patient.setPhoneNumber(updatedDetails.getPhoneNumber());
            patient.setAddress(updatedDetails.getAddress());
            patient.setInsuranceProvider(updatedDetails.getInsuranceProvider());
            patient.setInsurancePolicyNumber(updatedDetails.getInsurancePolicyNumber());
            patient.setAllergies(updatedDetails.getAllergies());
            patient.setMedicalHistory(updatedDetails.getMedicalHistory());
            return patientRepository.save(patient);
        }).orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + id));
    }
}
