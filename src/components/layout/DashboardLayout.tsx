import { NavLink, Outlet, Link } from 'react-router';
import { UserButton } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/dashboard', label: 'Event Types', end: true },
  { to: '/dashboard/availability', label: 'Availability', end: false },
  { to: '/dashboard/bookings', label: 'Bookings', end: false },
  { to: '/dashboard/settings', label: 'Settings', end: false },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/dashboard" className="text-lg font-bold text-blue-600">
            Calendly Clone
          </Link>
          <UserButton />
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
