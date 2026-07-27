# System Architecture Report: Lanka EMR Platform

This document provides a technical audit and structural guide of the Lanka EMR platform, describing presentation interfaces, business layers, database models, and API lifecycles.

---

## 1. Frontend Architecture

### 1.1 Technical Stack
- **Framework**: React 18 (Vite-based Single Page Application).
- **Programming Language**: TypeScript (TypeScript 5+ with strict type checking).
- **Build Tool**: Vite (Vite 8+ config leveraging Rollup for production assets compilation).
- **UI & Styling Libraries**: Tailwind CSS (Tailwind 3+ utility-first class styling), Lucide React (vector clinical and operations icons).

### 1.2 Folder Structure Directory
```
frontend/
├── public/                # Static favicon and vector SVG graphic resources
├── src/
│   ├── assets/            # Local images and branding vector SVGs
│   ├── components/        # Reusable component files (Buttons, Cards, Inputs, Tables)
│   ├── layouts/           # Structural layout templates (DashboardLayout)
│   ├── pages/             # Dynamic page views (Login, PatientsList, laboratory)
│   ├── routes/            # React Router routing interceptors
│   ├── services/          # API Axios/fetch clients
│   ├── store/             # Global session context states (AuthContext)
│   └── types/             # Common TypeScript interfaces
```

### 1.3 Routing & Navigation
Client-side routing is handled using **React Router v6**. Page navigation utilizes lazy-loading layout templates. Protected clinical paths are wrapped with `<ProtectedRoute>` elements which verify active clinician sessions and permission boundaries dynamically.

### 1.4 State Management & Authentication Flow
- **Session State**: Managed globally using React Context via the `AuthContext` provider. It tracks user state, authentication tokens, and dynamic permission matrices.
- **Client Session Check**: On initialization, the client retrieves tokens and user parameters from `localStorage`.
- **JWT Storage**: In this stage, JWT access and refresh tokens are stored securely in `localStorage` for demo continuity and will transition to secure HttpOnly cookies in production environments.

### 1.5 Frontend to Backend Communication
All communications route through the `apiRequest` helper in `api.ts`. It acts as a wrapper around the browser `fetch` API and:
1. Injects the `Authorization: Bearer <token>` header dynamically into requests.
2. Intercepts `401 Unauthorized` responses to auto-refresh access credentials using the stored `refreshToken`.
3. Displays friendly error envelopes to clinicians.

### 1.6 Environment Variables & Deployment
- **`VITE_API_URL`**: Environment variable used to set the backend host base endpoint (e.g. `https://api.lankaemr.lk/api`).
- **Deployment**: Hosted on **Vercel** with the Root Directory option pointing directly to the `frontend/` folder. Routing rewrites are handled by `frontend/vercel.json` to map all sub-routes back to `/index.html`.

---

## 2. Backend Architecture

### 2.1 Technical Stack
- **Framework**: Spring Boot 3.3 (running Tomcat 10 servlet containers).
- **Programming Language**: Java 17.
- **ORM / Persistence**: Hibernate (JPA 3 provider mapping Java objects to database entities).

### 2.2 Project Code Architecture (Controller-Service-Repository)
The backend project maps code boundaries following clean separation of concerns:
1.  **Controller Layer**: Handles incoming HTTP requests, validates inputs, maps parameters to DTOs, and formats API envelopes.
2.  **Service Layer**: Handles clinical workflows, transaction boundaries, and security rules.
3.  **Repository Layer**: Extends `JpaRepository` to interface with PostgreSQL tables.

```
+------------+     +----------------+     +-----------------+     +-------------------+
| Controller | --> | Service Layer  | --> | Repository Layer| --> | Postgres Database |
+------------+     +----------------+     +-----------------+     +-------------------+
```

### 2.3 Entity Models & UUID-based Schema
Every entity uses a 128-bit `UUID` primary key to facilitate database shards, multi-clinic tenancy, and scalable offline syncing.
Key entity groups:
- **Core Security**: `User`, `Role`, `Permission`, `RefreshToken`, `AuditLog`.
- **Demographics**: `Patient`, `PatientConsent`.
- **Clinical Data**: `Encounter`, `Vitals`, `Diagnosis`, `Appointment`.
- **Pharmacy & Lab**: `Medication`, `Prescription`, `PrescriptionItem`, `LabOrder`, `LabResult`.
- **Finance**: `Invoice`, `Payment`.

### 2.4 API Request Lifecycle

```
[User Request]
      │
      ▼
[Security Filter Chain] ──────> Validate JWT header (reject 401 if corrupt)
      │
      ▼
[AOP Permission Aspect] ────> Inspect @RequirePermission annotation
      │
      ▼
[Controller Gateway] ───────> Validate DTO payload parameters
      │
      ▼
[Service Logic Layer] ──────> Execute database transaction
      │
      ▼
[Response Envelope] ────────> Standard JSON format (success, message, data)
```

---

## 3. API Architecture

### 3.1 REST API Design & Response Formatting
All endpoint routes return a standardized JSON envelope (`com.emr.platform.common.ApiResponse`):
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### 3.2 Endpoint Groups

#### 3.2.1 Authentication (`/api/auth`)
*   `POST /login`: Validates password hashes and issues JWT token envelopes.
*   `POST /refresh-token`: Rotates session tokens.
*   `POST /logout`: Revokes refresh tokens.

#### 3.2.2 Patients Operations (`/api/patients`)
*   `GET /`: Lists registered patient demographics.
*   `POST /`: Creates a new patient MRN file.
*   `GET /{id}`: Details profile charts.

#### 3.2.3 Consultations & Pharmacy (`/api/encounters`, `/api/prescriptions`)
*   `POST /encounters`: Records vitals and clinical checkup notes.
*   `POST /prescriptions`: Submits medication formulas to pharmacy inventories.
*   `PUT /prescriptions/{id}/dispense`: Updates stock levels.

---

## 4. API Error Handling Strategy
System-wide exceptions are intercepted by `GlobalExceptionHandler.java`. It catches standard errors (like `BadCredentialsException` or `EntityNotFoundException`) and returns clean, secure JSON responses, hiding internal stack traces from client applications:
```json
{
  "success": false,
  "message": "Database resource not found with given identifier",
  "data": null
}
```
