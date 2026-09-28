// Import the QueryClient class from TanStack Query.
// This is the "cache manager" that stores fetched server data.
import { QueryClient } from '@tanstack/react-query';

// Create ONE shared instance for the whole app.
// Because ES modules are only evaluated once, every file that imports
// `queryClient` gets this exact same object. That makes it a singleton,
// much like registering a service with AddSingleton in .NET DI.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't auto-retry failed requests. Same setting you had in main.tsx.
      retry: false,
    },
  },
});
