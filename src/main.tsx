import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { router } from './app/router';
import { queryClient } from './app/queryClient';
import { AppErrorBoundary } from './app/AppErrorBoundary';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
