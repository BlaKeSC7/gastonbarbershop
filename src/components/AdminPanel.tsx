import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categories } from '../data/products';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'quotes'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    specs: {}
  });

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchQuotes();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
    }
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          customers (
            name,
            email,
            phone
          )
        `);
      if (error) throw error;
      setQuotes(data || []);
    } catch (err: any) {
      console.error('Error fetching quotes:', err);
      setError(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('products').insert([{
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: 0,
        specs: JSON.stringify(newProduct.specs)
      }]);

      if (error) throw error;

      setNewProduct({
        title: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        specs: {}
      });
      
      await fetchProducts();
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', quoteId);

      if (error) throw error;
      await fetchQuotes();
    } catch (err: any) {
      console.error('Error updating quote:', err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'products' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'quotes' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('quotes')}
          >
            Cotizaciones
          </button>
        </div>

        {activeTab === 'products' ? (
          <div>
            <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Título del producto"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Descripción"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                type="submit" 
                className={`w-full bg-primary text-white py-2 rounded ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                }`}
                disabled={loading}
              >
                {loading ? 'Agregando...' : 'Agregar Producto'}
              </button>
            </form>

            <div className="space-y-4">
              {products.map((product: any) => (
                <div key={product.id} className="border p-4 rounded">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-primary">RD${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote: any) => (
              <div key={quote.id} className="border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{quote.customers?.name}</h3>
                    <p className="text-gray-600">{quote.customers?.email}</p>
                    <p className="text-gray-600">{quote.requirements}</p>
                    <p className="text-primary">Presupuesto: RD${quote.budget}</p>
                  </div>
                  <select
                    value={quote.status}
                    onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Proceso</option>
                    <option value="quoted">Cotizado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;