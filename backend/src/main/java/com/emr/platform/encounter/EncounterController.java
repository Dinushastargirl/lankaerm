package com.emr.platform.encounter;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.EncounterDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/encounters")
public class EncounterController {

    @Autowired
    private EncounterService encounterService;

    @Autowired
    private VitalsRepository vitalsRepository;

    @Autowired
    private DiagnosisRepository diagnosisRepository;

    @GetMapping("/patient/{patientId}")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<EncounterDto>>> getPatientEncounters(@PathVariable UUID patientId) {
        List<EncounterDto> encounters = encounterService.getPatientEncounters(patientId).stream()
                .map(enc -> {
                    Vitals vitals = vitalsRepository.findByEncounterId(enc.getId()).orElse(null);
                    List<Diagnosis> diagnoses = diagnosisRepository.findByEncounterId(enc.getId());
                    Diagnosis diag = diagnoses.isEmpty() ? null : diagnoses.get(0); // support first for simplifed workspace DTO
                    return convertToDto(enc, vitals, diag);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(encounters, "Patient encounters retrieved"));
    }

    @PostMapping
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<EncounterDto>> createEncounter(@RequestBody EncounterDto dto) {
        Encounter encounter = encounterService.createEncounter(
                dto.getPatientId(),
                dto.getDoctorId(),
                dto.getClinicalNotes(),
                dto.getTreatmentPlan()
        );

        Vitals vitals = null;
        if (dto.getBloodPressure() != null && !dto.getBloodPressure().isBlank()) {
            vitals = encounterService.recordVitals(
                    encounter.getId(),
                    dto.getBloodPressure(),
                    dto.getHeartRate(),
                    dto.getTemperature(),
                    dto.getRespiratoryRate()
            );
        }

        Diagnosis diagnosis = null;
        if (dto.getIcd10Code() != null && !dto.getIcd10Code().isBlank()) {
            diagnosis = encounterService.addDiagnosis(
                    encounter.getId(),
                    dto.getIcd10Code(),
                    dto.getDiagnosisDescription(),
                    dto.getSeverity()
            );
        }

        EncounterDto responseDto = convertToDto(encounter, vitals, diagnosis);
        return ResponseEntity.ok(ApiResponse.success(responseDto, "Clinical encounter recorded successfully"));
    }

    private EncounterDto convertToDto(Encounter encounter, Vitals vitals, Diagnosis diagnosis) {
        EncounterDto.EncounterDtoBuilder builder = EncounterDto.builder()
                .id(encounter.getId())
                .patientId(encounter.getPatient().getId())
                .patientName(encounter.getPatient().getFirstName() + " " + encounter.getPatient().getLastName())
                .doctorId(encounter.getDoctor().getId())
                .doctorName(encounter.getDoctor().getFullName())
                .clinicalNotes(encounter.getClinicalNotes())
                .treatmentPlan(encounter.getTreatmentPlan())
                .createdAt(encounter.getCreatedAt());

        if (vitals != null) {
            builder.bloodPressure(vitals.getBloodPressure())
                    .heartRate(vitals.getHeartRate())
                    .temperature(vitals.getTemperature())
                    .respiratoryRate(vitals.getRespiratoryRate());
        }

        if (diagnosis != null) {
            builder.icd10Code(diagnosis.getIcd10Code())
                    .diagnosisDescription(diagnosis.getDescription())
                    .severity(diagnosis.getSeverity());
        }

        return builder.build();
    }
}
