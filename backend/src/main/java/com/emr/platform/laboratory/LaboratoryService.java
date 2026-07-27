package com.emr.platform.laboratory;

import com.emr.platform.patient.PatientRepository;
import com.emr.platform.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LaboratoryService {

    @Autowired
    private LabOrderRepository labOrderRepository;

    @Autowired
    private LabResultRepository labResultRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LabOrder> getPatientLabOrders(UUID patientId) {
        return labOrderRepository.findByPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public Optional<LabOrder> getLabOrderById(UUID id) {
        return labOrderRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<LabResult> getResultForOrder(UUID orderId) {
        return labResultRepository.findByLabOrderId(orderId);
    }

    @Transactional
    public LabOrder placeLabOrder(UUID patientId, UUID doctorId, String testName, String instructions) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        var doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        LabOrder order = LabOrder.builder()
                .patient(patient)
                .doctor(doctor)
                .testName(testName)
                .instructions(instructions)
                .status("PENDING")
                .build();

        return labOrderRepository.save(order);
    }

    @Transactional
    public LabResult uploadLabResult(UUID orderId, UUID technicianId, String resultData, String comments) {
        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Lab order not found"));
        var technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found"));

        if ("COMPLETED".equals(order.getStatus())) {
            throw new IllegalStateException("Lab order has already been completed");
        }

        LabResult result = LabResult.builder()
                .labOrder(order)
                .technician(technician)
                .resultData(resultData)
                .comments(comments)
                .build();

        order.setStatus("COMPLETED");
        labOrderRepository.save(order);

        return labResultRepository.save(result);
    }
}
