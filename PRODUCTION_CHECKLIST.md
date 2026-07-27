# Production Readiness Checklist: Lanka EMR

Use this checklist to verify security, performance, and host configurations before exposing Lanka EMR to clinic environments.

---

## 1. Secrets & Configurations Hardening
- [ ] **Remove Local Database Credentials**: Ensure `backend/src/main/resources/application.yml` has zero default/fallback passwords or URLs.
- [ ] **Generate Custom JWT Secret**: Generate a cryptographically strong 256-bit hex key and set it as `JWT_SECRET` environment variable in production.
- [ ] **Secure Database Passwords**: Do not expose PostgreSQL/Neon passwords in source control. Set `DATABASE_PASSWORD` securely in the cloud dashboard.

---

## 2. Infrastructure & Hosting
- [ ] **Vercel Frontend Build**: Ensure the SPA routing fallback file [vercel.json](file:///c:/Users/Aurum/OSCARXOPENERM/frontend/vercel.json) exists in the build output.
- [ ] **Railway/Render Deployment**: Ensure the Spring Boot backend container binds dynamically to the host `$PORT` environment variable.
- [ ] **Docker Engine checks**: Verify `docker-compose.yml` mounts the database volume cleanly.

---

## 3. Database Schema & Persistence
- [ ] **DDL Safe Settings**: For development, `hibernate.ddl-auto` is set to `update`. In stable production staging, set this parameter to `validate` or run dedicated **Flyway** migrations.
- [ ] **PostgreSQL Host Connections**: Confirm that cloud firewalls allow the backend host IP to query the PostgreSQL port.
