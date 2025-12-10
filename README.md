# 🎨 CodeStream - Real-time Collaborative Code Editor

**CodeStream** is a modern, real-time collaborative code editor with AI-powered assistance, intelligent Git integration, and instant code execution. Build together, ship faster.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-green?style=flat&logo=socket.io)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

- 🤝 **Real-time Collaboration** - Code together with live cursor tracking and synchronized editing
- 🤖 **AI Chat Assistant** - Powered by Google Gemini 2.5-flash for intelligent code suggestions and debugging help
- 🔧 **Smart Git Integration** - AI-generated commit messages with visual staging and status tracking
- ⚡ **Multi-Language Execution** - Run Java, JavaScript, and Python code instantly with Judge0 API
- 🔐 **Secure Authentication** - GitHub and Google OAuth via NextAuth.js
- 💾 **Persistent Rooms** - Create and join coding rooms that persist across sessions
- 🎨 **Modern Glass UI** - Beautiful glassmorphism design with smooth animations
- 📱 **Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
- 🎯 **Coming Soon: Interview Mode** - Practice coding problems with built-in test cases and timer

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[CodeMirror 6](https://codemirror.net/)** - Powerful code editor
- **[Socket.IO Client](https://socket.io/)** - Real-time bidirectional communication
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown rendering for AI chat

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Socket.IO Server](https://socket.io/)** - WebSocket server for collaboration
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database toolkit
- **[PostgreSQL](https://www.postgresql.org/)** - Production database
- **[NextAuth.js v4](https://next-auth.js.org/)** - Complete authentication solution
- **[simple-git](https://github.com/steveukx/git-js)** - Git operations in Node.js

### AI & APIs
- **[Google Gemini 2.5-flash](https://ai.google.dev/)** - AI chat and commit message generation
- **[Judge0 CE](https://judge0.com/)** - Secure code execution engine (50+ languages)

---

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** database (local or cloud - Render, Neon, Supabase)
- **Google OAuth** credentials ([Setup Guide](https://console.cloud.google.com/))
- **GitHub OAuth** credentials ([Create OAuth App](https://github.com/settings/developers))
- **Judge0 API Key** ([RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce))
- **Google Gemini API Key** ([Get API Key](https://makersuite.google.com/app/apikey))

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/omdarshan-4964/CodeStream---Code-Editor.git
cd CodeStream---Code-Editor
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend Socket.IO server dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the **root directory**:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth Credentials (Optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# API Keys
JUDGE0_API_KEY="your-judge0-rapidapi-key"
GEMINI_API_KEY="your-google-gemini-api-key"

# Socket.IO Server URL (Client-side accessible)
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Open Prisma Studio to manage data
npx prisma studio
```

### 5. Run Development Servers

Open **two terminals**:

**Terminal 1 - Next.js Frontend (Port 3000):**
```bash
npm run dev
```

**Terminal 2 - Socket.IO Backend (Port 5000):**
```bash
cd server
npm run dev
```

### 6. Open Application

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
CodeStream/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── chat/            # AI chat assistant
│   │   ├── execute/         # Code execution
│   │   ├── git/             # Git operations
│   │   └── rooms/           # Room management
│   ├── components/          # Page-specific components
│   ├── dashboard/           # Dashboard page
│   ├── room/[roomId]/       # Collaborative room page
│   └── layout.tsx           # Root layout
├── components/ui/           # Reusable UI components
├── lib/                     # Utility functions
├── prisma/                  # Database schema
├── server/                  # Socket.IO server
│   ├── index.ts            # WebSocket server
│   └── package.json        # Server dependencies
└── public/                  # Static assets
```

---

## 🚢 Deployment

### Backend (Socket.IO Server) → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
   - **Environment:** Node
4. Deploy and copy the service URL (e.g., `https://your-app.onrender.com`)

### Frontend (Next.js) → Vercel

1. Import project on [Vercel](https://vercel.com)
2. Connect GitHub repository
3. Add environment variables:
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` (if using GitHub auth)
   - `GITHUB_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel domain)
   - `JUDGE0_API_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SOCKET_URL` (your Render backend URL)
4. Deploy!

### Database → Render/Neon/Supabase

Use a managed PostgreSQL service:
- [Render PostgreSQL](https://render.com/docs/databases)
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)

Update `DATABASE_URL` in your environment variables.

---

## 🎯 Usage Guide

### Creating a Room

1. Sign in with Google or GitHub
2. Enter your username
3. Click **"Create New Room"**
4. Share the Room ID with collaborators

### Joining a Room

1. Sign in
2. Enter Room ID
3. Click **"Join Room"**
4. Start coding together!

### Using AI Chat Assistant

1. Click the chat icon in the room
2. Ask coding questions, request debugging help, or get explanations
3. AI responds with syntax-highlighted code

### Git Integration

1. Initialize git in your project folder: `git init`
2. Open Git Panel in the room
3. Stage files and use AI to generate commit messages
4. Review and commit changes

---

## 🔑 API Keys Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Judge0 API
1. Sign up at [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to free tier (50 requests/day)
3. Copy your API key

### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy and add to `.env`

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Sync schema to database
```

---

## 🐛 Troubleshooting

### Socket.IO connection fails
- Ensure backend server is running on port 5000
- Check `NEXT_PUBLIC_SOCKET_URL` matches your server URL
- Verify CORS settings in `server/index.ts`

### Database connection error
- Verify `DATABASE_URL` format is correct
- Check database is running and accessible
- Run `npx prisma db push` to sync schema

### OAuth redirect error
- Ensure redirect URIs are configured in OAuth settings
- Check `NEXTAUTH_URL` matches your domain
- Verify OAuth credentials are correct

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Judge0](https://judge0.com/) for code execution
- [Socket.IO](https://socket.io/) for real-time features

---

## 📧 Contact

**Omdarshan Shindepati**  
GitHub: [@omdarshan-4964](https://github.com/omdarshan-4964)

---

<div align="center">
  <p>Made with ❤️ using Next.js, TypeScript, and Google Gemini</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
