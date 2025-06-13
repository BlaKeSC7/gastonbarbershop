import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating) 
                ? 'text-[#FFA41C] fill-[#FFA41C]' 
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link to={`/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-primary">
            {product.title}
          </h3>
          <div className="mb-2">
            {renderRating(product.rating)}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </div>
          {product.specs && (
            <div className="mt-2 text-sm text-gray-600">
              {product.specs.processor && <div>Procesador: {product.specs.processor}</div>}
              {product.specs.ram && <div>RAM: {product.specs.ram}</div>}
              {product.specs.storage && <div>Almacenamiento: {product.specs.storage}</div>}
            </div>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Link 
          to="/quotes" 
          className="w-full bg-primary hover:bg-primary-dark text-white text-sm py-2 rounded-full font-medium transition-colors shadow-sm mt-2 block text-center"
        >
          Solicitar Cotización
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;