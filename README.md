# Skill Swap Platform - Odoo Hackathon 2025

Problem Statement 1 - A mini application that allows users to list their skills, request swaps, and connect with others in real-time to trade knowledge.

---

## 👥 Team Members

| Name             | Email                     |
|------------------|---------------------------|
| Chirag Khairnar   | ck7885@srmist.edu.in    |
| Apurva Shovit  | as6324@srmist.edu.in      |
| Vedant Tiwari  | vt1646@srmist.edu.in     |

# Skill Swap Platform

A web application that allows users to exchange skills with others. Users can list skills they offer and skills they want, connect with other users for swaps, and leave feedback after successful exchanges.

## Features

### User Functionality
- Sign up and log in securely using JWT authentication.
- View and edit personal profile.
- Public/private profile toggle (only complete profiles can be public).
- Add skills from a predefined list or define new ones.
- Browse public profiles of other users.
- Propose skill swaps (one skill offered for one skill wanted).
- Accept or reject incoming swap requests.
- Leave feedback after a completed swap.
- Cancel unaccepted swap requests.

### Admin Functionality (Optional/To be extended)
- Moderate skill descriptions and feedback.
- Ban users or send platform-wide messages.

## Tech Stack

| Layer       | Technology        |
|------------|-------------------|
| Frontend   | React + Vite      |
| Backend    | Node.js + Express |
| Database   | PostgreSQL        |
| Auth       | JWT (JSON Web Token) |
| Styling    | Tailwind CSS / Custom CSS |


## Video Link

[Click here to view the video folder](https://drive.google.com/drive/folders/1bQ-0mYgWVAYZHybexYRynCkq4Xxg4Xvo?usp=sharing)


## Setup Instructions

### Prerequisites
- Node.js (version 18.x or higher)
- PostgreSQL
- A `.env` file configured inside the backend directory

### 1. Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

Inside backend\.env
```bash
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swap_skill
JWT_SECRET=your_secret_key
```

start the backend server- 
```bash
cd backend
node index.js
```

start the frontend server- 
```bash
cd frontend
npm run dev
```

Access the Application
Frontend: http://localhost:5173
Backend API: http://localhost:3000
