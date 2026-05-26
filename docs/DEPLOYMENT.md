# Deployment Guide

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://athulkrshnaps_db_user:Kannan@123@cluster0.rqqzdsl.mongodb.net/?appName=Cluster0
JWT_SECRET=yourStrongSecret
CLIENT_URL=http://localhost:5173
```

## Local Development

```bash
npm install
npm run seed
npm run dev
```

## Production Build

```bash
npm install
npm run build
npm run start --workspace server
```

This builds the React frontend into `client/dist` and starts the Express backend.
In production, the backend will serve the static site from that build folder.

If you host the backend and frontend separately, keep `CLIENT_URL` set to your deployed frontend URL and use `npm run start --workspace server` for the API.

## Suggested Hosting

- Frontend: Vercel, Netlify, or static hosting from Express.
- Backend: Render, Railway, Fly.io, or a VPS.
- Database: MongoDB Atlas.
- Uploaded media: Cloudinary, S3-compatible storage, or local disk for small deployments.

## Security Checklist

- Set a strong `JWT_SECRET`.
- Use MongoDB Atlas network restrictions.
- Enable HTTPS.
- Configure CORS to the production client URL.
- Store uploads outside the public application root or use a managed media service.
- Add backups for MongoDB.
