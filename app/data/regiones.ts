export type Region = {
  id: string;
  nombre: string;
  emoji: string;
  multiplicador: number;
  precioRefIntegral: number; // €/m² media real reforma integral estándar
};

// Precios basados en datos de mercado español 2024
// Precio base nacional: ~550 €/m² reforma integral estándar
export const COMUNIDADES: Region[] = [
  { id: "madrid", nombre: "Comunidad de Madrid", emoji: "🏛️", multiplicador: 1.36, precioRefIntegral: 750 },
  { id: "barcelona", nombre: "Barcelona ciudad", emoji: "🌊", multiplicador: 1.27, precioRefIntegral: 700 },
  { id: "cataluna", nombre: "Cataluña (excepto BCN)", emoji: "🌅", multiplicador: 1.09, precioRefIntegral: 600 },
  { id: "pais-vasco", nombre: "País Vasco", emoji: "🏔️", multiplicador: 1.24, precioRefIntegral: 680 },
  { id: "navarra", nombre: "Navarra", emoji: "🌿", multiplicador: 1.05, precioRefIntegral: 580 },
  { id: "baleares", nombre: "Islas Baleares", emoji: "🏖️", multiplicador: 1.18, precioRefIntegral: 650 },
  { id: "canarias", nombre: "Islas Canarias", emoji: "🌋", multiplicador: 1.02, precioRefIntegral: 560 },
  { id: "valencia", nombre: "Comunidad Valenciana", emoji: "🍊", multiplicador: 0.95, precioRefIntegral: 520 },
  { id: "andalucia", nombre: "Andalucía", emoji: "☀️", multiplicador: 0.87, precioRefIntegral: 480 },
  { id: "aragon", nombre: "Aragón", emoji: "🏰", multiplicador: 0.93, precioRefIntegral: 510 },
  { id: "galicia", nombre: "Galicia", emoji: "🌧️", multiplicador: 0.84, precioRefIntegral: 460 },
  { id: "asturias", nombre: "Asturias", emoji: "🍏", multiplicador: 0.85, precioRefIntegral: 470 },
  { id: "cantabria", nombre: "Cantabria", emoji: "⛵", multiplicador: 0.87, precioRefIntegral: 480 },
  { id: "castilla-leon", nombre: "Castilla y León", emoji: "🏯", multiplicador: 0.82, precioRefIntegral: 450 },
  { id: "castilla-mancha", nombre: "Castilla-La Mancha", emoji: "⚙️", multiplicador: 0.78, precioRefIntegral: 430 },
  { id: "extremadura", nombre: "Extremadura", emoji: "🌾", multiplicador: 0.73, precioRefIntegral: 400 },
  { id: "murcia", nombre: "Región de Murcia", emoji: "🌶️", multiplicador: 0.84, precioRefIntegral: 460 },
  { id: "la-rioja", nombre: "La Rioja", emoji: "🍇", multiplicador: 0.85, precioRefIntegral: 470 },
];
