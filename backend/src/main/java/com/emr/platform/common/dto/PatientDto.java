package com.emr.platform.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private UUID id;
    private String medicalRecordNumber;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String gender;
    private String email;
    private String phoneNumber;
    private String address;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private String allergies;
    private String medicalHistory;
}
