package com.emr.platform.prescription;

import com.emr.platform.encounter.EncounterRepository;
import com.emr.platform.patient.PatientRepository;
import com.emr.platform.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PrescriptionItemRepository prescriptionItemRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EncounterRepository encounterRepository;

    @Transactional(readOnly = true)
    public List<Prescription> getPatientPrescriptions(UUID patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public Optional<Prescription> getPrescriptionById(UUID id) {
        return prescriptionRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<PrescriptionItem> getPrescriptionItems(UUID prescriptionId) {
        return prescriptionItemRepository.findByPrescriptionId(prescriptionId);
    }

    @Transactional
    public Prescription createPrescription(UUID patientId, UUID doctorId, UUID encounterId) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        var doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        var encounter = encounterId != null ? encounterRepository.findById(encounterId).orElse(null) : null;

        Prescription prescription = Prescription.builder()
                .patient(patient)
                .doctor(doctor)
                .encounter(encounter)
                .status("ACTIVE")
                .build();

        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public PrescriptionItem addPrescriptionItem(UUID prescriptionId, UUID medicationId, String dosage, String freq, String duration, String instructions) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));

        if (medication.getStockQuantity() <= 0) {
            throw new IllegalStateException("Medication is currently out of stock: " + medication.getName());
        }

        PrescriptionItem item = PrescriptionItem.builder()
                .prescription(prescription)
                .medication(medication)
                .dosage(dosage)
                .frequency(freq)
                .duration(duration)
                .instructions(instructions)
                .build();

        return prescriptionItemRepository.save(item);
    }

    @Transactional
    public Prescription dispensePrescription(UUID prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));

        if (!"ACTIVE".equals(prescription.getStatus())) {
            throw new IllegalStateException("Prescription is not active for dispensing, status: " + prescription.getStatus());
        }

        List<PrescriptionItem> items = prescriptionItemRepository.findByPrescriptionId(prescriptionId);
        
        // Deduct inventory stock for each item prescribed
        for (PrescriptionItem item : items) {
            Medication med = item.getMedication();
            int newStock = med.getStockQuantity() - 1; // Assuming dispensing single packaging unit for demo
            if (newStock < 0) {
                throw new IllegalStateException("Insufficient stock for: " + med.getName());
            }
            med.setStockQuantity(newStock);
            medicationRepository.save(med);
        }

        prescription.setStatus("DISPENSED");
        return prescriptionRepository.save(prescription);
    }
}
