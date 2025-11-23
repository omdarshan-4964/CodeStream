# 🎨 CodeStream v2

**CodeStream** is a real-time collaborative code editor with AI-powered assistance. Write code together, execute it instantly, and get intelligent suggestions—all in one beautiful interface.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-green?style=flat&logo=socket.io)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)

---

## ✨ Features

- 🤝 **Real-time Collaboration** - Multiple users can edit code simultaneously
- 🤖 **AI Assistant** - Powered by Google Gemini for intelligent code suggestions
- ⚡ **Multi-Language Support** - Execute Java, JavaScript, and Python code
- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth.js
- 💾 **Persistent Rooms** - Create and join coding rooms that persist across sessions
- 🎨 **Modern UI** - Beautiful dark theme with Tailwind CSS and Radix UI
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[CodeMirror](https://codemirror.net/)** - Powerful code editor
- **[Socket.IO Client](https://socket.io/)** - Real-time communication
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Socket.IO Server](https://socket.io/)** - WebSocket server for real-time features
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication framework

### APIs
- **[Judge0](https://judge0.com/)** - Code execution engine
- **[Google Gemini](https://ai.google.dev/)** - AI-powered code assistance

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** database (local or cloud)
- **Google OAuth** credentials ([Setup Guide](https://support.google.com/cloud/answer/6158849))
- **Judge0 API Key** ([Get from RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce))
- **Google Gemini API Key** ([Get from Google AI](https://makersuite.google.com/app/apikey))

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codestream.git
cd codestream
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codestream"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# API Keys
JUDGE0_API_KEY="your-judge0-api-key"
GEMINI_API_KEY="your-gemini-api-key"

# Socket.IO Server
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Run the Development Servers

**Terminal 1 - Next.js Frontend:**
```bash
npm run dev
```

**Terminal 2 - Socket.IO Backend:**
```bash
cd server
npm run dev
```

### 6. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

Made with ❤️ by the CodeStream Team
