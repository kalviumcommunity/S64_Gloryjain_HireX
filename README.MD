# HireX – Full-Stack Job Portal 💼🚀

**HireX** is a modern, full-stack job portal designed to connect job seekers and employers. It streamlines the hiring process with features like job postings, applications, personalized dashboards, and admin controls — all built with robust full-stack technologies.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## ✨ Features

### 1. User Authentication  
Secure JWT login with role-based access for **job seekers**, **recruiters**, and **admins**.

### 2. Job Listings  
Recruiters can **create**, **edit**, and **delete** job posts easily.

### 3. Job Applications  
Applicants can submit **resumes** and **cover letters** directly through the platform.

### 4. Dashboards  
Custom dashboards for job seekers and recruiters to manage applications and postings.

### 5. Search & Filter  
Powerful filters to search jobs by **title**, **location**, **salary**, and **type**.

### 6. Admin Panel  
Admins can manage all users and job listings with elevated privileges.

### 7. Role-Based Access Control  
Secure routes and views based on user roles to ensure proper access.

---

## 🛠 Tech Stack

### 🔹 Frontend
- React.js (or Next.js)
- TailwindCSS
- Axios
- Zustand or Context API

### 🔸 Backend
- Node.js + Express.js
- MongoDB or PostgreSQL
- JWT Auth

### 🔧 Dev Tools
- Postman
- Nodemon

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GLORY-JAIN/hirex.git
cd hirex
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Create Environment Variables

Inside `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the Application

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

---

## 📁 Project Structure

```
hirex/
├── client/           # Frontend
│   └── src/
├── server/           # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
├── .env
└── README.md
```

---

## 🤝 Contributing

We welcome contributions to **HireX**!  
To contribute:

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit your changes  
4. Push and open a PR 🚀

---

> Made with ❤ by **Glory Jain**

 Backend deployment link: "https://s64-gloryjain-hirex.onrender.com"

 frontend deployment link: "https://hirex12.netlify.app/"