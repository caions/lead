'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
}

export default function Header({ title = "Sistema de Gestão de Leads", showNavigation = true }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Navegação */}
          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                href="/" 
                className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}
              >
                Formulário
              </Link>
              <Link 
                href="/admin/login" 
                className={`nav-link ${pathname === '/admin/login' ? 'nav-link-active' : ''}`}
              >
                Login Admin
              </Link>
              <Link 
                href="/admin/leads" 
                className={`nav-link ${pathname.startsWith('/admin/leads') ? 'nav-link-active' : ''}`}
              >
                Leads
              </Link>
            </nav>
          )}

          {/* Menu Mobile */}
          {showNavigation && (
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
