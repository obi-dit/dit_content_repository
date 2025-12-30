# Proxy Setup Documentation

## Overview

The Next.js application is configured to run on port **6000** and proxy all API requests to the backend NestJS API server.

## Configuration

### Next.js Configuration (`next.config.ts`)

The proxy is configured using Next.js `rewrites` feature:

```typescript
async rewrites() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  return [
    {
      source: "/api/:path*",
      destination: `${apiUrl}/api/:path*`,
    },
  ];
}
```

This configuration:

- Intercepts all requests to `/api/*`
- Proxies them to the backend API server (default: `http://localhost:3000`)
- Preserves the full path including the `/api` prefix

### Port Configuration

The Next.js dev server runs on port **6000**:

- Development: `npm run dev` → `http://localhost:6000`
- Production: `npm start` → `http://localhost:6000`

### HTTP Service

The `httpService` automatically uses relative paths when running in the browser, which allows the Next.js proxy to intercept and forward requests:

```typescript
// In browser: uses relative paths (proxied through Next.js)
await httpService.post("/api/auth/register", data);

// This becomes: http://localhost:6000/api/auth/register
// Which is proxied to: http://localhost:3000/api/auth/register
```

## How It Works

1. **Frontend Request**: Client makes request to `/api/auth/register`
2. **Next.js Proxy**: Next.js rewrites the request to `http://localhost:3000/api/auth/register`
3. **Backend API**: NestJS API handles the request and returns response
4. **Response**: Response is proxied back through Next.js to the client

## Benefits

- **No CORS Issues**: All requests go through the same origin (Next.js server)
- **Simplified Configuration**: No need to configure CORS on the backend
- **Environment Flexibility**: Can easily change API URL via environment variable
- **Single Port**: Frontend and API appear to be on the same server

## Environment Variables

You can customize the API URL by setting:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Or for a different environment:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Usage Example

```typescript
import httpService from "@/services/httpService";

// All API calls use relative paths starting with /api
await httpService.post("/api/auth/register", {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
});
```

## API Endpoints

All API endpoints should be prefixed with `/api` to match the proxy configuration:

- `/api/auth/register` → Proxied to backend `/api/auth/register`
- `/api/auth/login` → Proxied to backend `/api/auth/login`
- `/api/users` → Proxied to backend `/api/users`








