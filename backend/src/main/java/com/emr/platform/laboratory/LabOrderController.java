package com.emr.platform.laboratory;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.LabOrderDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/laboratory/orders")
public class LabOrderController {

    @Autowired
    private LaboratoryService laboratoryService;

    @Autowired
    private LabOrderRepository labOrderRepository;

    @GetMapping
    @RequirePermission("laboratory:read")
    public ResponseEntity<ApiResponse<List<LabOrderDto>>> getAllOrders() {
        List<LabOrderDto> list = labOrderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list, "All laboratory orders retrieved"));
    }

    @GetMapping("/patient/{patientId}")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<LabOrderDto>>> getPatientLabOrders(@PathVariable UUID patientId) {
        List<LabOrderDto> list = laboratoryService.getPatientLabOrders(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list, "Patient laboratory orders retrieved"));
    }

    @PostMapping
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<LabOrderDto>> placeLabOrder(@RequestBody LabOrderDto dto) {
        LabOrder saved = laboratoryService.placeLabOrder(
                dto.getPatientId(),
                dto.getDoctorId(),
                dto.getTestName(),
                dto.getInstructions()
        );
        return ResponseEntity.ok(ApiResponse.success(convertToDto(saved), "Laboratory request submitted"));
    }

    @PostMapping("/{id}/results")
    @RequirePermission("laboratory:write")
    public ResponseEntity<ApiResponse<LabOrderDto>> uploadLabResult(
            @PathVariable UUID id,
            @RequestParam UUID technicianId,
            @RequestParam String resultData,
            @RequestParam String comments
    ) {
        LabResult result = laboratoryService.uploadLabResult(id, technicianId, resultData, comments);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(result.getLabOrder()), "Laboratory result uploaded successfully"));
    }

    private LabOrderDto convertToDto(LabOrder order) {
        LabOrderDto.LabOrderDtoBuilder builder = LabOrderDto.builder()
                .id(order.getId())
                .patientId(order.getPatient().getId())
                .patientName(order.getPatient().getFirstName() + " " + order.getPatient().getLastName())
                .doctorId(order.getDoctor().getId())
                .doctorName(order.getDoctor().getFullName())
                .testName(order.getTestName())
                .instructions(order.getInstructions())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt());

        laboratoryService.getResultForOrder(order.getId()).ifPresent(res -> {
            builder.resultData(res.getResultData())
                   .comments(res.getComments())
                   .uploadedAt(res.getUploadedAt());
        });

        return builder.build();
    }
}
