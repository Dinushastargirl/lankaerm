# Technical System Report: Next-Generation Enterprise EMR Platform

This document describes the architectural design, database schemas, service layers, and audit security pipeline for the Lanka EMR platform.

---

## 1. Architectural Architecture & Design Principles

Lanka EMR uses a decoupled **Clean Architecture** stack separating representation, business orchestration, and data access layers.

```
       [ Client Presentation Tier ] (React + Vite + Tailwind)
                   │
                   ▼ (REST Requests via JWT Bearer)
       [ REST Controller Gateway ] (Spring Web MVC)
                   │
                   ▼ (DTO Mappings)
       [ Service Business Logic ] (Spring Managed Services)
                   │
                   ▼ (JPA Queries / Transaction Boundaries)
       [ Relational Database Tier ] (PostgreSQL Server)
```

### Key Architectural Guidelines
- **SOLID Principles**: Domains are strictly isolated. For example, the `laboratory` package does not modify data inside the `billing` package; communications go through managed transaction blocks.
- **DTO Pattern**: Raw database entities are not exposed to the REST controller representation layer. Mappings are carried out via specific request/response DTO parameters.
- **Least Privilege Access**: Restricts API operations based on custom annotations (`@RequirePermission`). Aspect Oriented Programming (AOP) intercepts executions before controllers process data.

---

## 2. Normalized Database Schema (UUID Primary Keys)

The database schema has been normalized to the 3rd Normal Form (3NF) to support transaction integrity. All primary and foreign keys utilize 128-bit `UUID` types.

### Table Dictionary

#### 1. Security & Identity Schemas
- **`organizations`**: Hospital clinics configuration.
  - `id` (uuid, Primary Key)
  - `name` (varchar, Unique)
  - `address` (varchar)
  - `country` (varchar)
- **`roles`**: Clinician groupings.
  - `id` (uuid, Primary Key)
  - `name` (varchar, Unique)
- **`permissions`**: Granular privilege tags.
  - `id` (uuid, Primary Key)
  - `module` (varchar)
  - `action` (varchar, Unique)
- **`users`**: Hospital staff profiles.
  - `id` (uuid, Primary Key)
  - `username` (varchar, Unique)
  - `email` (varchar, Unique)
  - `password_hash` (varchar)
  - `role_id` (uuid, Foreign Key -> `roles.id`)
  - `organization_id` (uuid, Foreign Key -> `organizations.id`)
  - `status` (varchar: `ACTIVE`, `INACTIVE`, `LOCKED`)
  - `failed_login_attempts` (integer)
  - `created_at` (timestamp)
- **`refresh_tokens`**: Persistent rotation sessions.
  - `id` (uuid, Primary Key)
  - `user_id` (uuid, Foreign Key -> `users.id`)
  - `token` (varchar, Unique)
  - `expiry_date` (timestamp)

#### 2. Clinical Log Schemas
- **`patients`**: Patient demographics registry.
  - `id` (uuid, Primary Key)
  - `medical_record_number` (varchar, Unique)
  - `first_name` (varchar)
  - `last_name` (varchar)
  - `date_of_birth` (varchar)
  - `gender` (varchar)
  - `email` (varchar, Unique)
  - `phone_number` (varchar)
  - `address` (varchar)
  - `insurance_provider` (varchar)
  - `insurance_policy_number` (varchar)
  - `allergies` (text)
  - `medical_history` (text)
  - `created_at` (timestamp)
- **`appointments`**: Scheduling calendars.
  - `id` (uuid, Primary Key)
  - `patient_id` (uuid, Foreign Key -> `patients.id`)
  - `doctor_id` (uuid, Foreign Key -> `users.id`)
  - `appointment_date` (varchar)
  - `appointment_time` (varchar)
  - `status` (varchar: `SCHEDULED`, `COMPLETED`, `CANCELLED`)
  - `reason` (varchar)
- **`encounters`**: Clinical consultation summaries.
  - `id` (uuid, Primary Key)
  - `patient_id` (uuid, Foreign Key -> `patients.id`)
  - `doctor_id` (uuid, Foreign Key -> `users.id`)
  - `clinical_notes` (text)
  - `treatment_plan` (text)
  - `created_at` (timestamp)
- **`vitals`**: Physiological telemetry records.
  - `id` (uuid, Primary Key)
  - `encounter_id` (uuid, Foreign Key -> `encounters.id`)
  - `blood_pressure` (varchar)
  - `heart_rate` (varchar)
  - `temperature` (varchar)
  - `respiratory_rate` (varchar)
- **`diagnoses`**: ICD-10 medical diagnostics logs.
  - `id` (uuid, Primary Key)
  - `encounter_id` (uuid, Foreign Key -> `encounters.id`)
  - `icd10_code` (varchar)
  - `description` (varchar)
  - `severity` (varchar: `MILD`, `MODERATE`, `SEVERE`)

