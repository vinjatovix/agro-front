import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';

import Home from '../pages/Home';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import PlantDetail from '../pages/plants/PlantDetail/PlantDetail';
import FamilyList from '../pages/families/FamilyList';
import FamilyDetail from '../pages/families/FamilyDetail/FamilyDetail';

import AdminDashboard from '../pages/admin/AdminDashboard';
import PlantsPage from '../pages/plants/PlantsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> }
    ]
  },

  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/plants', element: <PlantsPage /> },
      { path: '/plants/:id', element: <PlantDetail /> },
      { path: '/families', element: <FamilyList /> },
      { path: '/families/:id', element: <FamilyDetail /> },
      { path: '/admin', element: <AdminDashboard /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
];

export const router = createBrowserRouter(routes);
