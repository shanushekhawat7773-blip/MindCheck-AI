'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Heart,
  MessageCircleHeart,
  BookOpen,
  Sparkles,
  BarChart2,
  CheckCircle2,
  LifeBuoy,
  Settings,
  Shield,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Compass },
    { href: '/checkin', label: 'Emotional Check-In', icon: Heart },
    { href: '/companion', label: 'AI Companion', icon: MessageCircleHeart },
    { href: '/journal', label: 'Private Journal', icon: BookOpen },
    { href: '/activities', label: 'Wellness Activities', icon: Sparkles },
    { href: '/insights', label: 'Mood Trends', icon: BarChart2 },
    { href: '/goals', label: 'Habits & Goals', icon: CheckCircle2 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-sand-200 bg-sand-50/60 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div>
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Workspace</p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-forest text-ivory shadow-soft font-semibold'
                    : 'text-charcoal/80 hover:text-forest hover:bg-sand-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-ivory' : 'text-sage-500'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pt-4 border-t border-sand-200">
        <Link
          href="/crisis"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-800 bg-red-50/70 hover:bg-red-100/70 border border-red-100 transition-colors"
        >
          <LifeBuoy className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Emergency Support (24/7)</span>
        </Link>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-forest text-ivory font-semibold'
              : 'text-charcoal/70 hover:text-forest hover:bg-sand-100'
          }`}
        >
          <Settings className="w-4 h-4 text-muted" />
          <span>Settings & Privacy</span>
        </Link>

        <div className="px-3.5 py-2 text-[11px] text-muted flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-sage-500" />
          <span>Local-First Private Storage</span>
        </div>
      </div>
    </aside>
  );
}
