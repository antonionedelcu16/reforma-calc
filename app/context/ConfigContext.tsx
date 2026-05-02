"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SERVICIOS, ZONAS_DEFAULT, EXTRAS, Zona } from "../data/services";

export type PreciosCustom = Record<string, { basico: number; estandar: number; premium: number }>;

export type CompanyConfig = {
  nombre: string;
  colorPrimario: string;
  contactEmail: string;
  contactTelefono: string;
  serviciosActivos: string[];
  preciosCustom: PreciosCustom;
  zonas: Zona[];
  extrasActivos: string[];
  preciosExtrasCustom: PreciosCustom;
};

const DEFAULT_CONFIG: CompanyConfig = {
  nombre: "Mi Empresa de Reformas",
  colorPrimario: "#fb923c",
  contactEmail: "info@miempresa.com",
  contactTelefono: "600 000 000",
  serviciosActivos: SERVICIOS.map((s) => s.id),
  preciosCustom: {},
  zonas: ZONAS_DEFAULT,
  extrasActivos: EXTRAS.map((e) => e.id),
  preciosExtrasCustom: {},
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
