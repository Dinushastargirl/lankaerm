# Lanka EMR: AI-Ready Electronic Medical Record Platform

Lanka EMR is a modern, enterprise-grade Electronic Medical Record (EMR) platform designed for healthcare providers in Sri Lanka (and scalable to India and South Asia). It serves as a secure, modular, and AI-ready alternative to legacy systems.

---

## 1. Project Folder Structure

### Frontend Structure (Vite + TypeScript + Tailwind CSS)
Located in `frontend/src/`:
- **`api/`**: Axios configuration and endpoints.
- **`layouts/`**: `DashboardLayout.tsx` which handles core side and top navigation.
- **`pages/`**: Page views (Overview, Patients, Appointments, Consultations, Lab, Pharmacy, Billing, Reports, AI Co-Pilot, User Management, Security).
- **`routes/`**: Guards (`ProtectedRoute.tsx`) and mapping dictionary (`AppRoutes.tsx`).
- **`store/`**: Authentication context state (`AuthContext.tsx`).
- **`types/`**: TypeScript domain interfaces (`index.ts`).

### Backend Structure (Spring Boot + Maven)
Located in `backend/src/main/java/com/emr/platform/`:
- **`auth/`**: Core security configurations, JWT filters, authentication controller, and DTOs.
- **`user/`**: Clinician accounts, directories, profile query endpoints.
- **`role/`**: User role entity definitions (ADMIN, DOCTOR, NURSE, RECEPTIONIST).
- **`permission/`**: Action-based privilege attributes.
- **`audit/`**: System interactions audit logging.
- **`common/`**: General REST envelope, seeder data compiler, exceptions controller.

---

## 2. Database Schema Overview (PostgreSQL)

The platform maps entities with relational mappings using Hibernate/JPA:

```mermaid
erDiagram
    ORGANIZATIONS {
        bigint id PK
        varchar name UK
        varchar address
        varchar country
    }
    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar full_name
        varchar password_hash
        varchar status
        int failed_login_attempts
        bigint role_id FK
        bigint organization_id FK
        timestamp created_at
    }
    ROLES {
        bigint id PK
        varchar name UK
    }
    PERMISSIONS {
        bigint id PK
        varchar module
        varchar action
    }
    REFRESH_TOKENS {
        bigint id PK
        bigint user_id FK
        varchar token UK
        timestamp expiry_date
    }
    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar module
        timestamp timestamp
        varchar ip_address
    }
    PATIENT_ACCESS_LOGS {
        bigint id PK
        bigint user_id FK
        bigint patient_id
        varchar action
        timestamp timestamp
        varchar ip_address
    }

    ORGANIZATIONS ||--o{ USERS : "employs"
    USERS ||--|| ROLES : "belongs_to"
    ROLES }|--|{ PERMISSIONS : "role_permissions"
    USERS ||--o{ AUDIT_LOGS : "performed_actions"
    USERS ||--o{ PATIENT_ACCESS_LOGS : "viewed_records"
    USERS ||--o| REFRESH_TOKENS : "holds_session"
```

---

## 3. Security Architecture Diagram

The diagram below details the Spring Security pipeline, filter chains, and AOP validation intercepts:

```mermaid
sequenceDiagram
    participant Client as React Client (Port 5173)
    participant Filter as JwtAuthenticationFilter
    participant Manager as AuthenticationManager
    participant Context as SecurityContextHolder
    participant AOP as PermissionAspect (@RequirePermission)
    participant Endpoint as REST Controller Endpoint
    participant DB as PostgreSQL Database

    Client->>Filter: Request with Bearer Token
    Filter->>Filter: Parse & validate JWT signature
    alt Token Valid
        Filter->>Context: Set Authenticated User + Permissions
    else Token Missing/Expired
        Filter->>Filter: Bypass filter (Anonymous Session)
    end
    
    Filter->>AOP: Intercept call (AOP JoinPoint)
    AOP->>AOP: Inspect required vs active permissions
    alt Permitted / ADMIN
        AOP->>Endpoint: Proceed execution
        Endpoint->>DB: Perform queries
        DB-->>Endpoint: Return results
        Endpoint-->>Client: 200 OK (ApiResponse Envelope)
    else Missing Permission
        AOP-->>Client: 403 Forbidden Error
    end
```

