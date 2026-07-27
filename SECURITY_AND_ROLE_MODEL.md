# Security and Role Authority Model: Lanka EMR

This document specifies the security patterns, role privileges, access hierarchies, and clinical data privacy frameworks implemented in Lanka EMR.

---

## 1. Security Architecture

### 1.1 Spring Security Filter Chain
The backend is secured using **Spring Security 6** configured for stateless execution:
- CSRF is disabled (since operations consume stateless bearer JWT tokens).
- CORS configuration allows requests from authorized frontend domain parameters.
- Public paths (like login `/api/auth/login` and Swagger `/swagger-ui/**`) are explicitly bypass-permitted.
- All other endpoints require authentication filters.

### 1.2 Aspect-Oriented Access Interceptors
Lanka EMR does not rely solely on path-based security. We secure business layer methods using an Aspect-Oriented Programming (AOP) class `PermissionAspect.java` matching the `@RequirePermission` annotation:
```java
@RequirePermission("patients:write")
public PatientDto createPatient(PatientDto dto) { ... }
```
This ensures that even if a controller endpoint is open, a user without the precise action key is rejected with a `403 Forbidden` response.

---

## 2. Hospital Hierarchy & User Role Model

```
       [ SYSTEM CHIEF ADMIN ]
                 │
      ┌──────────┴──────────┐
[HOSPITAL ADMIN A]    [HOSPITAL ADMIN B]
      │                     │
      ├─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
  [DOCTORS]              [NURSES]          [RECEPTIONISTS]
      │                     │                     │
      ▼                     ▼                     ▼
[PHARMACISTS]         [LAB TECHNICIANS]      [PATIENTS]
```

### 2.1 Role-Based Permissions & Data Access

#### 2.1.1 System Chief Admin
- **Who Creates**: Built-in bootstrap user account.
- **Allowed Actions**: Add new clinics/organizations, edit global configs, manage Hospital Admins, configure roles, and inspect database security audit tables.
- **Data Access**: High-level telemetry, security log logs, and system settings. Cannot read individual patient health charts unless authorized.
- **Permission Keys**: `user-management:write`, `patients:read`, `patients:write`, `patients:delete`.

#### 2.1.2 Hospital Administrator
- **Who Creates**: System Chief Admin.
- **Allowed Actions**: Provision doctor, nurse, and support staff files for their specific organization/clinic. Set clinic-level calendars and view billing summaries.
- **Data Access**: Staff profile directories, financial records, invoices list. No direct medical record write privileges.
- **Permission Keys**: `user-management:write`, `patients:read`, `billing:read`.

#### 2.1.3 Doctor
- **Who Creates**: Hospital Administrator.
- **Allowed Actions**: Write consultation records, diagnose using ICD-10 keys, write prescriptions, and request diagnostic tests.
- **Data Access**: Full access to assigned patients' medical charts, vitals records, laboratory histories, and active medication lists.
- **Permission Keys**: `patients:read`, `patients:write`, `laboratory:read`, `laboratory:write`, `pharmacy:read`.

#### 2.1.4 Nurse
- **Who Creates**: Hospital Administrator.
- **Allowed Actions**: Input intake vitals (BP, temperature, heart/respiratory rates) and schedule quick appointments.
- **Data Access**: Patient demographic details, vitals history logs.
- **Permission Keys**: `patients:read`, `patients:write`.

#### 2.1.5 Receptionist
- **Who Creates**: Hospital Administrator.
- **Allowed Actions**: Register new patient demographics, check MRN cards, set scheduled appointment blocks.
- **Data Access**: Patient demographic profiles, appointments list. No clinical access.
- **Permission Keys**: `patients:read`, `patients:write`, `patients:create`.

#### 2.1.6 Lab Technician
- **Who Creates**: Hospital Administrator.
- **Allowed Actions**: Pull ordered lab requests queue, upload test results, and input clinical notes/comments.
- **Data Access**: Lab orders history, patient details.
- **Permission Keys**: `patients:read`, `laboratory:read`, `laboratory:write`.

#### 2.1.7 Pharmacist
- **Who Creates**: Hospital Administrator.
- **Allowed Actions**: Review active prescriptions, adjust pharmacy stock levels, and mark prescriptions as dispensed.
- **Data Access**: Active prescription orders, medication stocks data.
- **Permission Keys**: `patients:read`, `pharmacy:read`, `pharmacy:write`.

---

## 3. Production Security & Compliance Guidelines

### 3.1 GDPR & Sri Lankan Personal Data Protection Act (PDPA) Compliance
Lanka EMR enforces data privacy by design:
*   **Consent Log**: Clinicians must log patient consent (`PatientConsent` entity) before accessing sensitive history files.
*   **Access Tracking**: Every chart open event is saved inside a dedicated `PatientAccessLog` table to deter unauthorized lookups.
*   **Audit Logging**: User actions (login attempts, failed hashes, user modifications) are recorded in `AuditLog` tables.

### 3.2 Security Hardening Recommendations
1.  **Transport Security**: Enforce HTTPS with TLS 1.3 across all endpoints.
2.  **MFA**: Integrate SMS or TOTP (Google Authenticator) verification for hospital accounts.
3.  **Harden Database**: Store Neon PostgreSQL connection variables in cloud environments only. Enforce SSL connection parameters using `sslmode=require`.
