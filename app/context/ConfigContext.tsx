"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { createClient } from "../../lib/supabase/client";
import { SERVICIOS, ZONAS_DEFAULT, EXTRAS, Zona } from "../data/services";

export type PreciosCustom = Record<string, { basico: number; estandar: number; premium: number }>;
export type EstiloBoton = "rounded-full" | "rounded-xl" | "rounded-lg" | "rounded-md";
export type Fuente = "Inter" | "Poppins" | "Roboto" | "Playfair Display";

export type CompanyConfig = {
  nombre: string;
  slug: string;
  logo: string | null;
  colorPrimario: string;
  fuente: Fuente;
  estiloBoton: EstiloBoton;
  contactEmail: string;
  contactTelefono: string;
  tituloBienvenida: string;
  subtituloBienvenida: string;
  textoCTA: string;
  serviciosActivos: string[];
  preciosCustom: PreciosCustom;
  regionesActivas: string[];
  zonas: Zona[];
  extrasActivos: string[];
  preciosExtrasCustom: PreciosCustom;
  webhookUrl: string;
  whatsappNumero: string;
  airtableToken: string;
  airtableBaseId: string;
  airtableTableName: string;
};

export type CalcSummary = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
};

export const toSlug = (nombre: string) =>
  nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const DEFAULT_CONFIG: CompanyConfig = {
  nombre: "Mi Empresa de Reformas",
  slug: "mi-empresa-de-reformas",
  logo: null,
  colorPrimario: "#fb923c",
  fuente: "Inter",
  estiloBoton: "rounded-xl",
  contactEmail: "info@miempresa.com",
  contactTelefono: "600 000 000",
  tituloBienvenida: "¿Cuánto cuesta tu reforma?",
  subtituloBienvenida: "Obtén una estimación personalizada en menos de 1 minuto, sin registrarte.",
  textoCTA: "Solicitar presupuesto gratuito →",
  serviciosActivos: SERVICIOS.map((s) => s.id),
  preciosCustom: {},
  regionesActivas: ["madrid", "barcelona", "andalucia", "valencia"],
  zonas: ZONAS_DEFAULT,
  extrasActivos: EXTRAS.map((e) => e.id),
  preciosExtrasCustom: {},
  webhookUrl: "",
  whatsappNumero: "",
  airtableToken: "",
  airtableBaseId: "",
  airtableTableName: "Leads",
};

type ConfigContextType = {
  config: CompanyConfig;
  updateConfig: (patch: Partial<CompanyConfig>) => void;
  resetConfig: () => void;
  // Multi-calculator
  calculators: CalcSummary[];
  currentCalcId: string | null;
  selectCalc: (id: string) => void;
  createCalc: (nombre: string) => Promise<string | null>;
  deleteCalc: (id: string) => Promise<void>;
  userEmail: string | null;
  loading: boolean;
};

const ConfigContext = createContext<ConfigContextType>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  resetConfig: () => {},
  calculators: [],
  currentCalcId: null,
  selectCalc: () => {},
  createCalc: async () => null,
  deleteCalc: async () => {},
  userEmail: null,
  loading: true,
});