---

## 4. Authentication & Refresh Token Rotation Flow

The diagram below maps credentials verification, brute force lockout, and refresh token rotation:

```mermaid
sequenceDiagram
    participant User as Clinician (UI)
    participant API as AuthController (/login)
    participant Lock as Lockout Tracker (failed_login_attempts)
    participant JWT as JwtUtils
    participant ROT as RefreshTokenService
    participant DB as PostgreSQL

    User->>API: Enter credentials
    API->>DB: Lookup User status
    alt User is LOCKED
        API-->>User: 423 Locked Exception
    else User is ACTIVE
        API->>Lock: Verify password via BCrypt
        alt Password Match
            API->>Lock: Reset failed_login_attempts = 0
            API->>JWT: Issue access token (expires in 24h)
            API->>ROT: Generate new Refresh Token (expires in 7 days)
            ROT->>DB: Save/replace refresh token
            API-->>User: Return AuthResponse (tokens + permissions)
        else Password Mismatch
            API->>Lock: Increment failed_login_attempts
            alt Attempts >= 5
                API->>DB: Set status = 'LOCKED'
                API-->>User: 423 Locked Exception
            else Attempts < 5
                API-->>User: 401 Unauthorized Exception
            end
        end
    end

    Note over User, DB: Refresh Token Rotation
    User->>API: POST /refresh-token (refreshToken)
    API->>ROT: Validate token expiry & verify rotation
    alt Valid Token
        ROT->>DB: Delete old Refresh Token
        ROT->>ROT: Generate new Refresh Token
        ROT->>DB: Save new Refresh Token
        API->>JWT: Generate new Access Token
        API-->>User: Return 200 OK (accessToken + rotated refreshToken)
    else Expired / Invalid Token
        ROT->>DB: Revoke session (Delete token)
        API-->>User: 401 Please authenticate again
    end
```

---

## 5. REST API Documentation

All API response payloads use a uniform JSON wrapper:
```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": { ... },
  "timestamp": 178512910291
}
```

### Authentication endpoints (`/api/auth`)

- **`POST /api/auth/login`**:
  - Request body: `LoginRequest` (username, password)
  - Returns `AuthResponse`: `{ accessToken, refreshToken, userId, username, role, permissions }`
  - Locks user status to `LOCKED` on 5 consecutive bad passwords.

- **`POST /api/auth/register`**:
  - Request body: `RegisterRequest` (username, email, fullName, role, password)
  - Enforces password complexity rules (length >= 8, uppercase, lowercase, digit, special character).

- **`POST /api/auth/refresh-token`**:
  - Request body: `TokenRefreshRequest` (refreshToken)
  - Revokes old token, rotates to new refresh token, and returns new access/refresh tokens.

- **`POST /api/auth/logout`**:
  - Revokes active sessions and deletes refresh tokens from database.

---

## 6. Setup & Launch Instructions

### Prerequisites
1. **Java Development Kit (JDK) 17** configured in the PATH.
2. **Node.js (v18+)** and **npm** installed.
3. **PostgreSQL** database service running locally.

### Database Setup
Create a PostgreSQL database named `oscar_emr`:
```sql
CREATE DATABASE oscar_emr;
```

### Backend (Spring Boot)
1. Configure credentials in `backend/src/main/resources/application.yml` or set environment variables:
   - `DB_URL`: JDBC url (default: `jdbc:postgresql://localhost:5432/oscar_emr`)
   - `DB_USERNAME`: Database username (default: `postgres`)
   - `DB_PASSWORD`: Database password (default: `password`)
2. Run the application using Maven:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   *Note: The seeder creates a default Organization "Colombo Medical Center" and seeds Admin, Doctor, Nurse, and Receptionist profiles associated with it.*

### Frontend (Vite + React)
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch Vite development server:
   ```bash
   npm run dev
   ```
   *Note: Access the frontend at `http://localhost:5173/`. You can log in using real API calls if the backend is running, or bypass database setup instantly by clicking any "Quick Demo Login" button.*
