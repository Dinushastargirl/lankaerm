package com.emr.platform.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private String invoiceNumber;
    private Double amount;
    private String status;
    private Instant createdAt;
    private List<PaymentLogDto> payments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentLogDto {
        private UUID id;
        private String paymentMethod;
        private String transactionRef;
        private Double amountPaid;
        private Instant createdAt;
    }
}
