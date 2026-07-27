package com.emr.platform.encounter;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "vitals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vitals {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(name = "blood_pressure", nullable = false)
    private String bloodPressure;

    @Column(name = "heart_rate", nullable = false)
    private String heartRate;

    @Column(nullable = false)
    private String temperature;

    @Column(name = "respiratory_rate", nullable = false)
    private String respiratoryRate;
}
