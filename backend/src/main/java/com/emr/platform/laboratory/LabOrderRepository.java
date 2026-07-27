package com.emr.platform.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, UUID> {
    List<LabOrder> findByPatientId(UUID patientId);
    List<LabOrder> findByDoctorId(UUID doctorId);
    List<LabOrder> findByStatus(String status);
}
