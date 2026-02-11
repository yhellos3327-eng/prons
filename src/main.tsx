import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/UI/Toast';
import App, { MainPage } from './App';
import { projectQueryOptions } from './hooks/useProjectData';
import ErrorPage from './components/UI/ErrorPage';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const DashboardRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'dashboard') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
        loader: () => queryClient.ensureQueryData(projectQueryOptions),
      },
      {
        path: "dashboard",
        lazy: () => import('./components/Dashboard/Dashboard').then(module => ({ Component: module.default })),
      },
      {
        path: "*",
        element: <DashboardRedirect />,
      }
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
