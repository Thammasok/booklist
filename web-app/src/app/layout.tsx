'use client';

import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const fontFamily = JetBrains_Mono({
  display: 'swap',
  preload: false,
  style: ['normal', 'italic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
})

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontFamily.className}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthInitializer>
        </QueryClientProvider>
      </body>
    </html>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
