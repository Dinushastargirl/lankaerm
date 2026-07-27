package com.emr.platform.audit;

import com.emr.platform.user.User;
import com.emr.platform.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PatientAccessLogRepository patientAccessLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void log(String username, String action, String module, String ipAddress) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            AuditLog log = AuditLog.builder()
                    .user(user)
                    .action(action)
                    .module(module)
                    .timestamp(Instant.now())
                    .ipAddress(ipAddress)
                    .build();
            auditLogRepository.save(log);
        }
    }

    @Transactional
    public void logPatientAccess(String username, UUID patientId, String action, String ipAddress) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            PatientAccessLog log = PatientAccessLog.builder()
                    .user(user)
                    .patientId(patientId)
                    .action(action)
                    .timestamp(Instant.now())
                    .ipAddress(ipAddress)
                    .build();
            patientAccessLogRepository.save(log);
        }
    }
}
