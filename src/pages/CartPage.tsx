import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your Amazon Cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Your shopping cart is waiting. Give it purpose – fill it with books, electronics, videos, etc. and make it happy.
          </p>
          <Link 
            to="/" 
            className="bg-[#FF9900] hover:bg-[#e88e00] text-white px-6 py-3 rounded-md transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium mb-6">Shopping Cart</h1>
      
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="border-b pb-3 mb-3 flex justify-between items-center">
              <h2 className="text-xl font-medium">Cart ({itemCount} items)</h2>
              <span className="text-gray-500">Price</span>
            </div>
            
            {items.map(item => (
              <div key={item.id} className="py-4 border-b border-gray-200 last:border-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-32 h-32 flex-shrink-0 mb-4 sm:mb-0">
                    <Link to={`/product/${item.id}`}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain" 
                      />
                    </Link>
                  </div>
                  
                  <div className="flex-grow sm:ml-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-grow">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-lg font-medium hover:text-[#FF9900]">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-green-600 mb-2">In Stock</p>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center">
                          <select 
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="border border-gray-300 rounded-md p-1 mr-4 text-sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-[#007185] hover:text-[#FF9900] hover:underline flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-lg font-medium mt-2 sm:mt-0 sm:ml-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-right text-lg font-medium pt-4">
              Subtotal ({itemCount} items): ${total.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-lg mb-4">
              Subtotal ({itemCount} items): <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center mb-4">
              <input type="checkbox" id="gift" className="mr-2" />
              <label htmlFor="gift" className="text-sm">This order contains a gift</label>
            </div>
            
            <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-medium py-2 rounded-md mb-3">
              Proceed to Checkout
            </button>
            
            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="font-medium mb-2">Frequently bought together</h3>
              <div className="text-sm text-[#007185] hover:text-[#FF9900] hover:underline">
                <Link to="/" className="flex items-center">
                  View recommendations
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;