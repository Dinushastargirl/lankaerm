# Deployment and Cost Analysis Report: Lanka EMR

This report presents cloud hosting options, medical imaging object storage strategies, and pricing plans optimized for various hospital sizes.

---

## 1. Current Deployment Status
*   **Presentation Tier**: Hosted on **Vercel** (runs Vite React, uses `frontend/vercel.json` SPA routing rewrite configurations).
*   **Orchestrator Tier**: Ready for **Railway / Render** container hosting (uses multi-stage `Dockerfile` and dynamic environment variables injection).
*   **Persistence Tier**: Hosted on **Neon Serverless PostgreSQL** (accessed via unpooled connection URLs with SSL active).

---

## 2. Cloud Architecture Options

### Option 1: Amazon Web Services (AWS) — Standard Enterprise Choice
- **Frontend**: AWS Amplify or S3 Static Website + CloudFront (global CDN).
- **Backend API**: AWS ECS (Elastic Container Service) running Fargate.
- **Database**: AWS RDS for PostgreSQL.
- **Storage**: AWS S3.
- **Est. Cost (Small Hospital/Clinic)**: ~$150 - $220/month.

### Option 2: Microsoft Azure — Strong Integration Choice
- **Frontend**: Azure Static Web Apps.
- **Backend API**: Azure App Service (Web App for Containers).
- **Database**: Azure Database for PostgreSQL (Flexible Server).
- **Storage**: Azure Blob Storage.
- **Est. Cost (Small Hospital/Clinic)**: ~$160 - $240/month.

### Option 3: Google Cloud Platform (GCP) — Modern Scalable Choice
- **Frontend**: Firebase Hosting or Cloud Storage + Cloud CDN.
- **Backend API**: Google Cloud Run (serverless container hosting).
- **Database**: Google Cloud SQL for PostgreSQL.
- **Storage**: Google Cloud Storage.
- **Est. Cost (Small Hospital/Clinic)**: ~$120 - $190/month.

### Option 4: Developer Platforms (Railway / Render / Fly.io) — Fast Prototype Choice
- **Advantages**: Easy setup, direct GitHub sync, cheaper startup tiers, zero Kubernetes/IAM overhead.
- **Disadvantages**: Lacks advanced regional replication, compliance SLAs, and dedicated HIPAA-compliant physical hardware limits.
- **Est. Cost (Small Hospital/Clinic)**: ~$30 - $70/month.

---

## 3. Medical Image and Document Storage Strategy

> [!WARNING]
> **Database Anti-Pattern**: Medical records (X-Rays, MRI scans, PDFs) should **never** be saved directly inside relational database tables as binary blobs. Doing so results in transaction locks, slower queries, and massive database storage costs.

### Recommended Architecture
Lanka EMR decouples database records from binary clinical files using **Object Storage** (AWS S3, Azure Blob, or Cloudflare R2).

```
[Clinician Interface] ───> Uploads scan ───> [Spring Boot API]
                                                  │
                                                  ▼ (Validates format/permissions)
[Neon Database] <── Saves S3 Object URL ── [Object Storage (S3/R2)]
```

### Scan Upload Workflow
1.  **Upload Request**: Clinician uploads a scan (e.g. `patient_xray.png`) from the EMR dashboard.
2.  **API Validation**: Backend verifies the clinician's authorization (`@RequirePermission("patients:write")`) and checks the file type.
3.  **Upload to Object Storage**: Backend uploads the file stream to a secure private S3 bucket, assigning it a UUID path.
4.  **Save URL Reference**: Backend saves the image metadata and the secure object URL inside the database's `lab_results` or `patient_charts` table.
5.  **Secure Access Retrieval**: When an authorized doctor views the patient's record, the backend generates a time-limited **presigned URL** to download the file directly from S3, ensuring the scan is never exposed publicly.

---

## 4. Infrastructure Cost Estimations

### 4.1 Small Clinic (10–20 Users)
- **Frontend**: Vercel Free / Pro ($20/month)
- **Backend API**: Small Railway/Render Container (0.5 vCPU, 512MB RAM) ($7/month)
- **Database**: Neon Postgres Free / Launch Tier ($19/month)
- **Storage & Backups**: S3 / R2 (100GB storage + backups) ($5/month)
- **Monitoring**: BetterStack / UptimeRobot (Free)
- **Total Estimated Cost: ~$31 - $51 / month**

### 4.2 Medium Private Hospital (50–200 Users)
- **Frontend**: Vercel Pro ($40/month)
- **Backend API**: Railway/GCP Cloud Run (2 Containers, 1 vCPU, 1GB RAM) ($40/month)
- **Database**: Managed RDS / Neon Scale Tier ($50 - $100/month)
- **Storage & Backups**: S3 / R2 (1TB scans storage + replication backups) ($30/month)
- **Monitoring**: Datadog / NewRelic Basic ($50/month)
- **Total Estimated Cost: ~$210 - $260 / month**

### 4.3 Large Hospital (500+ Users)
- **Frontend**: Vercel Enterprise or AWS CloudFront ($200/month)
- **Backend API**: AWS ECS cluster with auto-scaling (minimum 4 containers) ($300/month)
- **Database**: AWS RDS Multi-AZ Postgres (High availability + failover) ($250/month)
- **Storage & Backups**: AWS S3 (5TB scans + Glacier archiving backups) ($150/month)
- **Monitoring & Security**: Full APM + AWS GuardDuty ($200/month)
- **Total Estimated Cost: ~$1,100 / month**
