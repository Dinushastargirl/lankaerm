package com.emr.platform.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Optional<Patient> findByMedicalRecordNumber(String medicalRecordNumber);
    Optional<Patient> findByEmail(String email);
}
