'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
  UserPlus, Users, UserRound, FileText,
  X, Activity, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import RoleGuard from '@/components/auth/RoleGuard';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const [usersRes, metricsRes] = await Promise.all([
        api.get('/users/all'),
        api.get('/admin/metrics')
      ]);
      setUsers(usersRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      toast.error('Error al cargar datos del sistema');
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Usuario creado exitosamente');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'patient' });
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <div className="p-10 text-center font-medium">Cargando panel...</div>;

  const statusData = [
    { name: 'Pendientes', value: metrics.byStatus.pending || 0, color: '#3b82f6' },
    { name: 'Consumidas', value: metrics.byStatus.consumed || 0, color: '#10b981' },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* ENCABEZADO */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500">Métricas y gestión de usuarios del sistema.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition shadow-lg shadow-blue-200"
          >
            <UserPlus size={20} /> Nuevo Usuario
          </button>
        </div>

        {/* 1. TARJETAS DE MÉTRICAS (Requerimiento PDF) */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Médicos" value={metrics.totals.doctors} icon={<UserRound />} color="bg-blue-500" />
            <StatCard title="Pacientes" value={metrics.totals.patients} icon={<Users />} color="bg-purple-500" />
            <StatCard title="Prescripciones" value={metrics.totals.prescriptions} icon={<FileText />} color="bg-emerald-500" />
          </div>
        )}

        {/* 2. GRÁFICOS (Requerimiento PDF) */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-blue-600" size={20} />
                <h2 className="font-bold text-slate-800">Actividad (30 días)</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer>
                  <LineChart data={metrics.byDay}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={30}
                      tickFormatter={(str) => str.split('-').slice(1).join('/')}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <PieIcon className="text-emerald-600" size={20} />
                <h2 className="font-bold text-slate-800">Estado de Recetas</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 3. TABLA DE USUARIOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Usuarios Registrados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        u.role === 'doctor' ? 'bg-purple-100 text-purple-600' :
                        u.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ACTIVO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE CREACIÓN */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Registrar Usuario</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                {/* ... Tus inputs de formulario ... */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                  <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                  <input type="password" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="patient">Paciente</option>
                    <option value="doctor">Médico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                  {loading ? 'Guardando...' : 'Crear Usuario'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
      <div className={`${color} p-4 rounded-xl text-white shadow-lg shadow-current/20`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}