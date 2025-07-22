# Black Market Authentication System

## Overview

This authentication system provides complete user registration, login, and access control for the Black Market apps platform. It includes protected routes, role-based access control, and a modern dark-themed UI.

## Features

### Authentication
- User registration with validation
- Secure login/logout
- JWT token management
- Persistent authentication state
- Auto token validation

### Protected Routes
- Route protection based on authentication
- Role-based access control (user, moderator, admin)
- Automatic redirection to login
- Custom fallback components

### User Interface
- Dark theme with red accents
- Responsive design
- Modern form validation
- Loading states and error handling
- Animated icons and transitions

## API Integration

### Backend Connection
- Automatic API base URL configuration
- JWT token header injection
- Error handling for API requests
- Network error management

### Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Black Market
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Usage

### Basic Authentication
```jsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth()
    
    // Use authentication state and methods
}
```

### Protected Routes
```jsx
import ProtectedRoute from '@/components/ProtectedRoute'

function AdminPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <div>Admin content here</div>
        </ProtectedRoute>
    )
}
```

### API Requests
```jsx
import { api } from '@/lib/api'

// All API requests automatically include auth headers
const apps = await api.getApps()
const user = await api.getProfile()
```

## Pages

### Authentication Pages
- `/auth/login` - User login
- `/auth/register` - New user registration

### Protected Pages
- `/profile` - User profile (requires login)
- `/admin` - Admin dashboard (requires admin role)

### Components
- `AuthProvider` - Authentication context provider
- `ProtectedRoute` - Route protection wrapper
- `Header` - Navigation with auth integration

## User Roles

### User (default)
- Access to apps and downloads
- Profile management
- Basic functionality

### Moderator
- User management
- Content moderation
- App approval

### Admin
- Full system access
- User and content management
- System configuration
- Analytics and reports

## Security Features

- JWT token validation
- Secure password requirements
- Role-based access control
- Auto logout on token expiry
- Protected API endpoints

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `.env.local`

3. Start the development server:
```bash
npm run dev
```

4. Ensure backend API is running on the configured URL

## API Endpoints

The frontend connects to these backend endpoints:

- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/register` - User registration
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/change-password` - Change password

## Error Handling

The system includes comprehensive error handling:
- Network connectivity issues
- Invalid credentials
- Token expiration
- Server errors
- Validation errors

## Styling

The UI uses a consistent dark theme:
- Background: Gray-900 to Black gradient
- Accent: Red-500/600
- Text: White/Gray variants
- Cards: Gray-800 with transparency
- Animations: Smooth transitions and hover effects

## Testing

To test the authentication system:

1. Register a new account at `/auth/register`
2. Login with your credentials at `/auth/login`
3. Access protected routes like `/profile`
4. Test admin functionality at `/admin` (requires admin role)
5. Verify logout functionality

## Admin Dashboard

The admin dashboard provides:
- User statistics
- App management overview
- System status monitoring
- Quick action buttons
- Role-based feature access

Features include:
- User management
- App catalog management
- Category organization
- System settings
- Analytics and reports

## Future Enhancements

Planned improvements:
- Password reset functionality
- OAuth integration (Google, GitHub)
- Two-factor authentication
- User avatar uploads
- Enhanced admin tools
- Real-time notifications
- Advanced analytics 