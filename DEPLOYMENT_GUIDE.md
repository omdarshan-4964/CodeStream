# 🚀 Deployment Guide - Vercel & Render

## Overview
CodeStream is designed to be deployed on:
- **Frontend:** Vercel (Next.js app)
- **Database:** Render (PostgreSQL)
- **Backend:** Render (Node.js Socket.IO server)

---

## Prerequisites

1. **Vercel Account** - https://vercel.com
2. **Render Account** - https://render.com
3. **Google OAuth Credentials** - https://console.cloud.google.com
4. **Google Generative AI API Key** - https://makersuite.google.com/app/apikey
5. **GitHub Repository** - Push your code to GitHub first

---

## Step 1: Set Up PostgreSQL Database on Render

### 1.1 Create PostgreSQL Database
1. Log in to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name:** `codestream-db`
   - **Database:** `codestream`
   - **User:** `codestream_user`
   - **Region:** Same as your backend (e.g., `us-east`)
   - **Plan:** Free (for development) or Starter+ (for production)
4. Copy the **Internal Database URL** (for backend)
5. Copy the **External Database URL** (for local migrations)

### 1.2 Create Prisma Migration
```bash
# Run locally first
export DATABASE_URL="postgresql://user:password@host:5432/codestream"
npx prisma migrate deploy
```

---

## Step 2: Deploy Backend (Socket.IO Server) to Render

### 2.1 Create Backend Service
1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `codestream-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free or paid

### 2.2 Add Environment Variables
In Render dashboard, add:
```
NODE_ENV=production
PORT=5000
```

### 2.3 Note Backend URL
The backend will be deployed at: `https://codestream-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select project root (don't change)

### 3.2 Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXTAUTH_SECRET=<random-32-character-string>
NEXTAUTH_URL=https://codestream.vercel.app

GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>

DATABASE_URL=<postgresql-internal-url-from-render>

GEMINI_API_KEY=<from-google-generative-ai>
```

### 3.3 Build Settings
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 3.4 Deploy
Click "Deploy" - Vercel will build and deploy automatically

---

## Environment Variables Required

### For Frontend (Vercel)
```
NEXTAUTH_SECRET         - Session encryption key (min 32 chars)
NEXTAUTH_URL            - https://your-vercel-domain.vercel.app
GOOGLE_CLIENT_ID        - From Google Cloud Console
GOOGLE_CLIENT_SECRET    - From Google Cloud Console
DATABASE_URL            - PostgreSQL connection string (internal)
GEMINI_API_KEY          - From Google Generative AI
```

### For Backend (Render)
```
NODE_ENV                - production
PORT                    - 5000 (or configured by Render)
```

---

## Step 4: Configure Google OAuth

### 4.1 Create OAuth Credentials
1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. Set Application type: "Web application"
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (production)
6. Copy the Client ID and Secret

### 4.2 Add to Vercel
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## Step 5: Configure Database Connection

### 5.1 Update Backend Connection
In backend `server/.env`:
```
DATABASE_URL=postgresql://user:password@render-host:5432/codestream
```

### 5.2 Update Frontend Connection (Vercel)
In Vercel Environment Variables:
```
DATABASE_URL=postgresql://user:password@render-internal-host:5432/codestream
```

---

## Step 6: Update Socket.IO Connection

### 6.1 Update RoomClient Socket Connection
In `app/room/[roomId]/RoomClient.tsx`:

**Development (localhost):**
```tsx
const newSocket = io("http://localhost:5000");
```

**Production (Render):**
```tsx
const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_IO_SERVER || "https://codestream-backend.onrender.com");
```

### 6.2 Add Environment Variable to Vercel
```
NEXT_PUBLIC_SOCKET_IO_SERVER=https://codestream-backend.onrender.com
```

Note: Must prefix with `NEXT_PUBLIC_` to be accessible in browser

---

## Verification Checklist

- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Vercel with correct environment variables
- [ ] Google OAuth credentials configured
- [ ] Database migrations completed
- [ ] Socket.IO connection working
- [ ] Authentication flow works
- [ ] Rooms can be created and joined
- [ ] Code execution works
- [ ] Chat with Gemini works

---

## Troubleshooting

### Build Fails on Vercel
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check build logs: Settings → Git → Redeploy

### Database Connection Error
- Verify DATABASE_URL format is correct
- Check IP allowlist on Render (allow all for development)
- Test connection: `psql <DATABASE_URL>`

### Socket.IO Not Connecting
- Verify backend is running on Render
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_SOCKET_IO_SERVER` is set in Vercel

### Authentication Not Working
- Verify Google credentials are correct
- Check `NEXTAUTH_SECRET` is set (must be 32+ chars)
- Verify `NEXTAUTH_URL` matches Vercel domain
- Clear cookies and try again

---

## Monitoring & Logs

### Vercel Logs
- Dashboard → Deployments → Select deployment → Logs

### Render Logs
- Dashboard → Service → Logs

### Database Logs
- Render Dashboard → PostgreSQL service → Logs

---

## Production Optimization

### Vercel
- Enable "Automatic Git integration" for auto-deploys
- Set up preview deployments for PR reviews
- Configure caching for static assets

### Render
- Upgrade database plan for better performance
- Set up auto-restarting for backend
- Configure backup retention

---

## Cost Estimate

### Vercel
- Free tier: Generous for hobby projects
- Pro: $20/month for team features

### Render
- PostgreSQL Free: Good for development
- PostgreSQL Starter+: $7/month (production ready)
- Web Service Free: Good for side projects
- Web Service Standard: $7/month minimum

---

## Next Steps

1. Push code to GitHub
2. Follow deployment steps above
3. Test all features in production
4. Monitor logs and performance
5. Set up uptime monitoring
6. Plan backup strategy