// Used by public /calc/[slug] pages — passes a static config, no Supabase writes
export function StaticConfigProvider({ children, config }: { children: ReactNode; config: CompanyConfig }) {
  return (
    <ConfigContext.Provider value={{
      config,
      updateConfig: () => {},
      resetConfig: () => {},
      calculators: [],
      currentCalcId: null,
      selectCalc: () => {},
      createCalc: async () => null,
      deleteCalc: async () => {},
      userEmail: null,
      loading: false,
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient();
  } catch {
    // Supabase not configured — render children with default config
    return (
      <ConfigContext.Provider value={{
        config: DEFAULT_CONFIG, updateConfig: () => {}, resetConfig: () => {},
        calculators: [], currentCalcId: null, selectCalc: () => {},
        createCalc: async () => null, deleteCalc: async () => {},
        userEmail: null, loading: false,
      }}>
        {children}
      </ConfigContext.Provider>
    );
  }
  return <ConfigProviderInner supabase={supabase}>{children}</ConfigProviderInner>;
}

function ConfigProviderInner({ children, supabase }: { children: ReactNode; supabase: ReturnType<typeof createClient> }) {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG);
  const [calculators, setCalculators] = useState<CalcSummary[]>([]);
  const [currentCalcId, setCurrentCalcId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserEmail(user.email ?? null);

      const { data: calcs } = await supabase
        .from("calculators")
        .select("id, nombre, slug, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      let list: CalcSummary[] = calcs ?? [];

      // Auto-create first calculator if none exist
      if (list.length === 0) {
        const slug = toSlug(user.email?.split("@")[0] ?? "mi-empresa");
        const { data: newCalc } = await supabase
          .from("calculators")
          .insert({ user_id: user.id, nombre: "Mi Calculadora", slug, config: DEFAULT_CONFIG })
          .select("id, nombre, slug, created_at")
          .single();
        if (newCalc) list = [newCalc];
      }

      setCalculators(list);

      const savedId = typeof window !== "undefined" ? localStorage.getItem("reforma-current-calc") : null;
      const targetId = savedId && list.find((c) => c.id === savedId) ? savedId : list[0]?.id ?? null;

      if (targetId) {
        await loadCalc(targetId, list);
      }

      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCalc = async (id: string, list?: CalcSummary[]) => {
    const { data } = await supabase
      .from("calculators")
      .select("config")
      .eq("id", id)
      .single();

    if (data?.config) {
      setConfig({ ...DEFAULT_CONFIG, ...data.config });
    }
    setCurrentCalcId(id);
    if (typeof window !== "undefined") localStorage.setItem("reforma-current-calc", id);

    // Update calculators list summary if needed
    if (list) setCalculators(list);
  };

  const persistConfig = (newConfig: CompanyConfig, calcId: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase
        .from("calculators")
        .update({ config: newConfig, updated_at: new Date().toISOString() })
        .eq("id", calcId);
    }, 600);
  };

  const updateConfig = (patch: Partial<CompanyConfig>) => {
    setConfig((c) => {
      const next = { ...c, ...patch };
      if (currentCalcId) persistConfig(next, currentCalcId);
      return next;
    });
    // Keep summary slug/nombre in sync
    if ((patch.nombre || patch.slug) && currentCalcId) {
      const updates: Record<string, string> = {};
      if (patch.nombre) updates.nombre = patch.nombre;
      if (patch.slug) updates.slug = patch.slug;
      supabase.from("calculators").update(updates).eq("id", currentCalcId).then(() => {
        setCalculators((prev) => prev.map((c) =>
          c.id === currentCalcId ? { ...c, ...updates } : c
        ));
      });
    }
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    if (currentCalcId) persistConfig(DEFAULT_CONFIG, currentCalcId);
  };

  const selectCalc = async (id: string) => {
    if (id === currentCalcId) return;
    setLoading(true);
    await loadCalc(id);
    setLoading(false);
  };

  const createCalc = async (nombre: string): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const slug = toSlug(nombre) || `calc-${Date.now()}`;
    const { data, error } = await supabase
      .from("calculators")
      .insert({ user_id: user.id, nombre, slug, config: DEFAULT_CONFIG })
      .select("id, nombre, slug, created_at")
      .single();

    if (error || !data) return null;

    setCalculators((prev) => [...prev, data]);
    await loadCalc(data.id);
    return data.id;
  };

  const deleteCalc = async (id: string) => {
    await supabase.from("calculators").delete().eq("id", id);
    const next = calculators.filter((c) => c.id !== id);
    setCalculators(next);
    if (currentCalcId === id) {
      if (next.length > 0) {
        await loadCalc(next[0].id);
      } else {
        setCurrentCalcId(null);
        setConfig(DEFAULT_CONFIG);
      }
    }
  };

  return (
    <ConfigContext.Provider value={{
      config, updateConfig, resetConfig,
      calculators, currentCalcId, selectCalc, createCalc, deleteCalc,
      userEmail, loading,
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
