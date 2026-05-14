'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import RoleGuard from '@/components/auth/RoleGuard';

interface Item {
  name: string;
  dosage: string;
  instructions: string;
  quantity: number;
}

export default function CreatePrescription() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [items, setItems] = useState<Item[]>([{ name: '', dosage: '', instructions: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users')
      .then(res => {
        setPatients(res.data);
      })
      .catch((err: any) => {
        console.error(err);
        toast.error('Error al cargar la lista de pacientes');
      });
  }, []);

  const addItem = () => {
    setItems([...items, { name: '', dosage: '', instructions: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return toast.warning('Selecciona un paciente');

    setLoading(true);
    try {
      await api.post('/prescriptions', {
        patientId: selectedPatient,
        items
      });

      toast.success('Prescripción creada con éxito');

      setSelectedPatient('');
      setItems([{ name: '', dosage: '', instructions: '', quantity: 1 }]);
    } catch (error) {
      toast.error('Error al crear la prescripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['doctor']}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Send className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nueva Prescripción Médica</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selección de Paciente */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4">
              <User size={18} className="text-blue-500" />
              Información del Paciente
            </label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
            >
              <option value="">Selecciona un paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Medicamentos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-slate-900">Medicamentos y Posología</h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
              >
                <Plus size={18} /> Agregar Medicamento
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Medicamento</label>
                      <input
                        className="w-full mt-1 p-2 border border-slate-200 rounded-md text-slate-900"
                        placeholder="Ej: Paracetamol"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Dosis</label>
                      <input
                        className="w-full mt-1 p-2 border border-slate-200 rounded-md text-slate-900"
                        placeholder="Ej: 500mg"
                        value={item.dosage}
                        onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Cantidad</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border border-slate-200 rounded-md text-slate-900"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="text-xs font-bold text-slate-500 uppercase">Instrucciones</label>
                      <input
                        className="w-full mt-1 p-2 border border-slate-200 rounded-md text-slate-900"
                        placeholder="Cada 8 horas"
                        value={item.instructions}
                        onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                        required
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="absolute -right-2 -top-2 bg-red-100 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Procesando...' : (
              <><Send size={20} /> Emitir Prescripción Digital</>
            )}
          </button>
        </form>
      </div>
    </RoleGuard>
  );
}