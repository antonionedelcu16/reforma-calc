export type TipoReforma = {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  precioBasico: number;
  precioEstandar: number;
  premioPremium: number;
  unidad: "m2" | "fijo";
  minimoM2?: number;
};

export const SERVICIOS: TipoReforma[] = [
  {
    id: "bano",
    nombre: "Baño completo",
    icono: "🚿",
    descripcion: "Reforma integral de baño",
    precioBasico: 3500,
    precioEstandar: 6000,
    premioPremium: 11000,
    unidad: "fijo",
  },
  {
    id: "cocina",
    nombre: "Cocina completa",
    icono: "🍳",
    descripcion: "Reforma integral de cocina",
    precioBasico: 5000,
    precioEstandar: 9000,
    premioPremium: 16000,
    unidad: "fijo",
  },
  {
    id: "reforma-integral",
    nombre: "Reforma integral",
    icono: "🏠",
    descripcion: "Reforma completa del hogar",
    precioBasico: 350,
    precioEstandar: 650,
    premioPremium: 1100,
    unidad: "m2",
    minimoM2: 40,
  },
  {
    id: "pintura",
    nombre: "Pintura",
    icono: "🎨",
    descripcion: "Pintura de paredes y techos",
    precioBasico: 8,
    precioEstandar: 14,
    premioPremium: 22,
    unidad: "m2",
    minimoM2: 20,
  },
  {
    id: "suelos",
    nombre: "Suelos",
    icono: "🪵",
    descripcion: "Instalación de suelos y pavimentos",
    precioBasico: 25,
    precioEstandar: 50,
    premioPremium: 90,
    unidad: "m2",
    minimoM2: 10,
  },
  {
    id: "electricidad",
    nombre: "Instalación eléctrica",
    icono: "⚡",
    descripcion: "Renovación del sistema eléctrico",
    precioBasico: 35,
    precioEstandar: 55,
    premioPremium: 85,
    unidad: "m2",
    minimoM2: 30,
  },
  {
    id: "fontaneria",
    nombre: "Fontanería",
    icono: "🔧",
    descripcion: "Renovación de tuberías y sanitarios",
    precioBasico: 45,
    precioEstandar: 75,
    premioPremium: 130,
    unidad: "m2",
    minimoM2: 15,
  },
  {
    id: "tabiques",
    nombre: "Tabiques y distribución",
    icono: "🧱",
    descripcion: "Apertura o creación de paredes",
    precioBasico: 80,
    precioEstandar: 140,
    premioPremium: 220,
    unidad: "m2",
    minimoM2: 5,
  },
];

export const NIVELES = [
  {
    id: "basico",
    nombre: "Básico",
    descripcion: "Materiales estándar, acabados funcionales",
    color: "blue",
    emoji: "🔵",
  },
  {
    id: "estandar",
    nombre: "Estándar",
    descripcion: "Buena calidad, acabados cuidados",
    color: "orange",
    emoji: "🟠",
  },
  {
    id: "premium",
    nombre: "Premium",
    descripcion: "Alta gama, materiales exclusivos",
    color: "purple",
    emoji: "🟣",
  },
];
