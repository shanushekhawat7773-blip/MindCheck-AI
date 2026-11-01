'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  BookOpen,
  MessageCircleHeart,
  BarChart2,
  Sparkles,
  LifeBuoy,
  Settings,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Compass },
    { href: '/checkin', label: 'Check-In', icon: Heart },
    { href: '/companion', label: 'AI Companion', icon: MessageCircleHeart },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/activities', label: 'Activities', icon: Sparkles },
    { href: '/insights', label: 'Insights', icon: BarChart2 },
  ];

  const isPublicHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isPublicHome ? '/' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-ivory shadow-soft group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 12a5 5 0 0 1 5-5" />
                <path d="M12 2v10l7-7" />
              </svg>
            </div>
            <div>
              <span className="font-editorial text-xl font-bold tracking-tight text-forest">
                MindCheck<span className="text-sage-500 font-sans text-sm ml-1">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isPublicHome &&
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-forest text-ivory shadow-soft'
                        : 'text-charcoal/80 hover:text-forest hover:bg-sand-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/crisis">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-800 hover:bg-red-50/80 gap-1.5 font-normal text-xs"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
                Crisis Support
              </Button>
            </Link>

            {isPublicHome ? (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    Open App
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="w-4 h-4 text-muted" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <Link href="/crisis">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                <LifeBuoy className="w-3 h-3 mr-1" />
                Support
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal hover:bg-sand-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-sand-200 bg-ivory px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-base font-medium ${
                  isActive
                    ? 'bg-forest text-ivory'
                    : 'text-charcoal hover:bg-sand-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-sand-200 mt-2 space-y-2">
            <Link
              href="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-base text-charcoal hover:bg-sand-100 rounded-xl"
            >
              <Settings className="w-5 h-5 text-muted" />
              Settings & Privacy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
