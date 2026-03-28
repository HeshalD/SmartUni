# Smart Uni Operations Hub — IT3030 PAF 2026

Group project for IT3030 Programming Applications and Frameworks.

## Stack
- **Backend:** Java 21, Spring Boot 3.4, Spring Data MongoDB, Spring Security, OAuth 2.0
- **Frontend:** React (Vite), React Router, Axios
- **Database:** MongoDB
- **Version Control:** Git + GitHub Actions

## Project Structure
- `smart-uni-api/` — Spring Boot REST API
- `smart-uni-client/` — React web application

## Setup Instructions

### Backend
1. Ensure Java 21 and Maven are installed
2. Install and start MongoDB locally (port 27017)
3. `cd smart-uni-api`
4. `mvn spring-boot:run`
5. API runs at `http://localhost:8080`
6. Health check: `GET http://localhost:8080/api/health`

### Frontend
1. `cd smart-uni-client`
2. `npm install`
3. `npm run dev`
4. App runs at `http://localhost:5173`

## Branching Strategy
- `main` — stable, tested code only
- `dev` — integration branch, merge features here first
- `feature/module-a-resources` — Member 1
- `feature/module-b-bookings` — Member 2
- `feature/module-c-tickets` — Member 3
- `feature/module-d-notifications-auth` — Member 4

## Team Contributions
| Member | Module | Endpoints |
|--------|--------|-----------|
| Member 1 | Facilities & Assets Catalogue | TBD |
| Member 2 | Booking Management | TBD |
| Member 3 | Incident Ticketing | TBD |
| Member 4 | Notifications + OAuth | TBD |

### Environment Variables
1. Inside `smart-uni-api/`, create a `.env` file based on `.env.example`
2. Fill in your MongoDB Atlas URI
3. Never commit the `.env` file