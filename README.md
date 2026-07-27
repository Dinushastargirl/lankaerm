# Lanka EMR: Enterprise Electronic Medical Record Platform

Lanka EMR is a high-speed, secure, Electronic Medical Record (EMR) system designed initially for South Asian healthcare clinics, featuring granular role permissions, normalized schemas, and multi-tenancy clinic options.

## Features & Roles
- **Receptionist**: Patient check-ins, registrations, scheduling slot cards.
- **Doctor Workspace**: Consultation notes, ICD-10 diagnoses, vitals checks, prescriptions builder, lab requests.
- **Lab Technician**: diagnostic test requests queues, test result uploads.
- **Pharmacist**: Active medication lists, pharmacy dispensing checks, and stocks management.
- **Admin**: Clinician management directories, security audit trail dashboards.

## Visual Design Theme
Lanka EMR is designed with a premium, medical workstation design language utilizing:
- **Primary Clinical Hue**: Lavender-Pink (`#dfa5ff`)
- **Accents**: Pure Black (`#050505`) and Dark Grey (`#121212`)
- **Text & Neutral Whites**: Clean grey tones and clean typography (Inter / Outfit fonts).

## How to Install & Launch

### Local Manual Start
1. **Pre-requisites**: Java 17, Maven, Node.js 18, PostgreSQL.
2. **Database Provisioning**:
   ```sql
   CREATE DATABASE oscar_emr;
   CREATE USER emr_admin WITH PASSWORD 'emr_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE oscar_emr TO emr_admin;
   ALTER DATABASE oscar_emr OWNER TO emr_admin;
   ```
3. **Backend Run**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. **Frontend Run**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Container Compose Launch
Run both Spring Boot APIs and PostgreSQL inside containers using Docker:
```bash
docker-compose up --build
```

## Cloud Host Recommender
For high scalability and cost efficiency, we recommend:
1. **Frontend**: Deploy on **Vercel** or **Netlify** with redirects configured for SPA routing.
2. **Backend & DB**: Deploy on **Railway** or **Render** for easy Docker integration.
