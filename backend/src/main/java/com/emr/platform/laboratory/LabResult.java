package com.emr.platform.laboratory;

import com.emr.platform.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "lab_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lab_order_id", nullable = false)
    private LabOrder labOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @Column(name = "result_data", nullable = false, columnDefinition = "TEXT")
    private String resultData;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private Instant uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = Instant.now();
    }
}
