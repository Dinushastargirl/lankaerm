package com.emr.platform.patient;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.PatientDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<PatientDto>>> getAllPatients() {
        List<PatientDto> patients = patientService.getAllPatients().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(patients, "Patient list retrieved successfully"));
    }

    @GetMapping("/{id}")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientById(@PathVariable UUID id) {
        PatientDto patient = patientService.getPatientById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.success(patient, "Patient details retrieved"));
    }

    @PostMapping
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<PatientDto>> registerPatient(@RequestBody PatientDto dto) {
        Patient patient = convertToEntity(dto);
        Patient saved = patientService.registerPatient(patient);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(saved), "Patient registered successfully"));
    }

    @PutMapping("/{id}")
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<PatientDto>> updatePatient(@PathVariable UUID id, @RequestBody PatientDto dto) {
        Patient patientDetails = convertToEntity(dto);
        Patient updated = patientService.updatePatient(id, patientDetails);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(updated), "Patient record updated successfully"));
    }

    private PatientDto convertToDto(Patient patient) {
        return PatientDto.builder()
                .id(patient.getId())
                .medicalRecordNumber(patient.getMedicalRecordNumber())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .insuranceProvider(patient.getInsuranceProvider())
                .insurancePolicyNumber(patient.getInsurancePolicyNumber())
                .allergies(patient.getAllergies())
                .medicalHistory(patient.getMedicalHistory())
                .build();
    }

    private Patient convertToEntity(PatientDto dto) {
        return Patient.builder()
                .medicalRecordNumber(dto.getMedicalRecordNumber())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .insuranceProvider(dto.getInsuranceProvider())
                .insurancePolicyNumber(dto.getInsurancePolicyNumber())
                .allergies(dto.getAllergies())
                .medicalHistory(dto.getMedicalHistory())
                .build();
    }
}
