# Doctor Appointment

A full-stack doctor appointment management application. Patients can browse doctors and medical departments, create an account, sign in, book appointments, and manage their bookings. The project also includes admin-facing forms for adding doctors and departments.

> This is a learning/demo project. Do not use it to store real patient or health information without a proper security, privacy, and compliance review.

## Features

- User registration and sign-in with password hashing and JWT authentication
- Browse doctors and departments, view doctor details, and see basic counts
- Book and cancel appointments
- Add doctors and departments through admin-protected routes
- Upload doctor and department images to the server
- React single-page interface with separate Express API

## Tech stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt
- **File uploads:** Multer

## Project structure

```text
.
├── auth/                 # JWT authentication middleware
├── config/               # MongoDB connection
├── models/               # Mongoose schemas
├── routes/               # Express API routes
├── uploads/              # Runtime uploads (not committed)
├── server.js             # API server entry point
└── frontend/
    └── frontend/         # React/Vite application
```

## Requirements

- Node.js and npm
- MongoDB running locally, or a MongoDB connection URI

## Run locally

1. Install the backend dependencies from the repository root:

   ```bash
   npm install
   ```

2. Create a local `.env` file by copying `.env.example`, then set `MONGO_URI` and replace `JWT_SECRET` with a long, random value. Keep `.env` private and never commit it.

3. Start the API server from the repository root:

   ```bash
   npm run dev
   ```

4. In a separate terminal, install and start the frontend:

   ```bash
   cd frontend/frontend
   npm install
   npm run dev
   ```

The API listens on port `5000` by default. The current frontend API requests point to `http://localhost:5000`, so the app is configured for local development; update the frontend API base URLs before deploying the client to another environment.

## Available scripts

| Location | Command | Description |
| --- | --- | --- |
| Repository root | `npm run dev` | Start the backend with Nodemon |
| `frontend/frontend` | `npm run dev` | Start the Vite development server |
| `frontend/frontend` | `npm run build` | Create a production frontend build |
| `frontend/frontend` | `npm run lint` | Run ESLint on the frontend |
| `frontend/frontend` | `npm run preview` | Preview the production frontend build |

## API overview

All routes are served by the backend on `http://localhost:5000`.

| Area | Routes |
| --- | --- |
| Users | `GET /api/users`, `POST /api/users/register`, `POST /api/users/signin` |
| Doctors | `GET /api/doctors/getDoctors`, `GET /api/doctors/:id`, `GET /api/doctors/countDoctors`, `POST /api/doctors/addDoctors` |
| Departments | `GET /api/departments/getDepertments`, `GET /api/departments/countDepertments`, `GET /api/departments/:id`, `POST /api/departments/addDepertments`, `DELETE /api/departments/deleteDepertment/:id` |
| Appointments | `POST /api/appointments/bookAppointment`, `GET /api/appointments/getAppointments`, `POST /api/appointments/cancelAppointment/:id` |

Protected endpoints require a bearer token in the `Authorization` header. Creating doctors and departments requires the `admin` role. Uploaded images are served from `/uploads`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Backend HTTP port | `5000` |
| `MONGO_URI` | MongoDB connection string | None |
| `JWT_SECRET` | Secret used to sign and verify JWTs | None |

## Git and uploads

The root `.gitignore` excludes environment files, dependencies, build output, and uploaded files. Uploaded images are runtime data and are intentionally not included in the repository. The `uploads/.gitkeep` placeholder keeps the directory available for new uploads after cloning.
