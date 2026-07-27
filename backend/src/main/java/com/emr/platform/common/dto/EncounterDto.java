package com.emr.platform.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EncounterDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private String clinicalNotes;
    private String treatmentPlan;
    private Instant createdAt;

    // Vitals subfields
    private String bloodPressure;
    private String heartRate;
    private String temperature;
    private String respiratoryRate;

    // Diagnosis subfields
    private String icd10Code;
    private String diagnosisDescription;
    private String severity;
}
