export type TipoReforma = {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  precioBasico: number;
  precioEstandar: number;
  precioPremium: number;
  unidad: "m2" | "fijo" | "habitaciones";
  minimoM2?: number;
  extrasAplicables: string[];
};

export type Zona = {
  id: string;
  nombre: string;
  multiplicador: number;
};

export type Extra = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  precioBasico: number;
  precioEstandar: number;
  precioPremium: number;
  unidad: "fijo" | "m2";
};

export type Habitaciones = {
  banos: number;
  dormitorios: number;
  salon: boolean;
  cocina: boolean;
  pasillo: boolean;
};

export const SERVICIOS: TipoReforma[] = [
  {
    id: "bano",
    nombre: "Baño completo",
    icono: "🚿",
    descripcion: "Reforma integral de baño",
    precioBasico: 3200,
    precioEstandar: 5800,
    precioPremium: 10500,
    unidad: "fijo",
    extrasAplicables: ["escombros", "permisos", "climatizacion"],
  },
  {
    id: "cocina",
    nombre: "Cocina completa",
    icono: "🍳",
    descripcion: "Reforma integral de cocina",
    precioBasico: 4800,
    precioEstandar: 8500,
    precioPremium: 15000,
    unidad: "fijo",
    extrasAplicables: ["escombros", "permisos", "electrodomesticos", "climatizacion"],
  },
  {
    id: "reforma-integral",
    nombre: "Reforma integral",
    icono: "🏠",
    descripcion: "Reforma completa del hogar",
    precioBasico: 320,
    precioEstandar: 600,
    precioPremium: 1050,
    unidad: "habitaciones",
    extrasAplicables: ["escombros", "permisos", "climatizacion", "domótica"],
  },
  {
    id: "pintura",
    nombre: "Pintura",
    icono: "🎨",
    descripcion: "Pintura de paredes y techos",
    precioBasico: 8,
    precioEstandar: 14,
    precioPremium: 22,
    unidad: "m2",
    minimoM2: 20,
    extrasAplicables: ["escombros", "gotele"],
  },
  {
    id: "suelos",
    nombre: "Suelos",
    icono: "🪵",
    descripcion: "Instalación de suelos y pavimentos",
    precioBasico: 25,
    precioEstandar: 50,
    precioPremium: 90,
    unidad: "m2",
    minimoM2: 10,
    extrasAplicables: ["escombros", "rodapie"],
  },
  {
    id: "electricidad",
    nombre: "Instalación eléctrica",
    icono: "⚡",
    descripcion: "Renovación del sistema eléctrico",
    precioBasico: 35,
    precioEstandar: 55,
    precioPremium: 85,
    unidad: "m2",
    minimoM2: 30,
    extrasAplicables: ["permisos", "domótica"],
  },
  {
    id: "fontaneria",
    nombre: "Fontanería",
    icono: "🔧",
    descripcion: "Renovación de tuberías y sanitarios",
    precioBasico: 45,
    precioEstandar: 75,
    precioPremium: 130,
    unidad: "m2",
    minimoM2: 15,
    extrasAplicables: ["escombros", "permisos"],
  },
  {
    id: "tabiques",
    nombre: "Tabiques",
    icono: "🧱",
    descripcion: "Apertura o creación de paredes",
    precioBasico: 80,
    precioEstandar: 140,
    precioPremium: 220,
    unidad: "m2",
    minimoM2: 5,
    extrasAplicables: ["escombros", "permisos"],
  },
];

export const ZONAS_DEFAULT: Zona[] = [
  { id: "centro", nombre: "Centro / Zona premium", multiplicador: 1.25 },
  { id: "ciudad", nombre: "Ciudad", multiplicador: 1.0 },
  { id: "extrarradio", nombre: "Extrarradio / Periferia", multiplicador: 0.85 },
  { id: "rural", nombre: "Zona rural", multiplicador: 0.75 },
];

export const EXTRAS: Extra[] = [
  {
    id: "escombros",
    nombre: "Retirada de escombros",
    descripcion: "Gestión y transporte de residuos de obra",
    icono: "🗑️",
    precioBasico: 300,
    precioEstandar: 400,
    precioPremium: 550,
    unidad: "fijo",
  },
  {
    id: "permisos",
    nombre: "Gestión de permisos",
    descripcion: "Tramitación de licencias y documentación",
    icono: "📋",
    precioBasico: 250,
    precioEstandar: 350,
    precioPremium: 500,
    unidad: "fijo",
  },
  {
    id: "climatizacion",
    nombre: "Climatización",
    descripcion: "Instalación de aire acondicionado o calefacción",
    icono: "❄️",
    precioBasico: 1200,
    precioEstandar: 2200,
    precioPremium: 4000,
    unidad: "fijo",
  },
  {
    id: "electrodomesticos",
    nombre: "Electrodomésticos incluidos",
    descripcion: "Pack de electrodomésticos de cocina",
    icono: "🧊",
    precioBasico: 1500,
    precioEstandar: 3000,
    precioPremium: 6000,
    unidad: "fijo",
  },
  {
    id: "domótica",
    nombre: "Domótica",
    descripcion: "Sistema de hogar inteligente",
    icono: "📱",
    precioBasico: 800,
    precioEstandar: 1800,
    precioPremium: 4500,
    unidad: "fijo",
  },
  {
    id: "gotele",
    nombre: "Eliminación de gotelé",
    descripcion: "Saneado y alisado de paredes con gotelé",
    icono: "🪚",
    precioBasico: 4,
    precioEstandar: 6,
    precioPremium: 8,
    unidad: "m2",
  },
  {
    id: "rodapie",
    nombre: "Rodapiés incluidos",
    descripcion: "Instalación de rodapiés a juego",
    icono: "📐",
    precioBasico: 8,
    precioEstandar: 15,
    precioPremium: 28,
    unidad: "m2",
  },
];

export const M2_POR_ESTANCIA = {
  bano: 6,
  dormitorio: 12,
  salon: 28,
  cocina: 10,
  pasillo: 8,
};

export const calcularM2Habitaciones = (h: Habitaciones): number => {
  let total = 0;
  total += h.banos * M2_POR_ESTANCIA.bano;
  total += h.dormitorios * M2_POR_ESTANCIA.dormitorio;
  if (h.salon) total += M2_POR_ESTANCIA.salon;
  if (h.cocina) total += M2_POR_ESTANCIA.cocina;
  if (h.pasillo) total += M2_POR_ESTANCIA.pasillo;
  return total;
};

export const NIVELES = [
  {
    id: "basico" as const,
    nombre: "Básico",
    descripcion: "Materiales estándar, acabados funcionales",
    variacionMin: 0.92,
    variacionMax: 1.08,
  },
  {
    id: "estandar" as const,
    nombre: "Estándar",
    descripcion: "Buena calidad, acabados cuidados",
    variacionMin: 0.90,
    variacionMax: 1.12,
  },
  {
    id: "premium" as const,
    nombre: "Premium",
    descripcion: "Alta gama, materiales exclusivos",
    variacionMin: 0.88,
    variacionMax: 1.15,
  },
];
