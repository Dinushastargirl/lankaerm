package com.emr.platform.audit;

import com.emr.platform.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "patient_access_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientAccessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(nullable = false)
    private String action; // e.g. VIEW_RECORD, UPDATE_DEMOGRAPHICS

    @Column(nullable = false)
    private Instant timestamp;

    @Column(name = "ip_address")
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        this.timestamp = Instant.now();
    }
}
