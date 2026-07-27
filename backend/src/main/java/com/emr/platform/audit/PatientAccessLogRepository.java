package com.emr.platform.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientAccessLogRepository extends JpaRepository<PatientAccessLog, UUID> {
    List<PatientAccessLog> findByPatientId(UUID patientId);
    List<PatientAccessLog> findByUserId(UUID userId);
}
