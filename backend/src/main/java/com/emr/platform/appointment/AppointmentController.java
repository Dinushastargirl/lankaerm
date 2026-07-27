package com.emr.platform.appointment;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.AppointmentDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAllAppointments() {
        List<AppointmentDto> list = appointmentService.getAllAppointments().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list, "Appointments retrieved successfully"));
    }

    @PostMapping
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<AppointmentDto>> scheduleAppointment(@RequestBody AppointmentDto dto) {
        Appointment saved = appointmentService.scheduleAppointment(
                dto.getPatientId(),
                dto.getDoctorId(),
                dto.getAppointmentDate(),
                dto.getAppointmentTime(),
                dto.getReason()
        );
        return ResponseEntity.ok(ApiResponse.success(convertToDto(saved), "Appointment scheduled successfully"));
    }

    @PutMapping("/{id}/status")
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentStatus(
            @PathVariable UUID id,
            @RequestParam String status
    ) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(updated), "Appointment status updated"));
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        return AppointmentDto.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getFullName())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .build();
    }
}
