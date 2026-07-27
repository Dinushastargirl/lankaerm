package com.emr.platform.prescription;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "medications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String form; // e.g. Tablet, Syrup, Injection

    @Column(name = "dosage_strength", nullable = false)
    private String dosageStrength; // e.g. 500mg, 10ml

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(name = "expiry_date", nullable = false)
    private String expiryDate;
}
