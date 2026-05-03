"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SERVICIOS, ZONAS_DEFAULT, EXTRAS, Zona } from "../data/services";

export type PreciosCustom = Record<string, { basico: number; estandar: number; premium: number }>;

export type EstiloBoton = "rounded-full" | "rounded-xl" | "rounded-lg" | "rounded-md";
export type Fuente = "Inter" | "Poppins" | "Roboto" | "Playfair Display";

export type CompanyConfig = {
  // Empresa
  nombre: string;
  slug: string; // URL-friendly: reformas-garcia
  logo: string | null; // base64
  colorPrimario: string;
  fuente: Fuente;
  estiloBoton: EstiloBoton;
  contactEmail: string;
  contactTelefono: string;
  // Textos personalizables
  tituloBienvenida: string;
  subtituloBienvenida: string;
  textoCTA: string;
  // Servicios
  serviciosActivos: string[];
  preciosCustom: PreciosCustom;
  // Zonas: regiones españolas activas + zonas custom
  regionesActivas: string[]; // IDs de COMUNIDADES
  zonas: Zona[]; // zonas custom adicionales
  extrasActivos: string[];
  preciosExtrasCustom: PreciosCustom;
  // Integraciones (Bloque 3)
  webhookUrl: string;
  whatsappNumero: string;
  airtableToken: string;
  airtableBaseId: string;
  airtableTableName: string;
};

export const toSlug = (nombre: string) =>
  nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const DEFAULT_CONFIG: CompanyConfig = {
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
};

const ConfigContext = createContext<ConfigContextType>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  resetConfig: () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("reforma-config");
    if (stored) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(stored) });
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("reforma-config", JSON.stringify(config));
  }, [config, loaded]);

  const updateConfig = (patch: Partial<CompanyConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  const resetConfig = () => setConfig(DEFAULT_CONFIG);

  if (!loaded) return null;

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
