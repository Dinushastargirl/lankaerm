# Database Schema Documentation: Lanka EMR

Lanka EMR utilizes a relational PostgreSQL schema where all entity identifiers map to 128-bit `UUID` primary and foreign keys.

---

## 1. Security & Identity Management Tables

### `users`
- **`id`**: `UUID` (Primary Key)
- **`username`**: `VARCHAR(255)` (Unique, Not Null)
- **`password_hash`**: `VARCHAR(255)` (Not Null)
- **`full_name`**: `VARCHAR(255)`
- **`email`**: `VARCHAR(255)`
- **`status`**: `VARCHAR(50)` (Active, Inactive, Locked)
- **`failed_login_attempts`**: `INT`
- **`role_id`**: `UUID` (Foreign Key -> `roles`)
- **`organization_id`**: `UUID` (Foreign Key -> `organizations`)

### `roles`
- **`id`**: `UUID` (Primary Key)
- **`name`**: `VARCHAR(100)` (Unique, e.g. ADMIN, DOCTOR, NURSE)

### `permissions`
- **`id`**: `UUID` (Primary Key)
- **`module`**: `VARCHAR(100)`
- **`action`**: `VARCHAR(255)` (Unique)

---

## 2. Clinical Data Tables

### `patients`
- **`id`**: `UUID` (Primary Key)
- **`medical_record_number`**: `VARCHAR(100)` (Unique)
- **`first_name`**: `VARCHAR(100)`
- **`last_name`**: `VARCHAR(100)`
- **`date_of_birth`**: `DATE`
- **`gender`**: `VARCHAR(50)`
- **`email`**: `VARCHAR(255)`
- **`phone_number`**: `VARCHAR(100)`
- **`address`**: `TEXT`
- **`allergies`**: `TEXT`
- **`medical_history`**: `TEXT`

### `encounters`
- **`id`**: `UUID` (Primary Key)
- **`patient_id`**: `UUID` (Foreign Key -> `patients`)
- **`doctor_id`**: `UUID` (Foreign Key -> `users`)
- **`clinical_notes`**: `TEXT`
- **`treatment_plan`**: `TEXT`
- **`created_at`**: `TIMESTAMP`

### `vitals`
- **`id`**: `UUID` (Primary Key)
- **`encounter_id`**: `UUID` (Foreign Key -> `encounters`, Unique)
- **`blood_pressure`**: `VARCHAR(50)`
- **`heart_rate`**: `VARCHAR(50)`
- **`temperature`**: `VARCHAR(50)`
- **`respiratory_rate`**: `VARCHAR(50)`
