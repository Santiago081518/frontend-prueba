'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { LogOut, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Activity size={20} className="text-white" />
        </div>
        <span className="text-slate-900 tracking-tight">MediPrescribe</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right border-r pr-4 border-slate-100">
          <p className="text-sm font-bold text-slate-900">{user.name}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all active:scale-95"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}