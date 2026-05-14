'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { ClipboardList, Calendar, User, Pill, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import RoleGuard from '@/components/auth/RoleGuard';

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = async (prescriptionId: string) => {
    try {
      const response = await api.get(`/prescriptions/${prescriptionId}/pdf`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescripcion-${prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al descargar el PDF');
    }
  };

  const markAsConsumed = async (id: string) => {
    try {
      await api.put(`/prescriptions/${id}/consume`);
      setPrescriptions((prev: any) =>
        prev.map((p: any) => p.id === id ? { ...p, status: 'consumed' } : p)
      );
      toast.success('¡Receta marcada como consumida!');
    } catch (error) {
      toast.error('No se pudo actualizar el estado');
    }
  };

  useEffect(() => {
    api.get('/prescriptions/my-prescriptions')
      .then(res => setPrescriptions(res.data))
      .catch(() => toast.error('No se pudieron cargar tus recetas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando recetas...</div>;

  return (
    <RoleGuard allowedRoles={['patient']}>
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Mis Prescripciones</h1>
          <p className="text-slate-500">Historial de medicamentos recetados por tus doctores.</p>
        </header>

        {prescriptions.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">Aún no tienes recetas registradas.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {prescriptions.map((pres: any) => (
              <div key={pres.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="font-medium">{new Date(pres.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleDownloadPDF(pres.id)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <Download size={16} /> PDF
                  </button>
                </div>

                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-full text-slate-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Doctor</p>
                        <p className="text-slate-900 font-semibold">{pres.doctor?.user?.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold uppercase">
                      Cod: {pres.code}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pres.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 text-blue-600">
                          <Pill size={16} />
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold leading-none">{item.name}</p>
                          <p className="text-sm text-slate-600 mt-1">{item.dosage} — {item.instructions}</p>
                          <p className="text-xs text-slate-400 font-medium">Cant: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECCIÓN DE ESTADO Y ACCIÓN [cite: 21, 22, 27] */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pres.status === 'consumed' ? (
                      <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                        <CheckCircle2 size={18} />
                        <span>CONSUMIDA</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                        <Clock size={18} />
                        <span>PENDIENTE</span>
                      </div>
                    )}
                  </div>

                  {pres.status === 'pending' && (
                    <button
                      onClick={() => markAsConsumed(pres.id)}
                      className="text-xs bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-2 rounded-xl font-bold transition-all shadow-sm"
                    >
                      Marcar Consumida
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}