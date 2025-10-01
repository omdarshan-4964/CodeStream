# 🚀 CodeStream - Real-Time Collaborative Code Editor

Live Demo: [https://code-stream-rho.vercel.app/](https://code-stream-rho.vercel.app/)

CodeStream is a **full-stack web application** that provides a **real-time, multi-user collaborative code editing environment** directly in the browser.  
Inspired by tools like **VS Code Live Share** and **Replit**, it allows developers to **create a workspace, share a unique link, and code together instantly.**

This project demonstrates deep knowledge of:
- **Distributed systems**
- **Real-time data synchronization with WebSockets**
- **Modern full-stack development & deployment practices**

---

## ✨ Key Features

- **⚡ Real-Time Collaboration** – Code changes are instantly reflected for all users in the same session.
- **🔒 Session-Based Workspaces** – Isolated collaboration rooms ensure privacy & security.
- **📂 Integrated File System** – Sidebar with file & folder structure synced with the server.
- **📑 Dynamic File Loading** – Load files on click directly into the editor.
- **📝 VS Code-Like Experience** – Powered by **Monaco Editor** (the core of VS Code).
- **🎨 Modern Landing Page** – Easily create or join a workspace with a clean UI.

---

## 🏗️ Architecture Overview

CodeStream is built as a **distributed system** with three core components:

1. **Frontend (Next.js + TypeScript)**  
   - UI rendering, state management, client interactions.

2. **File Manager (Next.js REST API)**  
   - Handles file system operations (list, read, save).

3. **Real-Time Engine (WebSocket Server)**  
   - Persistent connections for instant collaboration in workspace rooms.

---

## 🛠️ Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS, Monaco Editor  
**Backend:** Node.js, WebSockets (`ws`), Next.js API Routes  
**Database:** PostgreSQL (with Prisma ORM)  
**Authentication:** JSON Web Tokens (JWT)  
**Deployment:** Vercel (Frontend), Render (WebSocket Server), Docker  

---

## 🖥️ Local Development Setup

### ✅ Prerequisites
- Node.js (v18 or later)  
- Docker Desktop  

---

### 1. Clone the Repository 
```bash
git clone https://github.com/omdarshan-4964/CodeStream.git
cd CodeStream
```
### 2. Install Dependencies
``` bash
npm install
```
### 3. Set Up Environment Variables
Create a .env file in the project root:
``` bash
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/postgres"
JWT_SECRET="yoursecretkey"
```

### 4. Start the Database (Docker)
``` bash
docker run --name codestream-db -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```
### 5. Run Database Migrations
```bash
npx prisma migrate dev
```
### 6. Run the Application
**Terminal 1:** Start the Next.js Web App
``` bash
npm run dev
```
**Terminal 2:** Start the WebSocket Server
``` bash
npm run dev:ws
```
## 📸 Screenshots

Coming soon... 🎊

---

## 🚀 Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com/)  
- **WebSocket Server:** Hosted on [Render](https://render.com/)  
- **Database:** PostgreSQL with Docker (local) / hosted service (production)  

---

## 👨‍💻 Author

**Omdarshan Shindepatil**  
🔗 [GitHub](https://github.com/omdarshan-4964) | [LinkedIn](https://linkedin.com/in/omdarshan-shindepatil)  

---

## ⭐ Support

If you like this project, don’t forget to **star the repo ⭐** to support development!






