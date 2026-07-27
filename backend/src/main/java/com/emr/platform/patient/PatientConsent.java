package com.emr.platform.patient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "patient_consents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "consent_type", nullable = false)
    private String consentType; // e.g. DATA_SHARING, TREATING_AGREEMENT

    @Column(nullable = false)
    private String status; // AGREED, REVOKED

    @Column(name = "signed_at", nullable = false, updatable = false)
    private Instant signedAt;

    @PrePersist
    protected void onCreate() {
        this.signedAt = Instant.now();
    }
}
