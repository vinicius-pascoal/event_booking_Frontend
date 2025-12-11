'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Event Booking
            </Link>

            {isAuthenticated && (
              <div className="flex gap-4">
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className={`${isActive(isAdmin ? '/admin' : '/dashboard')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                    } transition-colors`}
                >
                  Dashboard
                </Link>

                {!isAdmin && (
                  <>
                    <Link
                      href="/venues"
                      className={`${isActive('/venues')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        } transition-colors`}
                    >
                      Locais
                    </Link>
                    <Link
                      href="/my-bookings"
                      className={`${isActive('/my-bookings')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        } transition-colors`}
                    >
                      Minhas Reservas
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      href="/admin/venues"
                      className={`${isActive('/admin/venues')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        } transition-colors`}
                    >
                      Gerenciar Locais
                    </Link>
                    <Link
                      href="/admin/bookings"
                      className={`${isActive('/admin/bookings')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        } transition-colors`}
                    >
                      Gerenciar Reservas
                    </Link>
                    <Link
                      href="/admin/users"
                      className={`${isActive('/admin/users')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        } transition-colors`}
                    >
                      Usuários
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Olá, <span className="font-medium">{user?.name}</span>
                  {isAdmin && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Admin</span>}
                </span>
                <Button onClick={logout} variant="ghost" size="sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
