package com.emr.platform.billing;

import com.emr.platform.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BillingService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<Invoice> getPatientInvoices(UUID patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public Optional<Invoice> getInvoiceById(UUID id) {
        return invoiceRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Payment> getInvoicePayments(UUID invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }

    @Transactional
    public Invoice generateInvoice(UUID patientId, Double amount) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        String invoiceNum = "INV-" + System.currentTimeMillis();

        Invoice invoice = Invoice.builder()
                .patient(patient)
                .invoiceNumber(invoiceNum)
                .amount(amount)
                .status("UNPAID")
                .build();

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Payment processPayment(UUID invoiceId, String method, String txRef, Double amountPaid) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        if ("PAID".equals(invoice.getStatus())) {
            throw new IllegalStateException("Invoice is already fully paid");
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .paymentMethod(method.toUpperCase())
                .transactionRef(txRef)
                .amountPaid(amountPaid)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Calculate sum of payments to determine status
        List<Payment> payments = paymentRepository.findByInvoiceId(invoiceId);
        double totalPaid = payments.stream().mapToDouble(Payment::getAmountPaid).sum();

        if (totalPaid >= invoice.getAmount()) {
            invoice.setStatus("PAID");
        } else if (totalPaid > 0) {
            invoice.setStatus("PARTIALLY_PAID");
        }
        invoiceRepository.save(invoice);

        return savedPayment;
    }
}
