# Deployment Guide: Lanka EMR Cloud Infrastructure

This document outlines the steps required to deploy the Lanka EMR platform to a production cloud environment.

---

## 1. Frontend Deployment (Vite React on Vercel)

The React application is fully prepared for Vercel deployment. 

### Step-by-Step Vercel Setup
1. Log into your Vercel account and click **Add New > Project**.
2. Import the Git repository `Dinushastargirl/lankaerm`.
3. Set the **Root Directory** configuration to `frontend`.
4. Choose **Vite** as the Framework Preset (Vercel will auto-configure build commands: `npm run build` and output directory: `dist`).
5. Add the **Environment Variables**:
   - `VITE_API_URL`: Set this to your deployed Spring Boot backend URL (e.g., `https://lanka-emr-backend.up.railway.app/api`).
6. Click **Deploy**.

> [!NOTE]
> Client-side routing fallback is handled automatically by the pre-configured [vercel.json](file:///c:/Users/Aurum/OSCARXOPENERM/frontend/vercel.json) file.

---

## 2. Backend Deployment (Spring Boot on Railway or Render)

The Spring Boot backend is dockerized and externalized to consume database configurations dynamically from environment variables.

### Railway Deployment Steps
1. Log into Railway and select **New Project > Deploy from GitHub repo**.
2. Select the repository `Dinushastargirl/lankaerm`.
3. Set the **Root Directory** configuration to `backend`. Railway will automatically locate the `Dockerfile` and build the container stack.
4. Add the following **Variables**:
   - `SERVER_PORT`: `8085` (or mapped host container port)
   - `DATABASE_URL`: The JDBC URL pointing to your Neon PostgreSQL instance (e.g. `jdbc:postgresql://<host>:5432/<database>`)
   - `DATABASE_USERNAME`: Database username.
   - `DATABASE_PASSWORD`: Database password.
   - `JWT_SECRET`: A secure 256-bit hexadecimal string.
5. Trigger deployment.

---

## 3. Database Provisioning (Neon PostgreSQL)

Lanka EMR uses a standard PostgreSQL database schema.
1. Create a database instance on **Neon**.
2. Copy the connection URI parameters (Host, Database Name, Username, and Password).
3. Populate the backend environment variables (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) on Railway/Render.
4. On startup, Hibernate will automatically scan the schema and compile the necessary database tables.
