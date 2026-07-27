package com.emr.platform.prescription;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.PrescriptionDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private MedicationRepository medicationRepository;

    @GetMapping("/patient/{patientId}")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getPatientPrescriptions(@PathVariable UUID patientId) {
        List<PrescriptionDto> list = prescriptionService.getPatientPrescriptions(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list, "Prescriptions retrieved successfully"));
    }

    @PostMapping
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<PrescriptionDto>> createPrescription(@RequestBody PrescriptionDto dto) {
        Prescription prescription = prescriptionService.createPrescription(
                dto.getPatientId(),
                dto.getDoctorId(),
                null // encounter not bound directly
        );

        if (dto.getItems() != null) {
            for (PrescriptionDto.ItemDto item : dto.getItems()) {
                prescriptionService.addPrescriptionItem(
                        prescription.getId(),
                        item.getMedicationId(),
                        item.getDosage(),
                        item.getFrequency(),
                        item.getDuration(),
                        item.getInstructions()
                );
            }
        }

        return ResponseEntity.ok(ApiResponse.success(convertToDto(prescription), "Prescription created successfully"));
    }

    @PutMapping("/{id}/dispense")
    @RequirePermission("patients:write") // pharmacists have write patients for clinical log dispense
    public ResponseEntity<ApiResponse<PrescriptionDto>> dispensePrescription(@PathVariable UUID id) {
        Prescription dispensed = prescriptionService.dispensePrescription(id);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(dispensed), "Medications dispensed and inventory updated"));
    }

    @GetMapping("/medications")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<Medication>>> listMedications() {
        List<Medication> meds = medicationRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(meds, "Medications inventory list"));
    }

    private PrescriptionDto convertToDto(Prescription prescription) {
        List<PrescriptionItem> items = prescriptionService.getPrescriptionItems(prescription.getId());
        List<PrescriptionDto.ItemDto> itemsDto = items.stream().map(item -> 
            PrescriptionDto.ItemDto.builder()
                    .id(item.getId())
                    .medicationId(item.getMedication().getId())
                    .medicationName(item.getMedication().getName())
                    .medicationCode(item.getMedication().getCode())
                    .dosage(item.getDosage())
                    .frequency(item.getFrequency())
                    .duration(item.getDuration())
                    .instructions(item.getInstructions())
                    .build()
        ).collect(Collectors.toList());

        return PrescriptionDto.builder()
                .id(prescription.getId())
                .patientId(prescription.getPatient().getId())
                .patientName(prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName())
                .doctorId(prescription.getDoctor().getId())
                .doctorName(prescription.getDoctor().getFullName())
                .status(prescription.getStatus())
                .createdAt(prescription.getCreatedAt())
                .items(itemsDto)
                .build();
    }
}
