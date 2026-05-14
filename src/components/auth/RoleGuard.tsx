'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoleGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const hasHydrated = useAuthStore.persist?.hasHydrated();
    if (!hasHydrated) return;

    if (!user) {
      if (pathname !== '/') router.replace('/');
      return;
    }

    const canAccess = allowedRoles.includes(user.role);

    if (canAccess) {
      setAuthorized(true);
    } else {
      const myCorrectPath = `/${user.role}`;
      if (pathname !== myCorrectPath) {
        router.replace(myCorrectPath);
      }
    }
  }, [user, allowedRoles, pathname, router]);

  if (!authorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}