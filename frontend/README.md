# Mini Dashboard Frontend

This is the frontend application for the Mini Dashboard project. It's a React app that connects to a Strapi backend to manage and display leads in a nice dashboard interface.

## What's this project about?

This dashboard lets you view, add, edit, and manage leads. You can filter leads by status (active/inactive) and it connects to a Strapi backend API to store all the data.

## Prerequisites

Before you start, make sure you have:
- Node.js (version 20 or higher)
- npm (version 6 or higher)
- The Strapi backend running (see the `mini-dashboard-backend` folder)

You can check your versions by running:
```bash
node --version
npm --version
```

## How to run the project locally

### Step 1: Install dependencies

First, install all the packages:

```bash
npm install
```

### Step 2: Set up environment variables

Create a `.env` file in the root of the project:

```bash
VITE_STRAPI_URL=http://localhost:1337
```

**Note:** If your Strapi backend requires authentication, you may need to add:
```
VITE_STRAPI_API_TOKEN=your_api_token_here
```

To get an API token from Strapi:
1. Go to `http://localhost:1337/admin`
2. Navigate to Settings → API Tokens
3. Create a new token with appropriate permissions
4. Copy it to your `.env` file

### Step 3: Start the development server

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or another port if 5173 is busy).

### Step 4: Make sure the backend is running

In a separate terminal, start the Strapi backend:

```bash
cd ../mini-dashboard-backend
npm run dev
```

The backend should be running on `http://localhost:1337`.

That's it! Open your browser and go to `http://localhost:5173` to see the dashboard.

## Design Decisions

Here are some key decisions we made and why:

### API Client

We created a custom API client (`src/services/apiClient.ts`) to centralize all API communication:

- **Centralized Configuration**: The client automatically sets up the base URL and authentication headers from environment variables, so we don't need to repeat this in every API call
- **Error Handling**: Response interceptors handle common errors (network issues, authentication failures, server errors) and provide user-friendly error messages
- **Type Safety**: TypeScript generics ensure type safety when making API calls
- **Easy to Use**: Simple methods (get, post, put, delete, patch) that return the data directly, without needing to handle response objects
- **Single Instance**: We export a single instance of the API client, so all components use the same configured client

This makes it easy to update API configuration or error handling in one place, and keeps the code in components clean and focused on business logic.

### Auth Context

We used React Context (`src/contexts/AuthContext.tsx`) for authentication state management:

- **Global State**: Authentication state is available throughout the app without prop drilling
- **Persistent Login**: The auth state is stored in localStorage, so users stay logged in even after refreshing the page
- **Simple API**: The `useAuth` hook provides a clean interface (`isAuthenticated`, `login`, `logout`) that any component can use
- **Protected Routes**: Components can check authentication status to show/hide content or redirect to login

For this project, we implemented a simple hardcoded authentication (admin/admin) for demonstration purposes. In a production app, this would connect to the backend API for proper authentication.

## Future Improvements

Here's what we would do differently or improve with more time:

- **Better Error Handling**: Add user-friendly error messages for different scenarios (network issues, validation errors, etc.)
- **Loading States**: Add skeleton loaders instead of simple spinners for a better user experience
- **Pagination**: Add pagination for when there are many leads
- **Search Functionality**: Let users search leads by name, email, or company
- **More Filters**: Add filters for date ranges, email domains, etc.
- **Optimistic Updates**: Update the UI immediately when actions happen (before API confirmation) for better perceived performance
- **State Management**: Consider using React Query or Zustand if the app grows larger

### Nice to Have

- **Accessibility**: Improve keyboard navigation and screen reader support
- **Better Mobile Experience**: Enhance the mobile layout and interactions
- **Export Functionality**: Let users export leads to CSV or Excel
- **Bulk Actions**: Allow selecting multiple leads and performing actions on them
- **Deployment**: Set up CI/CD pipeline for automatic deployments
- **Performance**: Optimize bundle size and add code splitting

## Troubleshooting

### "Failed to fetch" or Network errors

- Make sure the Strapi backend is running on `http://localhost:1337`
- Check that your `.env` file has the correct `VITE_STRAPI_URL`
- Verify CORS is configured in the Strapi backend to allow requests from `http://localhost:5173`

### Page won't load

- Try running `npm install` again to make sure all dependencies are installed
- Check the browser console for specific error messages
- Make sure you're using Node.js version 20 or higher

## Project Structure

```
mini-dashboard-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (like auth)
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   └── App.tsx         # Main app component
├── package.json
└── vite.config.ts      # Vite configuration
```
