# 📘 EduResponse AI

EduResponse AI is a modern, full-stack academic feedback and learning analytics platform built using **Django REST Framework** and a **React (Vite + TypeScript)** frontend.

The system enables structured teaching feedback collection from students and provides faculty with actionable insights through analytics, charts, and exportable reports.

---

## 🚀 Features

### 👨‍🎓 Student Module

* Submit structured feedback on teaching sessions
* Simple and responsive question-based interface
* One-time feedback submission per poll
* View active feedback forms

### 👨‍🏫 Faculty Module

* Create and manage feedback questions
* View student responses in real-time
* Analyze teaching effectiveness through insights
* Download CSV and PDF reports

### 👨‍💼 Admin Module

* Manage students and faculty
* Create and schedule feedback polls
* Monitor system-wide analytics
* Export institutional reports

### 📊 Analytics Dashboard

* Pie charts, bar graphs, and histograms
* Response distribution analysis
* Engagement and clarity metrics visualization
* Faculty performance insights

### 📤 Export System

* Download responses as CSV
* Generate PDF reports
* Faculty-wise performance reports
* Poll summary reports

### 🔐 Authentication System

* JWT-based login and registration
* Role-based access control
* Secure password hashing
* Protected API endpoints

---

## 📸 Screenshots

### 🔐 Login Page

A secure authentication interface with JWT-based login and role-based access.

![Login Page](docs/SigninPage.png)

---

### 📝 Registration Page

User-friendly registration flow for students and faculty.

![Registration Page](docs/screenshots/register.png)

---

### 🏠 Dashboard Overview

Central hub displaying user activity, statistics, and quick navigation.

![Dashboard](docs/screenshots/register.png)

---

### 👨‍🏫 Faculty Dashboard

Faculty can manage feedback forms, view responses, and access analytics.

![Faculty Dashboard](assets/screenshots/faculty-dashboard.png)

---

### 👨‍🎓 Student Feedback Portal

Students can view active polls and submit structured feedback.

![Student Portal](docs/screenshots/student-feedback.png)

---

### 📊 Analytics Dashboard

Interactive charts and visualizations for feedback analysis.

![Analytics Dashboard](docs/screenshots/analytics.png)

---

### 📤 Export System

Generate and download CSV and PDF reports.

![Export System](docs/screenshots/export.png)

---

## 🛠️ Tech Stack

### Backend

* Django
* Django REST Framework
* JWT Authentication
* SQLite / PostgreSQL
* ReportLab
* CSV Export Utilities

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Axios
* React Query
* Recharts
* ShadCN UI

---

## 🧠 Project Goal

To replace traditional manual feedback forms with a digital, structured, and analytics-driven system that helps educators understand teaching effectiveness and improve learning outcomes.

---

## 📦 API Highlights

```http
POST /api/auth/register/
POST /api/auth/login/
GET  /api/auth/profile/

POST /api/polls/
GET  /api/polls/
POST /api/polls/{id}/submit/

GET  /api/analytics/
GET  /api/export/responses/csv/
GET  /api/export/responses/pdf/
```

---

## 🚀 How It Works

1. Users register as Student, Faculty, or Admin.
2. Admin creates and manages feedback polls.
3. Faculty creates and manages feedback questions.
4. Students submit structured feedback.
5. Responses are analyzed and visualized.
6. Reports can be exported as CSV or PDF.

---

## 🎯 Key Outcomes

* Real-time teaching feedback collection
* Data-driven academic insights
* Role-based system architecture
* Exportable reports for academic review
* Scalable full-stack application design

---

## 📂 Project Structure

```text
EduResponse-AI/
│
├── backend/
│   ├── apps/
│   ├── core/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│   └── screenshots/
│
└── README.md
```

---

## 📌 Status

* ✅ Backend Development Completed
* ✅ Authentication Implemented
* ✅ Analytics Dashboard Working
* ✅ CSV Export Functional
* ✅ PDF Export Functional
* ✅ Responsive UI Implemented
* 🚧 AI Feedback Insights (Planned)

---

## 🧑‍💻 Author

**Prabath D**

Built as a full-stack academic intelligence platform focused on improving classroom feedback, teaching quality, and educational analytics.
