export interface Vehiculo {
  id: number;
  nombre: string;
  marca: string;
  modelo?: string;
  anio: number;
  km: number;
  transmision: string;
  combustible: string;
  precio: number;
  estado: 'disponible' | 'vendido';
  imagen: string;
  descripcion?: string;
  images?: string[];
}

export const WHATSAPP_NUMBER = '50499999999';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const vehiculos: Vehiculo[] = [
  {
    id: 1,
    nombre: 'Toyota Hilux',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2021,
    km: 65000,
    transmision: 'Automática',
    combustible: 'Diesel',
    precio: 28500,
    estado: 'disponible',
    imagen: 'https://placehold.co/640x420/1e293b/f8fafc?text=Toyota+Hilux+2021',
    descripcion: 'Pickup en excelente estado, cómoda, fuerte y lista para uso diario o trabajo.',
    images: [
      'https://placehold.co/960x640/1e293b/f8fafc?text=Toyota+Hilux+Exterior',
      'https://placehold.co/960x640/334155/f8fafc?text=Toyota+Hilux+Interior',
      'https://placehold.co/960x640/111827/f8fafc?text=Toyota+Hilux+Motor',
    ],
  },
  {
    id: 2,
    nombre: 'Hyundai Tucson',
    marca: 'Hyundai',
    modelo: 'Tucson',
    anio: 2020,
    km: 48000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    precio: 22800,
    estado: 'disponible',
    imagen: 'https://placehold.co/640x420/164e63/f8fafc?text=Hyundai+Tucson+2020',
    descripcion: 'SUV familiar con buen confort, consumo eficiente y espacio amplio para ciudad o carretera.',
    images: [
      'https://placehold.co/960x640/164e63/f8fafc?text=Hyundai+Tucson+Exterior',
      'https://placehold.co/960x640/155e75/f8fafc?text=Hyundai+Tucson+Interior',
      'https://placehold.co/960x640/0f172a/f8fafc?text=Hyundai+Tucson+Panel',
    ],
  },
  {
    id: 3,
    nombre: 'Honda CR-V',
    marca: 'Honda',
    modelo: 'CR-V',
    anio: 2019,
    km: 72000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    precio: 19900,
    estado: 'disponible',
    imagen: 'https://placehold.co/640x420/14532d/f8fafc?text=Honda+CR-V+2019',
    descripcion: 'SUV confiable, espaciosa y suave de manejar, ideal para familia y viajes largos.',
    images: [
      'https://placehold.co/960x640/14532d/f8fafc?text=Honda+CR-V+Exterior',
      'https://placehold.co/960x640/166534/f8fafc?text=Honda+CR-V+Interior',
      'https://placehold.co/960x640/052e16/f8fafc?text=Honda+CR-V+Detalle',
    ],
  },
  {
    id: 4,
    nombre: 'Kia Sportage',
    marca: 'Kia',
    modelo: 'Sportage',
    anio: 2021,
    km: 39000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    precio: 23400,
    estado: 'disponible',
    imagen: 'https://placehold.co/640x420/312e81/f8fafc?text=Kia+Sportage+2021',
    descripcion: 'SUV moderna con diseño atractivo, buen equipamiento y manejo cómodo para uso diario.',
    images: [
      'https://placehold.co/960x640/312e81/f8fafc?text=Kia+Sportage+Exterior',
      'https://placehold.co/960x640/3730a3/f8fafc?text=Kia+Sportage+Interior',
      'https://placehold.co/960x640/1e1b4b/f8fafc?text=Kia+Sportage+Detalle',
    ],
  },
  {
    id: 5,
    nombre: 'Nissan Frontier',
    marca: 'Nissan',
    modelo: 'Frontier',
    anio: 2022,
    km: 31000,
    transmision: 'Automática',
    combustible: 'Diesel',
    precio: 31200,
    estado: 'disponible',
    imagen: 'https://placehold.co/640x420/365314/f8fafc?text=Nissan+Frontier+2022',
    descripcion: 'Pickup diesel robusta, lista para trabajo, carga y rutas exigentes con gran presencia.',
    images: [
      'https://placehold.co/960x640/365314/f8fafc?text=Nissan+Frontier+Exterior',
      'https://placehold.co/960x640/4d7c0f/f8fafc?text=Nissan+Frontier+Interior',
      'https://placehold.co/960x640/1a2e05/f8fafc?text=Nissan+Frontier+Caja',
    ],
  },
  {
    id: 6,
    nombre: 'Ford Escape',
    marca: 'Ford',
    modelo: 'Escape',
    anio: 2020,
    km: 54000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    precio: 21600,
    estado: 'vendido',
    imagen: 'https://placehold.co/640x420/7f1d1d/f8fafc?text=Ford+Escape+2020',
    descripcion: 'SUV compacta con buena respuesta, cabina cómoda y equipamiento práctico.',
    images: [
      'https://placehold.co/960x640/7f1d1d/f8fafc?text=Ford+Escape+Exterior',
      'https://placehold.co/960x640/991b1b/f8fafc?text=Ford+Escape+Interior',
      'https://placehold.co/960x640/450a0a/f8fafc?text=Ford+Escape+Detalle',
    ],
  },
];
