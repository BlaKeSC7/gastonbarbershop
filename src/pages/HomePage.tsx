import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';
import { Cpu, Monitor, Laptop, Mouse, ChevronRight } from 'lucide-react';

const carouselImages = [
  "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
  "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg",
  "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"
];

const features = [
  {
    icon: <Laptop className="w-12 h-12 text-primary" />,
    title: "Laptops de Alto Rendimiento",
    description: "Desde MacBooks hasta laptops gaming, tenemos la solución perfecta para ti."
  },
  {
    icon: <Cpu className="w-12 h-12 text-primary" />,
    title: "PCs Personalizadas",
    description: "Armamos la computadora ideal según tus necesidades y presupuesto."
  },
  {
    icon: <Monitor className="w-12 h-12 text-primary" />,
    title: "Monitores Profesionales",
    description: "Alta resolución y calidad de color para tu espacio de trabajo."
  }
];

const HomePage: React.FC = () => {
  const topRatedProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <div>
      <Carousel images={carouselImages} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 -mt-6 relative rounded-t-lg shadow-md">
          {/* Características Principales */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Nuestras Soluciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Cotización Virtual</h3>
                <p className="mb-4">Obtén una cotización personalizada para tu próxima computadora o setup completo.</p>
                <Link to="/quotes" className="inline-flex items-center text-sm hover:underline">
                  Solicitar cotización <ChevronRight size={16} />
                </Link>
              </div>
              <div className="bg-primary-dark text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Soporte Técnico</h3>
                <p className="mb-4">Servicio técnico especializado para mantener tu equipo en óptimas condiciones.</p>
                <a href="https://wa.me/18095543052" className="inline-flex items-center text-sm hover:underline">
                  Contactar soporte <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Productos Destacados */}
          <div>
            <ProductGrid products={topRatedProducts} title="Productos Destacados" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
