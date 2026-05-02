"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Zona } from "../../data/services";

const ZONA_VACIA: Omit<Zona, "id"> = { nombre: "", multiplicador: 1.0 };

export default function ZonasAdmin() {
  const { config, updateConfig } = useConfig();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Zona, "id">>(ZONA_VACIA);
  const [nueva, setNueva] = useState(false);
  const [formNueva, setFormNueva] = useState<Omit<Zona, "id">>(ZONA_VACIA);

  const abrirEdicion = (z: Zona) => {
    setEditandoId(z.id);
    setForm({ nombre: z.nombre, multiplicador: z.multiplicador });
  };

  const guardar = (id: string) => {
    updateConfig({
      zonas: config.zonas.map((z) => (z.id === id ? { ...z, ...form } : z)),
    });
    setEditandoId(null);
  };

  const eliminar = (id: string) => {
    updateConfig({ zonas: config.zonas.filter((z) => z.id !== id) });
  };

  const agregarZona = () => {
    if (!formNueva.nombre.trim()) return;
    const id = formNueva.nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    updateConfig({ zonas: [...config.zonas, { id, ...formNueva }] });
    setFormNueva(ZONA_VACIA);
    setNueva(false);
  };

  const labelMultiplicador = (m: number) => {
    if (m > 1) return { texto: `+${Math.round((m - 1) * 100)}%`, color: "text-red-500 bg-red-50" };
    if (m < 1) return { texto: `-${Math.round((1 - m) * 100)}%`, color: "text-green-600 bg-green-50" };
    return { texto: "Precio base", color: "text-slate-500 bg-slate-100" };
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Zonas de trabajo</h1>
          <p className="text-slate-500 mt-1">Define las zonas donde operas y su ajuste de precio</p>
        </div>
        <button
          onClick={() => setNueva(true)}
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          + Añadir zona
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
        El multiplicador ajusta el precio base. Una zona con <strong>+25%</strong> cobra un 25% más sobre el precio estándar.
      </div>

      {/* Lista de zonas */}
      <div className="flex flex-col gap-3">
        {config.zonas.map((z) => {
          const editando = editandoId === z.id;
          const { texto, color } = labelMultiplicador(z.multiplicador);

          return (
            <div key={z.id} className="bg-white rounded-xl border-2 border-slate-200">
              {!editando ? (
                <div className="flex items-center gap-4 p-4">
                  <span className="text-xl">📍</span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{z.nombre}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Multiplicador: ×{z.multiplicador.toFixed(2)}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>{texto}</span>
                  <div className="flex gap-2">
                    <button onClick={() => abrirEdicion(z)} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => eliminar(z.id)} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Nombre de la zona</label>
                      <input
                        value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Multiplicador (ej: 1.25 = +25%)</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.5"
                        max="2"
                        value={form.multiplicador}
                        onChange={(e) => setForm((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => guardar(z.id)} className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors">
                      Guardar
                    </button>
                    <button onClick={() => setEditandoId(null)} className="px-4 py-2 border border-slate-200 text-slate-500 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nueva zona */}
      {nueva && (
        <div className="mt-3 bg-white rounded-xl border-2 border-orange-300 p-4">
          <div className="text-sm font-semibold text-slate-700 mb-3">Nueva zona</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Nombre de la zona</label>
              <input
                value={formNueva.nombre}
                onChange={(e) => setFormNueva((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Madrid centro"
                className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Multiplicador (ej: 1.25 = +25%)</label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="2"
                value={formNueva.multiplicador}
                onChange={(e) => setFormNueva((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={agregarZona} className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Añadir zona
            </button>
            <button onClick={() => { setNueva(false); setFormNueva(ZONA_VACIA); }} className="px-4 py-2 border border-slate-200 text-slate-500 text-sm rounded-lg hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
