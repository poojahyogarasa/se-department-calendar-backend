# 📅 SE Department Calendar Backend

Backend service for the Software Engineering Department Calendar System.

This project provides a secure RESTful API for managing department events, tasks, and user access within the Software Engineering Department Calendar platform. The system supports authentication, role-based authorization, event management, and todo management to help streamline academic and departmental activities.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login
- JWT-Based Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Role-Based Access Control (RBAC)

### 📅 Event Management
- Create Events
- View Events
- Update Events
- Delete Events
- Department Calendar Integration

### ✅ Todo Management
- Create Todos
- View Todos
- Update Todos
- Delete Todos
- Mark Tasks as Completed

### 🛡️ Security Features
- JWT Token Verification
- Authentication Middleware
- Authorization Middleware
- Secure Password Storage
- Environment Variable Protection

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|----------|
| 🟢 Node.js | Runtime Environment |
| ⚡ Express.js | Backend Framework |
| 🐬 MySQL | Relational Database |
| 🗄️ MySQL Workbench | Database Design & Management |
| 🔑 JWT | Authentication |
| 🔒 bcryptjs | Password Hashing |
| 🌱 dotenv | Environment Variable Management |

---

## 📂 Project Structure

```text
se-department-calendar-backend/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/se-department-calendar-backend.git
cd se-department-calendar-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD= ""
DB_NAME=se_department_calendar

JWT_SECRET= ""
```

---

## 🗄️ Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE se_department_calendar;
```

Import your SQL schema and configure the database credentials in the `.env` file.

Database management and schema design were completed using MySQL Workbench.

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start at:

```text
http://localhost:5000
```

---

## 🏗️ System Architecture

```text
Frontend Application
         │
         ▼
 REST API (Express.js)
         │
         ▼
    Controllers
         │
         ▼
    Middleware
         │
         ▼
      MySQL
```

Authentication and authorization are handled using JWT-based middleware and role-based access control.

---

## 🔑 Authentication

Protected endpoints require a JWT token in the request header.

Example:

```http
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### 🔐 Authentication

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

---

### 📅 Events

#### Get All Events

```http
GET /api/events
```

#### Create Event

```http
POST /api/events
```

#### Update Event

```http
PUT /api/events/:id
```

#### Delete Event

```http
DELETE /api/events/:id
```

---

### ✅ Todos

#### Get All Todos

```http
GET /api/todos
```

#### Create Todo

```http
POST /api/todos
```

#### Update Todo

```http
PUT /api/todos/:id
```

#### Delete Todo

```http
DELETE /api/todos/:id
```

---

## 👥 User Roles

### 👨‍💼 Admin
- Full system access
- Manage users
- Manage events
- Manage todos

### 👨‍🏫 Lecturer
- Create and manage events
- Manage assigned tasks

### 👨‍🎓 Student
- View department events
- Manage personal todos

---

## 🗃️ Database Tables

### Users

| Field | Type |
|---------|---------|
| id | INT (PK) |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |

### Events

| Field | Type |
|---------|---------|
| id | INT (PK) |
| title | VARCHAR |
| description | TEXT |
| start_date | DATETIME |
| end_date | DATETIME |
| created_by | INT (FK) |

### Todos

| Field | Type |
|---------|---------|
| id | INT (PK) |
| title | VARCHAR |
| description | TEXT |
| status | BOOLEAN |
| assigned_to | INT (FK) |

---

## 🧪 Testing

Run tests using:

```bash
npm test
```

---

## 🔮 Future Enhancements

- 📧 Email Notifications
- 🔔 Event Reminders
- 📱 Mobile Application Integration
- 📊 Dashboard Analytics
- 📎 File Attachments
- 📖 Swagger API Documentation
- ⚡ Real-Time Notifications

---

## 🚢 Deployment

This application can be deployed using:

- Render
- Railway
- AWS
- DigitalOcean
- VPS Hosting

Make sure the following environment variables are configured:

```env
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
PORT
```

---

## 🤝 Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Poojah Yogarasa**

Software Engineering Undergraduate

---

## 📜 License

This project is licensed under the MIT License.

---

---

⭐ If you found this project useful, consider giving it a star!
