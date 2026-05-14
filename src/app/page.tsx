'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://backend-prueba-0g6r.onrender.com/api/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      setAuth(user, accessToken);

      toast.success(`¡Bienvenido, ${user.name}!`, {
        description: 'Has iniciado sesión correctamente.',
      });

      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'doctor') router.push('/doctor');
      else router.push('/patient');

    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);

      setLoading(false);

      toast.error('Error de autenticación', {
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">MediPrescribe</h1>
          <p className="text-slate-500">Gestión de Prescripciones Médicas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="ejemplo@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Prueba Técnica 2026
          </p>
        </div>
      </div>
    </div>
  );
}