# QuantumQuill - AI-Assisted Technical Knowledge Sharing Platform

QuantumQuill is a modern, full-stack knowledge platform built for developers, engineers, and technical enthusiasts. It combines the power of Spring Boot 3, React 18, and Gemini AI to create a seamless writing and discovery experience.

## ✨ Key Features

- **Premium Design System**: Sophisticated dark mode with high-end typography (`Merriweather` & `Inter`) and amber accents.
- **AI Writing Assistant**: Integrated Gemini-pro model for expanding bullet points, suggesting tags, and generating article summaries.
- **Secure Architecture**: Spring Boot 3 with JPA, MySQL, and JWT-based authentication using httpOnly cookies for enhanced security.
- **Rich Editor**: Custom-themed CKEditor 5 for a seamless technical writing experience.
- **Discovery Layer**: Paginated home feed with high-fidelity article cards and responsive layouts.

## 🛠 Tech Stack

### Backend
- **Java 17+** with **Spring Boot 3.2.x**
- **Spring Security 6** (JWT & BCrypt)
- **MySQL 8.0** with **Hibernate/JPA**
- **Lombok** & **Jakarta Validation**
- **Gemini AI API** integration

### Frontend
- **React 18** (Vite scaffold)
- **Tailwind CSS** (Premium Design System)
- **React Router 6**
- **TanStack Query** (Data Fetching)
- **CKEditor 5** (Rich Text Editor)
- **Lucide React** (Iconography)

## 🚀 Getting Started

### 1. Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL Server 8.0

### 2. Backend Setup
1. Create a MySQL database named `knowledge_sharing`.
2. Configure `backend/src/main/resources/application.yml` with your database credentials and **Gemini API Key**.
3. Run the application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### 3. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
