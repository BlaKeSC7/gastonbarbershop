import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, CheckCircle } from 'lucide-react';
import { products } from '../data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Producto No Encontrado</h2>
        <p className="mb-6">El producto que busca no existe o ha sido removido.</p>
        <Link 
          to="/" 
          className="bg-[#FF9900] hover:bg-[#e88e00] text-white px-6 py-3 rounded-md transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }
  
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={`${
              i < Math.floor(rating) 
                ? 'text-[#FFA41C] fill-[#FFA41C]' 
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Related products (same category)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#FF9900]">Inicio</Link>
          {' > '}
          <Link to={`/category/${product.category}`} className="hover:text-[#FF9900]">{product.category}</Link>
          {' > '}
          <span>{product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-4">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-96 object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-medium mb-2">{product.title}</h1>
            <div className="mb-4">
              {renderRating(product.rating)}
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                RD${product.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Precio referencial
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-700 mb-2">
                <Truck size={18} className="mr-2 text-green-600" />
                <span>Entrega disponible</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 mb-2">
                <Shield size={18} className="mr-2 text-green-600" />
                <span>Garantía de 2 años disponible</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                <span>Stock disponible</span>
              </div>
            </div>
            
            <Link 
              to="/quotes" 
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors block text-center font-medium"
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="h-32 flex items-center justify-center mb-3">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.title} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {relatedProduct.title}
                    </h3>
                    <div className="mt-1 text-sm text-gray-900 font-semibold">
                      RD${relatedProduct.price.toLocaleString()}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;