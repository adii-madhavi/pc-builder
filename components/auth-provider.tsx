'use client';

import { useEffect } from 'react';
import { initializeAuthStore } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => { initializeAuthStore(); }, []);
  return children;
}