#### 3. Pharmacy & Labs Schemas
- **`medications`**: Medication items stock inventory.
  - `id` (uuid, Primary Key)
  - `name` (varchar)
  - `code` (varchar, Unique)
  - `form` (varchar)
  - `dosage_strength` (varchar)
  - `stock_quantity` (integer)
  - `expiry_date` (varchar)
- **`prescriptions`**: Active prescriptions.
  - `id` (uuid, Primary Key)
  - `patient_id` (uuid, Foreign Key -> `patients.id`)
  - `doctor_id` (uuid, Foreign Key -> `users.id`)
  - `encounter_id` (uuid, Foreign Key -> `encounters.id`)
  - `status` (varchar: `ACTIVE`, `DISPENSED`, `CANCELLED`)
- **`prescription_items`**: Prescription order dosage lines.
  - `id` (uuid, Primary Key)
  - `prescription_id` (uuid, Foreign Key -> `prescriptions.id`)
  - `medication_id` (uuid, Foreign Key -> `medications.id`)
  - `dosage` (varchar)
  - `frequency` (varchar)
  - `duration` (varchar)
  - `instructions` (text)
- **`lab_orders`**: Clinician laboratory tests.
  - `id` (uuid, Primary Key)
  - `patient_id` (uuid, Foreign Key -> `patients.id`)
  - `doctor_id` (uuid, Foreign Key -> `users.id`)
  - `test_name` (varchar)
  - `instructions` (text)
  - `status` (varchar: `PENDING`, `COMPLETED`, `CANCELLED`)
- **`lab_results`**: Completed diagnostic uploads.
  - `id` (uuid, Primary Key)
  - `lab_order_id` (uuid, Foreign Key -> `lab_orders.id`)
  - `technician_id` (uuid, Foreign Key -> `users.id`)
  - `result_data` (text)
  - `comments` (text)
  - `uploaded_at` (timestamp)

#### 4. Financial & Audit Logging
- **`invoices`**: Billing invoice logs.
  - `id` (uuid, Primary Key)
  - `patient_id` (uuid, Foreign Key -> `patients.id`)
  - `invoice_number` (varchar, Unique)
  - `amount` (double precision)
  - `status` (varchar: `UNPAID`, `PAID`, `PARTIALLY_PAID`)
  - `created_at` (timestamp)
- **`payments`**: Payment records.
  - `id` (uuid, Primary Key)
  - `invoice_id` (uuid, Foreign Key -> `invoices.id`)
  - `payment_method` (varchar: `CASH`, `CARD`, `INSURANCE`)
  - `transaction_ref` (varchar)
  - `amount_paid` (double precision)
- **`audit_logs`**: Chronological security audit logs.
  - `id` (uuid, Primary Key)
  - `user_id` (uuid, Foreign Key -> `users.id`)
  - `action` (varchar)
  - `module` (varchar)
  - `timestamp` (timestamp)
  - `ip_address` (varchar)
- **`patient_access_logs`**: Patient records access telemetry.
  - `id` (uuid, Primary Key)
  - `user_id` (uuid, Foreign Key -> `users.id`)
  - `patient_id` (uuid)
  - `action` (varchar)
  - `timestamp` (timestamp)
  - `ip_address` (varchar)

---

## 3. Service Layer Implementations

The transaction boundaries are managed using Spring's `@Transactional` annotation.

- **`PatientService`**: Coordinates demographic listings, patient registration, and updates. Includes unique constraints tracking.
- **`AppointmentService`**: Manages patient checkup bookings. Schedules appointments under `SCHEDULED` status, tracks booking details, and updates states.
- **`EncounterService`**: Integrates clinical workflows. Within a single transaction block, doctors can create an `Encounter`, register physiological `Vitals`, and append multiple `Diagnosis` logs.
- **`PrescriptionService`**: Links doctors and pharmacists. Before adding items, the service checks stock levels. In the dispensing stage, the system deducts quantities and updates status.
- **`LaboratoryService`**: Connects doctors and lab technicians. Techs search pending orders and upload result strings.
- **`BillingService`**: Automates invoices. Processes cash/card payments, tracks cumulative amounts paid, and flags invoice states automatically.

---

## 4. Security & Audit pipeline

Lanka EMR follows HIPAA-aligned access control architectures:

1. **AOP Dynamic Permission Checks**:
   Controller endpoints are protected using `@RequirePermission("permission-label")`. The aspect queries the active Security Context and inspects authority lists, raising an `AccessDeniedException` if permissions are missing.
2. **Session Rotation & Expirations**:
   Stateless JWT access tokens are signed using HMAC-SHA256. Upon access token expiration, clients use `/refresh-token` to rotate keys. Old refresh token strings are immediately invalidated in the database.
3. **Audit Trails**:
   Every clinical transaction is logged. The `AuditAspect` interceptor automatically records permission checks, actions, and blocked unauthorized operations.
4. **Brute Force Lockout**:
   Wired to track consecutive failed login attempts. If a username enters an incorrect credential 5 times in a row, their status is set to `LOCKED`, blocking further authentication attempts.
