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
public class LabOrderDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private String testName;
    private String instructions;
    private String status;
    private Instant createdAt;

    // Result fields (null if pending)
    private String resultData;
    private String comments;
    private Instant uploadedAt;
}
