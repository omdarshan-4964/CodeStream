# CodeStream - Production Deployment Guide

## Quick Start for Deployment

CodeStream is ready for production deployment on **Vercel** (frontend) and **Render** (database + backend).

### Prerequisites
- GitHub account with repository access
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- Google OAuth credentials
- Google Generative AI API key

### One-Click Deployment (Recommended)

#### Option 1: Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com
2. **Import Repository**:
   - Click "New Project"
   - Select GitHub repository
   - Click "Import"

3. **Add Environment Variables**:
   - Go to Settings → Environment Variables
   - Add the variables from `.env.example`

4. **Deploy**: Click "Deploy"

#### Option 2: Deploy Database to Render

1. **Create PostgreSQL Database**:
   - Render Dashboard → "New +" → "PostgreSQL"
   - Name: `codestream-db`
   - Copy the connection string

2. **Run Migrations**:
   ```bash
   export DATABASE_URL="<connection-string>"
   npx prisma migrate deploy
   ```

#### Option 3: Deploy Backend to Render

1. **Create Web Service**:
   - Render Dashboard → "New +" → "Web Service"
   - Connect GitHub repository
   - Start command: `cd server && npm start`

2. **Add Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=5000`

### Environment Variables Needed

**For Vercel:**
```
NEXTAUTH_SECRET=<generate-32-char-string>
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=<from-google-cloud>
GOOGLE_CLIENT_SECRET=<from-google-cloud>
DATABASE_URL=<from-render>
GEMINI_API_KEY=<from-google-generative-ai>
NEXT_PUBLIC_SOCKET_IO_SERVER=https://your-backend.onrender.com
```

**For Render Backend:**
```
NODE_ENV=production
PORT=5000
```

---

## Detailed Deployment Steps

See **`DEPLOYMENT_GUIDE.md`** for complete step-by-step instructions including:
- PostgreSQL setup
- Google OAuth configuration
- Environment variable setup
- Troubleshooting tips
- Monitoring and logs

---

## Project Structure

```
codestream/
├── app/                    # Next.js frontend
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── room/             # Room pages
│   └── layout.tsx        # Root layout
├── components/           # Shadcn/ui components
├── lib/                  # Utilities (auth, etc.)
├── hooks/                # React hooks
├── prisma/               # Database schema
├── server/               # Socket.IO backend
└── vercel.json          # Vercel deployment config
```

---

## Technology Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **Auth**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Code Editor**: CodeMirror
- **AI Assistant**: Google Generative AI (Gemini)
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion

---

## Features

✨ **Real-time Collaboration**
- Live code editing with multiple users
- Team member tracking
- Instant synchronization

🤖 **AI Assistant**
- Gemini-powered code suggestions
- Debugging help
- Code explanations

💻 **Code Execution**
- Multi-language support (Java, JavaScript, Python)
- Live input/output
- Judge0 integration

🎨 **Modern UI**
- Dark theme
- Smooth animations
- Professional design

---

## Production Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Google OAuth configured
- [ ] Database migrations completed
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Tested all features in production

---

## Support & Troubleshooting

### Build Issues
- Check `npm install` runs successfully
- Verify all dependencies in `package.json`
- Check build logs on Vercel/Render

### Runtime Issues
- Check environment variables are set
- Verify database connection
- Check Socket.IO connection
- Review logs on deployment platform

### Database Issues
- Verify connection string format
- Check IP allowlist (for Render)
- Run migrations: `npx prisma migrate deploy`

---

## Monitoring

### Vercel Analytics
- Dashboard → Analytics
- Monitor performance, CLS, FCP, etc.

### Render Logs
- Dashboard → Service → Logs
- Check for errors and warnings

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

---

## Scaling

As traffic grows:

1. **Database**:
   - Upgrade Render plan to Starter+ or higher
   - Enable connection pooling
   - Add read replicas

2. **Backend**:
   - Upgrade from free to standard tier
   - Enable auto-scaling
   - Distribute across regions

3. **Frontend**:
   - Vercel handles scaling automatically
   - Consider upgrading to Pro for better features

---

## Cost Estimate

| Service | Free | Production |
|---------|------|-----------|
| Vercel | Yes (generous) | $20+/month |
| Render DB | ~1GB | $7+/month |
| Render Backend | Free | $7+/month |
| **Monthly Total** | ~$0 | ~$34/month |

---

## Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## Getting Help

1. Check `DEPLOYMENT_GUIDE.md` for detailed steps
2. Review deployment platform logs
3. Check GitHub issues
4. Contact support on deployment platform

---

**Status**: ✅ Ready for Production Deployment

