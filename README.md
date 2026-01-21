# TCU Marketplace

TCU Marketplace is a student-focused marketplace for Texas Christian University where students can buy, sell, and trade items on campus.

## Requirements

- Node.js and npm

## Setup

Install dependencies for both apps:

```powershell
cd server
npm install
cd ..\client
npm install
```

## Environment variables

Create `server/.env`:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Create `client/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

## Run in development

Start the API server:

```powershell
cd server
npm run dev
```

Start the client (in a new terminal):

```powershell
cd client
npm run dev
```

The client runs at `http://localhost:5173` by default and the API runs at `http://localhost:3001`.
