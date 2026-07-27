package com.emr.platform.encounter;

import com.emr.platform.patient.PatientRepository;
import com.emr.platform.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EncounterService {

    @Autowired
    private EncounterRepository encounterRepository;

    @Autowired
    private VitalsRepository vitalsRepository;

    @Autowired
    private DiagnosisRepository diagnosisRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Encounter> getPatientEncounters(UUID patientId) {
        return encounterRepository.findByPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public Optional<Encounter> getEncounterById(UUID id) {
        return encounterRepository.findById(id);
    }

    @Transactional
    public Encounter createEncounter(UUID patientId, UUID doctorId, String notes, String plan) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        var doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Encounter encounter = Encounter.builder()
                .patient(patient)
                .doctor(doctor)
                .clinicalNotes(notes)
                .treatmentPlan(plan)
                .build();

        return encounterRepository.save(encounter);
    }

    @Transactional
    public Vitals recordVitals(UUID encounterId, String bp, String hr, String temp, String rr) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new IllegalArgumentException("Encounter not found"));

        Vitals vitals = Vitals.builder()
                .encounter(encounter)
                .bloodPressure(bp)
                .heartRate(hr)
                .temperature(temp)
                .respiratoryRate(rr)
                .build();

        return vitalsRepository.save(vitals);
    }

    @Transactional
    public Diagnosis addDiagnosis(UUID encounterId, String icd10, String desc, String severity) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new IllegalArgumentException("Encounter not found"));

        Diagnosis diagnosis = Diagnosis.builder()
                .encounter(encounter)
                .icd10Code(icd10)
                .description(desc)
                .severity(severity.toUpperCase())
                .build();

        return diagnosisRepository.save(diagnosis);
    }
}
