# @daveyplate/better-auth-persistent

Persistent session management for Better Auth - automatically persist and restore authentication sessions across page reloads and browser restarts.

## Features

- 🔄 **Automatic Session Persistence** - Sessions are automatically saved to localStorage
- 🔐 **Multi-Session Support** - Manage multiple device sessions
- ⚛️ **React Integration** - Built-in React hooks for easy integration
- 🚀 **Nanostores Powered** - Efficient state management with atomic stores
- 📦 **TypeScript Support** - Full type safety with Better Auth types

## Installation

```bash
npm install @daveyplate/better-auth-persistent
# or
pnpm add @daveyplate/better-auth-persistent
# or
yarn add @daveyplate/better-auth-persistent
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "better-auth": ">=1.2.8",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Usage

### Basic Setup

First, ensure your Better Auth client has the `multiSession` plugin enabled:

```typescript
import { createAuthClient } from "better-auth/react"
import { multiSessionClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [multiSessionClient()]
})
```

### React Integration

Use the `usePersistSession` hook to automatically persist sessions:

```tsx
import { usePersistSession } from "@daveyplate/better-auth-persistent"
import { authClient } from "./lib/auth-client"

function App() {
  // This will automatically persist and restore sessions
  usePersistSession(authClient)
  
  return <YourApp />
}
```

### Managing Device Sessions

List all device sessions:

```tsx
import { useListDeviceSessions } from "@daveyplate/better-auth-persistent"

function DeviceSessions() {
  const { data, isPending, error } = useListDeviceSessions()
  
  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data?.map((session) => (
        <li key={session.session.token}>
          Device: {session.session.userAgent}
        </li>
      ))}
    </ul>
  )
}
```

### Switching Between Sessions

```typescript
import { setActiveSession } from "@daveyplate/better-auth-persistent"

// Switch to a different session
await setActiveSession({ sessionToken: "session-token-here" })
```

### Direct Store Access

For non-React environments or advanced use cases, you can directly access the stores:

```typescript
import { 
  $persistentSession,
  $deviceSessions,
  initPersistSession 
} from "@daveyplate/better-auth-persistent"

// Subscribe to session persistence
const unsubscribe = initPersistSession(authClient)

// Access current session
const currentSession = $persistentSession.get()

// Access device sessions
const deviceSessions = $deviceSessions.get()
```

## API Reference

### Hooks

#### `usePersistSession(authClient)`
Automatically persists and restores authentication sessions.

- `authClient` - Your Better Auth client instance

#### `useListDeviceSessions()`
Returns a list of all device sessions for the current user.

Returns:
- `data` - Array of session/user pairs
- `isPending` - Loading state
- `error` - Error object if any

### Functions

#### `setActiveSession({ sessionToken })`
Switch to a different active session.

- `sessionToken` - The token of the session to activate

#### `initPersistSession(authClient)`
Manually subscribe to session persistence (for non-React usage).

Returns an unsubscribe function.

### Stores

#### `$persistentSession`
Nanostores atom containing the current persisted session.

#### `$deviceSessions`
Computed store containing all device sessions.

#### `$authClient`
Store containing the Better Auth client instance.

## How It Works

1. **Session Persistence**: When a user logs in, the session is automatically saved to localStorage using SuperJSON for proper serialization of dates and other complex types.

2. **Session Restoration**: On app load, the persisted session is automatically restored from localStorage and validated with the server.

3. **Multi-Device Support**: The package tracks all active sessions across devices, allowing users to switch between them or manage device access.

4. **Optimistic Updates**: Session switches are applied optimistically for instant UI updates, with automatic rollback on server errors.

## License

MIT © [daveycodez](https://github.com/daveyplate)