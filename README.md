# MERN Blog Application

A production-ready MERN blog app with an Express/MongoDB REST API, JWT admin authentication, image uploads, URL media support, public likes/comments, and a responsive React dashboard.

## Tech Stack

- Frontend: React, Vite, Axios, React Router DOM, React Hook Form, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Uploads: Multer
- Quality: validation middleware, centralized errors, MVC structure, environment-based config

## Project Structure

```text
blog-app/
├── client/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── server/
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── API_DOCUMENTATION.md
└── README.md
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Update `server/.env` with your MongoDB Atlas connection string and a strong `JWT_SECRET`.

### 2. Seed Sample Data

```bash
cd server
npm run seed
```

Demo admin:

```text
admin@example.com
password123
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the API defaults to `http://localhost:5000/api`.

## Environment Variables

Backend variables live in `server/.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern_blog
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

Frontend variables live in `client/.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend on Vercel

- Set root directory to `client`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_API_URL` pointing to the deployed backend `/api` URL.

### Backend on Vercel

- Set root directory to `server`.
- Add environment variables from `server/.env.example`.
- `server/vercel.json` routes requests to `api/index.js` for serverless execution.
- Use MongoDB Atlas for the database.

## Notes

- Uploaded files are served from `/uploads` in local/server deployments.
- In fully serverless deployments, persistent local uploads are not guaranteed by platform storage. For long-term production media storage, connect the upload middleware to S3, Cloudinary, or another object store.
- Public like/unlike state is tracked by the frontend in `localStorage` because users are anonymous.

## Verification

The project was verified with:

```bash
cd server && node -e "import('./app.js').then(() => console.log('app import ok'))"
cd client && npm run build
```
