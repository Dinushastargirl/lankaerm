# API Documentation: Lanka EMR REST Gateways

Lanka EMR exposes a REST API built using Spring Boot. All endpoints return standardized JSON envelopes.

---

## 1. Authentication Endpoints (`/api/auth`)

### Clinician Authentication
- **Endpoint**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "doctor",
    "password": "doctor123"
  }
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ...",
    "refreshToken": "7fe1cc51-136c-4333-a4b2-b083f414132f",
    "userId": "3ac555ca-e942-4578-a3c8-4d18020ba7e3",
    "username": "doctor",
    "role": "DOCTOR",
    "permissions": ["PATIENTS:READ", "PATIENTS:WRITE"]
  }
  ```

### Rotate Session Access Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Request Body**:
  ```json
  {
    "refreshToken": "7fe1cc51-136c-4333-a4b2-b083f414132f"
  }
  ```

---

## 2. Patients Operations Directory (`/api/patients`)

### Retrieve Patient List
- **Endpoint**: `GET /api/patients`
- **Headers**: `Authorization: Bearer <token>`
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Patient list retrieved successfully",
    "data": [
      {
        "id": "3ac555ca-e942-4578-a3c8-4d18020ba7e3",
        "medicalRecordNumber": "MRN-1001",
        "firstName": "Kamal",
        "lastName": "Silva",
        "dateOfBirth": "1980-05-12",
        "gender": "Male",
        "email": "kamal.silva@gmail.com",
        "phoneNumber": "+94 77 123 4567"
      }
    ]
  }
  ```

### Register New Patient Demographic
- **Endpoint**: `POST /api/patients`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "firstName": "Kamal",
    "lastName": "Silva",
    "dateOfBirth": "1980-05-12",
    "gender": "Male",
    "email": "kamal.silva@gmail.com",
    "phoneNumber": "+94 77 123 4567",
    "address": "12 Galle Road, Colombo 03"
  }
  ```

---

## 3. Consultations & Encounters (`/api/encounters`)

### Record Checkup Notes & Vitals
- **Endpoint**: `POST /api/encounters`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "patientId": "3ac555ca-e942-4578-a3c8-4d18020ba7e3",
    "doctorId": "3ac555ca-e942-4578-a3c8-4d18020ba7e3",
    "clinicalNotes": "Patient presents with persistent headaches.",
    "bloodPressure": "120/80",
    "heartRate": "72",
    "temperature": "98.6 F"
  }
  ```
