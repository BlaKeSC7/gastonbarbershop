import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductGrid from '../components/ProductGrid';
import { Filter, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  // Filter products when category changes
  useEffect(() => {
    if (category) {
      const filtered = products.filter(p => p.category === category);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [category, products]);
  
  // Apply sorting
  const sortProducts = (option: string) => {
    setSortOption(option);
    
    let sorted = [...filteredProducts];
    switch (option) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured - no specific sort
        break;
    }
    
    setFilteredProducts(sorted);
  };
  
  // Apply price filter
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    
    if (category) {
      const filtered = products.filter(
        p => p.category === category && p.price >= min && p.price <= max
      );
      setFilteredProducts(filtered);
    } else {
      const filtered = products.filter(p => p.price >= min && p.price <= max);
      setFilteredProducts(filtered);
    }
  };
  
  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };
  
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#FF9900]">Home</Link>
          {' > '}
          <span>{category || 'All Products'}</span>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-medium">
            {category || 'All Products'} 
            <span className="text-gray-500 text-lg ml-2">
              ({filteredProducts.length} products)
            </span>
          </h1>
        </div>
        
        {/* Mobile filter toggle */}
        <button 
          className="md:hidden flex items-center text-gray-800 mb-4"
          onClick={toggleFilters}
        >
          <Filter size={20} className="mr-2" />
          Filters
          {filterOpen ? <ChevronUp size={20} className="ml-1" /> : <ChevronDown size={20} className="ml-1" />}
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Sidebar filters - hidden on mobile unless toggled */}
          <div className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 md:pr-8`}>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="mb-4">
                <h3 className="font-medium flex items-center">
                  <Sliders size={18} className="mr-2" />
                  Sort By
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="sort-featured" 
                      name="sort" 
                      checked={sortOption === 'featured'} 
                      onChange={() => sortProducts('featured')}
                      className="mr-2"
                    />
                    <label htmlFor="sort-featured">Featured</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="sort-price-low" 
                      name="sort" 
                      checked={sortOption === 'price-low'} 
                      onChange={() => sortProducts('price-low')}
                      className="mr-2"
                    />
                    <label htmlFor="sort-price-low">Price: Low to High</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="sort-price-high" 
                      name="sort" 
                      checked={sortOption === 'price-high'} 
                      onChange={() => sortProducts('price-high')}
                      className="mr-2"
                    />
                    <label htmlFor="sort-price-high">Price: High to Low</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="sort-rating" 
                      name="sort" 
                      checked={sortOption === 'rating'} 
                      onChange={() => sortProducts('rating')}
                      className="mr-2"
                    />
                    <label htmlFor="sort-rating">Avg. Customer Review</label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span>${priceRange[0]}</span>
                  <span>-</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePriceChange(0, 25)}
                    className={`px-3 py-1 text-sm border ${
                      priceRange[0] === 0 && priceRange[1] === 25 
                        ? 'border-[#FF9900] text-[#FF9900]' 
                        : 'border-gray-300'
                    } rounded-md`}
                  >
                    Under $25
                  </button>
                  <button 
                    onClick={() => handlePriceChange(25, 50)}
                    className={`px-3 py-1 text-sm border ${
                      priceRange[0] === 25 && priceRange[1] === 50 
                        ? 'border-[#FF9900] text-[#FF9900]' 
                        : 'border-gray-300'
                    } rounded-md`}
                  >
                    $25-$50
                  </button>
                  <button 
                    onClick={() => handlePriceChange(50, 100)}
                    className={`px-3 py-1 text-sm border ${
                      priceRange[0] === 50 && priceRange[1] === 100
                        ? 'border-[#FF9900] text-[#FF9900]' 
                        : 'border-gray-300'
                    } rounded-md`}
                  >
                    $50+
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters or browse other categories.</p>
                <Link 
                  to="/" 
                  className="bg-[#FF9900] hover:bg-[#e88e00] text-white px-6 py-2 rounded-md transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;