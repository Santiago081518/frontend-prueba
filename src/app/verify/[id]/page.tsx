'use client';

import { use, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CheckCircle, XCircle, Pill, User, Calendar } from 'lucide-react';
import axios from 'axios';

export default function VerifyPrescription({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [error, setError] = useState(false);
  const [data, setData] = useState<any>(null);

  console.log('Verifying prescription with ID:', id);

  useEffect(() => {
    if (!id) return;

    // Obtén la URL base de tu variable de entorno
    const baseURL = 'https://tu-api-en-render.onrender.com';

    // USA AXIOS DIRECTO AQUÍ (sin interceptores)
    axios.get(`${baseURL}/prescriptions/public/verify/${id}`)
      .then(res => setData(res.data))
      .catch((err) => {
        console.error('Error verificando:', err);
        setError(true);
      });
  }, [id]);

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <XCircle size={64} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold">Receta No Válida</h1>
      <p className="text-slate-500">El código no coincide con ninguna prescripción activa.</p>
    </div>
  );

  if (!data) return <div className="p-10 text-center">Verificando autenticidad...</div>;

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-3xl shadow-xl border-t-8 border-green-500">
      <div className="flex justify-center mb-4">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      <h1 className="text-center text-xl font-bold text-slate-900 mb-6">Prescripción Validada</h1>

      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paciente</p>
          <p className="font-semibold text-slate-800">{data.patient.user.name}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Emitida por</p>
          <p className="font-semibold text-slate-800">{data.author.user.name}</p>
        </div>

        <div className="border-t border-dashed border-slate-200 pt-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Medicamentos</p>
          {data.items.map((item: any, i: number) => (
            <div key={i} className="flex gap-2 text-sm text-slate-700 mb-1">
              <Pill size={14} className="text-blue-500" />
              <span>{item.name} - {item.dosage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}