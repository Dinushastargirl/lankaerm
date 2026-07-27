# Role Authority & Permissions Report: Lanka EMR

This report specifies the access control rules, roles responsibilities, permission configurations, and action constraints implemented in Lanka EMR.

---

## 1. System Role Hierarchy & Management

| Role | Responsibility | Who Creates This Role | Who Manages This Role | Permission Keys |
| :--- | :--- | :--- | :--- | :--- |
| **SYSTEM_ADMIN** | Overall system parameters configuration, clinic boundaries setup, and audit trail logs. | System installation bootstrap | System installation bootstrap | `user-management:write`, `patients:read`, `patients:write`, `patients:delete` |
| **DOCTOR** | Record vitals, write patient clinical encounters, log ICD-10 diagnoses, issue prescriptions, and order tests. | Admin / HR Manager | System Admin | `patients:read`, `patients:write`, `laboratory:read`, `laboratory:write`, `pharmacy:read` |
| **NURSE** | Perform pre-consultation vitals telemetry checking and look up registered files. | Hospital Admin | System Admin | `patients:read`, `patients:write` |
| **RECEPTIONIST**| Demographics registrations, checking registries, and scheduling slots calendars. | Hospital Admin | System Admin | `patients:read`, `patients:write`, `patients:create` |
| **LAB_TECH** | Process diagnostic test orders queue and upload test values. | Hospital Admin | System Admin | `patients:read`, `laboratory:read`, `laboratory:write` |
| **PHARMACIST** | Dispense active prescriptions and check medications stock quantities. | Hospital Admin | System Admin | `patients:read`, `pharmacy:read`, `pharmacy:write` |

---

## 2. Granular Permissions Matrix

- **`patients:read`**: Grants view permissions to patient directories and profiles.
- **`patients:write`**: Grants registration and profile updates.
- **`patients:delete`**: Restricted to Admin role; allows deleting patient profiles.
- **`user-management:write`**: Restricted to System Admin; grants user creation and edit rights.
- **`laboratory:read`**: Access to active laboratory test orders.
- **`laboratory:write`**: Allows lab technicians to upload test results.
- **`pharmacy:read`**: Access to inventory and medication prescriptions list.
- **`pharmacy:write`**: Allows pharmacists to dispense medication items.
