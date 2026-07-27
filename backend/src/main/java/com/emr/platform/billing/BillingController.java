package com.emr.platform.billing;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.common.dto.BillingDto;
import com.emr.platform.auth.RequirePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping("/invoices/patient/{patientId}")
    @RequirePermission("patients:read")
    public ResponseEntity<ApiResponse<List<BillingDto>>> getPatientInvoices(@PathVariable UUID patientId) {
        List<BillingDto> list = billingService.getPatientInvoices(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list, "Patient invoices retrieved successfully"));
    }

    @PostMapping("/invoices")
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<BillingDto>> generateInvoice(
            @RequestParam UUID patientId,
            @RequestParam Double amount
    ) {
        Invoice invoice = billingService.generateInvoice(patientId, amount);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(invoice), "Invoice generated successfully"));
    }

    @PostMapping("/invoices/{invoiceId}/payments")
    @RequirePermission("patients:write")
    public ResponseEntity<ApiResponse<BillingDto>> processPayment(
            @PathVariable UUID invoiceId,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String transactionRef,
            @RequestParam Double amountPaid
    ) {
        Payment payment = billingService.processPayment(invoiceId, paymentMethod, transactionRef, amountPaid);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(payment.getInvoice()), "Payment processed and logged"));
    }

    private BillingDto convertToDto(Invoice invoice) {
        List<Payment> payments = billingService.getInvoicePayments(invoice.getId());
        List<BillingDto.PaymentLogDto> paymentLogs = payments.stream().map(p -> 
            BillingDto.PaymentLogDto.builder()
                    .id(p.getId())
                    .paymentMethod(p.getPaymentMethod())
                    .transactionRef(p.getTransactionRef())
                    .amountPaid(p.getAmountPaid())
                    .createdAt(p.getCreatedAt())
                    .build()
        ).collect(Collectors.toList());

        return BillingDto.builder()
                .id(invoice.getId())
                .patientId(invoice.getPatient().getId())
                .patientName(invoice.getPatient().getFirstName() + " " + invoice.getPatient().getLastName())
                .invoiceNumber(invoice.getInvoiceNumber())
                .amount(invoice.getAmount())
                .status(invoice.getStatus())
                .createdAt(invoice.getCreatedAt())
                .payments(paymentLogs)
                .build();
    }
}
