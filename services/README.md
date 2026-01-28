# Services

This directory contains reusable service classes and utilities.

## HttpService

A centralized HTTP client for making API requests throughout the application.

### Features

- **Automatic base URL configuration** - Uses `NEXT_PUBLIC_API_URL` environment variable or defaults to `http://localhost:3000`
- **Default headers** - Automatically sets `Content-Type: application/json`
- **Authentication** - Automatically includes Bearer token from localStorage
- **Error handling** - Handles errors and provides meaningful error messages
- **Request timeout** - Configurable timeout (default: 30 seconds)
- **Query parameters** - Easy query parameter support
- **TypeScript support** - Fully typed for better developer experience

### Basic Usage

```typescript
import httpService from '@/services/httpService';

// GET request
const data = await httpService.get('/users');

// POST request
const newUser = await httpService.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updated = await httpService.put('/users/1', {
  name: 'Jane Doe'
});

// DELETE request
await httpService.delete('/users/1');
```

### Advanced Usage

```typescript
// With query parameters
const users = await httpService.get('/users', {
  params: {
    page: 1,
    limit: 10,
    active: true
  }
});

// Skip authentication (for public endpoints)
const publicData = await httpService.get('/public/data', {
  skipAuth: true
});

// Custom headers
const data = await httpService.post('/endpoint', payload, {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### Creating a Custom Service

You can extend the HttpService class to create domain-specific services:

```typescript
import httpService from './httpService';

class AuthService {
  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return httpService.post('/auth/register', data, { skipAuth: true });
  }

  async login(email: string, password: string) {
    const response = await httpService.post('/auth/login', { email, password }, { skipAuth: true });
    // Store token
    if (response.token) {
      httpService.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    httpService.clearAuthToken();
  }
}

export const authService = new AuthService();
```

### Token Management

```typescript
// Set token after login
httpService.setAuthToken('your-jwt-token');

// Clear token on logout
httpService.clearAuthToken();
```

### Configuration

You can create a custom instance with different configuration:

```typescript
import { HttpService } from './httpService';

const customHttpService = new HttpService({
  baseURL: 'https://api.example.com',
  headers: {
    'X-API-Key': 'your-api-key'
  },
  timeout: 60000 // 60 seconds
});
```














