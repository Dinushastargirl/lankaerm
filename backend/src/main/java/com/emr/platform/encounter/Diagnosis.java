package com.emr.platform.encounter;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "diagnoses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(name = "icd10_code", nullable = false)
    private String icd10Code;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String severity; // MILD, MODERATE, SEVERE
}
