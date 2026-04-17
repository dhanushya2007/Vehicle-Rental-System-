# 🚗 DriveEasy — Vehicle Rental System

Full-stack vehicle rental application built with React.js, Spring Boot, and PostgreSQL.

---

## 📁 Project Structure

```
vehicle rental/
├── backend/                  # Spring Boot (Java 17)
│   ├── src/main/java/com/vehiclerental/
│   │   ├── config/           # Security, CORS, Exception Handler
│   │   ├── controller/       # REST Controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Spring Data JPA Repos
│   │   ├── security/         # JWT Filter & Util
│   │   └── service/          # Business Logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # React.js 18
│   └── src/
│       ├── api/              # Axios API layer
│       ├── components/       # Navbar, Footer, VehicleCard
│       ├── context/          # AuthContext (JWT state)
│       └── pages/            # Home, Vehicles, Booking, Admin, About, Auth
└── database/
    ├── schema.sql            # Table definitions
    └── sample_data.sql       # Seed data
```

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

---

## 🗄️ Step 1 — Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Run schema
\i database/schema.sql

# Run seed data
\i database/sample_data.sql
```

Or using psql directly:
```bash
psql -U postgres -f database/schema.sql
psql -U postgres -d vehicle_rental -f database/sample_data.sql
```

---

## 🔧 Step 2 — Backend Setup

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/vehicle_rental
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

Run the backend:
```bash
cd backend
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

---

## 💻 Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🔑 Demo Login Credentials

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@rental.com     | password |
| User  | john@example.com     | password |
| User  | jane@example.com     | password |

> Note: The sample_data.sql uses a bcrypt hash for the literal string `password`.
> To generate a fresh hash, use: `new BCryptPasswordEncoder().encode("yourpassword")`

---

## 🌐 REST API Endpoints

### Auth
| Method | Endpoint             | Access  | Description       |
|--------|----------------------|---------|-------------------|
| POST   | /api/auth/register   | Public  | Register new user |
| POST   | /api/auth/login      | Public  | Login & get JWT   |

### Vehicles
| Method | Endpoint             | Access  | Description            |
|--------|----------------------|---------|------------------------|
| GET    | /api/vehicles        | Public  | List all (filter ?type=CAR/BIKE) |
| GET    | /api/vehicles/available | Public | Available vehicles  |
| GET    | /api/vehicles/{id}   | Public  | Get vehicle by ID      |
| POST   | /api/vehicles        | Admin   | Add vehicle            |
| PUT    | /api/vehicles/{id}   | Admin   | Update vehicle         |
| DELETE | /api/vehicles/{id}   | Admin   | Delete vehicle         |

### Bookings
| Method | Endpoint                      | Access | Description           |
|--------|-------------------------------|--------|-----------------------|
| POST   | /api/bookings                 | User   | Create booking        |
| GET    | /api/bookings/my              | User   | My bookings           |
| PUT    | /api/bookings/{id}            | User   | Edit booking          |
| PUT    | /api/bookings/{id}/cancel     | User   | Cancel booking        |
| GET    | /api/bookings/admin/all       | Admin  | All bookings          |
| PUT    | /api/bookings/admin/{id}/status | Admin | Approve/Reject      |

---

## 🚀 Features

- ✅ JWT-based authentication & role-based access (USER / ADMIN)
- ✅ Vehicle listing with search & type filter (CAR / BIKE)
- ✅ Booking with date conflict detection
- ✅ Booking history with edit & cancel
- ✅ Admin dashboard — manage vehicles & approve/reject bookings
- ✅ Responsive design with modern UI
- ✅ Toast notifications for all actions
- ✅ Secure BCrypt password hashing
