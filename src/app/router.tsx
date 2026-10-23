import { createBrowserRouter } from 'react-router';
import { Providers } from './providers';
import { ProtectedRoute } from '@/features/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomePage } from '@/pages/HomePage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { EventTypesPage } from '@/pages/EventTypesPage';
import { AvailabilityPage } from '@/pages/AvailabilityPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PublicProfilePage } from '@/pages/PublicProfilePage';
import { PublicBookingPage } from '@/pages/PublicBookingPage';
import { BookingDetailsPage } from '@/pages/BookingDetailsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <Providers />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },

      // Provider dashboard (needs login)
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <EventTypesPage /> },
          { path: 'availability', element: <AvailabilityPage /> },
          { path: 'bookings', element: <BookingsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },

      // Public pages (no login)
      { path: '/booking/:bookingId', element: <BookingDetailsPage /> },
      { path: '/:username', element: <PublicProfilePage /> },
      { path: '/:username/:slug', element: <PublicBookingPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
