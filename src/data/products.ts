export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  specs?: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    size?: string;
    features?: string[];
  };
}

export const categories = ['Portátiles', 'Computadoras de Escritorio', 'Monitores', 'Sillas', 'Escritorios', 'Accesorios'];

export const products: Product[] = [
  // Laptops
  {
    id: '1',
    title: 'MacBook Pro 14"',
    description: 'Último MacBook Pro con chip M2 Pro, perfecto para profesionales y creadores de contenido.',
    price: 175000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/434346/pexels-photo-434346.jpeg',
    category: 'Portátiles',
    specs: {
      processor: 'Apple M2 Pro',
      ram: '16GB Memoria Unificada',
      storage: '512GB SSD',
      display: '14" Liquid Retina XDR'
    }
  },
  {
    id: '2',
    title: 'ASUS ROG Strix G15',
    description: 'Laptop gaming con RTX 4060 y pantalla 165Hz para gaming competitivo.',
    price: 145000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
    category: 'Portátiles',
    specs: {
      processor: 'AMD Ryzen 9 7945HX',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      graphics: 'NVIDIA RTX 4060 8GB'
    }
  },
  {
    id: '3',
    title: 'Lenovo ThinkPad X1 Carbon',
    description: 'Ultrabook empresarial con gran autonomía y construcción premium.',
    price: 155000,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg',
    category: 'Portátiles',
    specs: {
      processor: 'Intel Core i7-1360P',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '14" 2.8K OLED'
    }
  },
  {
    id: '4',
    title: 'Dell XPS 15',
    description: 'Laptop premium para creadores de contenido con pantalla OLED.',
    price: 185000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
    category: 'Portátiles',
    specs: {
      processor: 'Intel Core i9-13900H',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 4070'
    }
  },
  {
    id: '5',
    title: 'HP Pavilion Gaming',
    description: 'Laptop gaming asequible con gran rendimiento.',
    price: 95000,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg',
    category: 'Portátiles',
    specs: {
      processor: 'AMD Ryzen 7 7735HS',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 3050'
    }
  },

  // Desktop PCs
  {
    id: '6',
    title: 'PC Gaming Pro RGB',
    description: 'PC gaming personalizada con RTX 4070, perfecta para juegos de alta gama.',
    price: 125000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
    category: 'Computadoras de Escritorio',
    specs: {
      processor: 'Intel Core i7-13700K',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      graphics: 'NVIDIA RTX 4070'
    }
  },
  {
    id: '7',
    title: 'PC Workstation Render',
    description: 'Estación de trabajo optimizada para renderizado y diseño 3D.',
    price: 185000,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg',
    category: 'Computadoras de Escritorio',
    specs: {
      processor: 'AMD Ryzen 9 7950X',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      graphics: 'NVIDIA RTX 4090'
    }
  },
  {
    id: '8',
    title: 'PC Office Pro',
    description: 'Computadora optimizada para entornos de oficina y productividad.',
    price: 45000,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    category: 'Computadoras de Escritorio',
    specs: {
      processor: 'Intel Core i5-13400',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      graphics: 'Intel UHD 730'
    }
  },
  {
    id: '9',
    title: 'PC Streaming 4K',
    description: 'Configuración especial para streaming y creación de contenido.',
    price: 135000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/977213/pexels-photo-977213.jpeg',
    category: 'Computadoras de Escritorio',
    specs: {
      processor: 'AMD Ryzen 7 7800X3D',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      graphics: 'NVIDIA RTX 4070 Ti'
    }
  },
  {
    id: '10',
    title: 'PC Gaming Starter',
    description: 'PC gaming de entrada para juegos populares y esports.',
    price: 65000,
    rating: 4.4,
    image: 'https://images.pexels.com/photos/1034425/pexels-photo-1034425.jpeg',
    category: 'Computadoras de Escritorio',
    specs: {
      processor: 'Intel Core i5-13400F',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      graphics: 'NVIDIA RTX 3060'
    }
  },

  // Monitores
  {
    id: '11',
    title: 'Monitor Dell 27" 4K',
    description: 'Monitor profesional 4K con excelente precisión de color.',
    price: 45000,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    category: 'Monitores',
    specs: {
      display: '27" 4K IPS',
      features: ['Conectividad USB-C', 'HDR400', 'Calibrado de fábrica']
    }
  },
  {
    id: '12',
    title: 'Monitor Gaming 240Hz',
    description: 'Monitor gaming de alta frecuencia para juegos competitivos.',
    price: 55000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
    category: 'Monitores',
    specs: {
      display: '25" 1080p IPS',
      features: ['240Hz', 'G-Sync', '0.5ms GTG']
    }
  },
  {
    id: '13',
    title: 'Monitor Ultrawide 34"',
    description: 'Monitor ultrawide curvo para productividad y gaming.',
    price: 65000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    category: 'Monitores',
    specs: {
      display: '34" 3440x1440 VA',
      features: ['144Hz', 'FreeSync Premium', 'HDR400']
    }
  },
  {
    id: '14',
    title: 'Monitor 4K HDR Pro',
    description: 'Monitor profesional con HDR1000 para edición de video.',
    price: 85000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg',
    category: 'Monitores',
    specs: {
      display: '32" 4K IPS',
      features: ['HDR1000', 'Adobe RGB 99%', 'Calibración hardware']
    }
  },
  {
    id: '15',
    title: 'Monitor Básico 24"',
    description: 'Monitor económico para uso general y oficina.',
    price: 15000,
    rating: 4.4,
    image: 'https://images.pexels.com/photos/1999463/pexels-photo-1999463.jpeg',
    category: 'Monitores',
    specs: {
      display: '24" 1080p IPS',
      features: ['75Hz', 'FreeSync', 'Flicker-free']
    }
  },

  // Sillas
  {
    id: '16',
    title: 'Silla Gaming Pro RGB',
    description: 'Silla gaming premium con iluminación RGB y máximo confort.',
    price: 25000,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3829226/pexels-photo-3829226.jpeg',
    category: 'Sillas',
    specs: {
      features: ['RGB personalizable', 'Reclinable 180°', 'Cojines memory foam']
    }
  },
  {
    id: '17',
    title: 'Silla Ejecutiva Ergonómica',
    description: 'Silla de oficina con diseño ergonómico y ajustes profesionales.',
    price: 35000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg',
    category: 'Sillas',
    specs: {
      features: ['Soporte lumbar ajustable', 'Reposacabezas 4D', 'Malla transpirable']
    }
  },
  {
    id: '18',
    title: 'Silla Gaming Básica',
    description: 'Silla gaming económica con buen soporte y comodidad.',
    price: 12000,
    rating: 4.3,
    image: 'https://images.pexels.com/photos/5082567/pexels-photo-5082567.jpeg',
    category: 'Sillas',
    specs: {
      features: ['Reclinable 150°', 'Reposabrazos 2D', 'Cojín lumbar']
    }
  },
  {
    id: '19',
    title: 'Silla Ergonómica Pro',
    description: 'Silla profesional con múltiples ajustes y soporte personalizado.',
    price: 45000,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4469135/pexels-photo-4469135.jpeg',
    category: 'Sillas',
    specs: {
      features: ['Soporte lumbar dinámico', 'Asiento deslizable', 'Reposabrazos 5D']
    }
  },
  {
    id: '20',
    title: 'Silla Gaming XL',
    description: 'Silla gaming extra grande para máximo confort.',
    price: 28000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/3740240/pexels-photo-3740240.jpeg',
    category: 'Sillas',
    specs: {
      features: ['Capacidad 180kg', 'Asiento ancho', 'Reclinable 180°']
    }
  },

  // Escritorios
  {
    id: '21',
    title: 'Escritorio Gaming RGB',
    description: 'Escritorio gaming con sistema de iluminación RGB y gestión de cables.',
    price: 35000,
    rating: 4.4,
    image: 'https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg',
    category: 'Escritorios',
    specs: {
      size: '180x80cm',
      features: ['Iluminación RGB', 'Gestión de cables', 'Altura ajustable']
    }
  },
  {
    id: '22',
    title: 'Escritorio Ejecutivo L',
    description: 'Escritorio ejecutivo en forma de L con acabado premium.',
    price: 42000,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    category: 'Escritorios',
    specs: {
      size: '180x160cm',
      features: ['Forma en L', 'Gestión de cables', 'Acabado en madera']
    }
  },
  {
    id: '23',
    title: 'Escritorio Gaming Compacto',
    description: 'Escritorio gaming para espacios reducidos con features premium.',
    price: 25000,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/3771823/pexels-photo-3771823.jpeg',
    category: 'Escritorios',
    specs: {
      size: '120x60cm',
      features: ['Portavasos', 'Soporte headset', 'Gestión de cables']
    }
  },
  {
    id: '24',
    title: 'Escritorio Altura Ajustable',
    description: 'Escritorio eléctrico con altura ajustable para trabajo de pie o sentado.',
    price: 65000,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/7054511/pexels-photo-7054511.jpeg',
    category: 'Escritorios',
    specs: {
      size: '160x80cm',
      features: ['Ajuste eléctrico', 'Memoria 3 posiciones', 'Panel de control táctil']
    }
  },
  {
    id: '25',
    title: 'Escritorio Básico Pro',
    description: 'Escritorio funcional con excelente relación calidad-precio.',
    price: 18000,
    rating: 4.3,
    image: 'https://images.pexels.com/photos/3740720/pexels-photo-3740720.jpeg',
    category: 'Escritorios',
    specs: {
      size: '140x60cm',
      features: ['Resistente', 'Fácil ensamblaje', 'Acabado mate']
    }
  },

  // Accesorios
  {
    id: '26',
    title: 'Mouse Gaming Pro',
    description: 'Mouse gaming inalámbrico de alta precisión con iluminación RGB.',
    price: 3500,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
    category: 'Accesorios',
    specs: {
      features: ['Sensor 25K DPI', '70hrs batería', 'RGB personalizable']
    }
  },
  {
    id: '27',
    title: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico gaming con switches Cherry MX.',
    price: 6500,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    category: 'Accesorios',
    specs: {
      features: ['Switches Cherry MX Red', 'RGB per-key', 'Reposamuñecas']
    }
  },
  {
    id: '28',
    title: 'Headset Gaming 7.1',
    description: 'Auriculares gaming con sonido envolvente 7.1 y micrófono.',
    price: 4500,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    category: 'Accesorios',
    specs: {
      features: ['Sonido 7.1', 'Micrófono desmontable', 'RGB']
    }
  },
  {
    id: '29',
    title: 'Mousepad XL RGB',
    description: 'Mousepad extendido con iluminación RGB personalizable.',
    price: 2500,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/4792731/pexels-photo-4792731.jpeg',
    category: 'Accesorios',
    specs: {
      features: ['900x400mm', '14 modos RGB', 'Base antideslizante']
    }
  },
  {
    id: '30',
    title: 'Webcam 4K Pro',
    description: 'Webcam profesional 4K con micrófono dual.',
    price: 8500,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/3482442/pexels-photo-3482442.jpeg',
    category: 'Accesorios',
    specs: {
      features: ['4K 30FPS', 'Micrófono dual', 'Enfoque automático']
    }
  }
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'quoted' | 'completed';
  requestDate: string;
  requirements: string;
  budget: number;
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '809-555-0123',
    status: 'pending',
    requestDate: '2024-03-15',
    requirements: 'Busco una PC gaming con presupuesto de RD$200,000',
    budget: 200000
  },
  {
    id: '2',
    name: 'María Rodríguez',
    email: 'maria.r@email.com',
    phone: '809-555-0124',
    status: 'quoted',
    requestDate: '2024-03-14',
    requirements: 'Necesito 5 computadoras para mi oficina',
    budget: 250000
  }
];