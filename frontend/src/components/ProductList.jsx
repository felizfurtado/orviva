import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ProductCard from './ProductCard';

const API_BASE_URL = 'http://tenant1.localhost:8000/api';

const CATEGORIES = [
  { label: 'All', icon: 'fas fa-th-large' },
  { label: 'Cookies', icon: 'fas fa-cookie-bite' },
  { label: 'Cupcakes', icon: 'fas fa-candy-cane' },
  { label: 'Cakes', icon: 'fas fa-birthday-cake' },
  { label: 'Cheesecakes', icon: 'fas fa-cheese' },
  { label: 'Dessert Cups', icon: 'fas fa-wine-glass-alt' },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu/`);
      console.log('API Response:', response.data); // Debug
      
      const allProducts = [];
      
      // Dynamically handle ALL categories from the API response
      const categoryKeys = {
        'cookies': 'Cookies',
        'cupcakes': 'Cupcakes',
        'cakes': 'Cakes',
        'cheesecakes': 'Cheesecakes',
        'dessert_cups': 'Dessert Cups',
      };
      
      // Loop through all possible category keys
      Object.entries(categoryKeys).forEach(([key, categoryName]) => {
        if (response.data[key] && Array.isArray(response.data[key])) {
          response.data[key].forEach(p => {
            allProducts.push({ ...p, category: categoryName });
          });
        }
      });
      
      // Also check for any other dynamic categories that might be returned
      if (response.data.categories && Array.isArray(response.data.categories)) {
        response.data.categories.forEach(cat => {
          const key = cat.label.toLowerCase().replace(' ', '_');
          if (response.data[key] && Array.isArray(response.data[key])) {
            // Already handled above, skip
          } else if (cat.products && Array.isArray(cat.products)) {
            cat.products.forEach(p => {
              allProducts.push({ ...p, category: cat.label });
            });
          }
        });
      }

      console.log('Processed products:', allProducts); // Debug
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleDelete = async (productId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this product?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}/delete/`);
      toast.success('Product deleted! 🗑️');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef9f3] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-[3px] border-[#f6c54a] border-t-transparent animate-spin mx-auto mb-3"></div>
          <p className="text-[#9b8e8a] font-['Poppins'] text-xs">Loading treats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f3] w-full max-w-[430px] mx-auto relative">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Poppins',
            fontSize: '13px',
            borderRadius: '14px',
            padding: '10px 18px',
            maxWidth: '300px',
          },
        }}
      />

      {/* Main Container */}
      <div className="px-4 pt-5 pb-24">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-[55px] h-[55px] rounded-full bg-[#f6c54a]/20 mb-3">
            <i className="fas fa-box-open text-[24px] text-[#f6c54a]"></i>
          </div>
          <h1 className="font-['Dancing_Script'] text-[28px] font-bold bg-gradient-to-r from-[#2f1a10] to-[#8b5e3c] bg-clip-text text-transparent leading-tight">
            All Products
          </h1>
          <p className="font-['Poppins'] text-[10px] text-[#9b8e8a] mt-0.5">
            {products.length} delicious treats available
          </p>
        </div>

        {/* Category Filter - Horizontal Scroll with Fade */}
        <div className="relative mb-5">
          {/* Fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#fef9f3] to-transparent z-[1] pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#fef9f3] to-transparent z-[1] pointer-events-none"></div>
          
          <div className="flex gap-1.5 overflow-x-auto pb-2 px-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              // Only show categories that have products or "All"
              const hasProducts = cat.label === 'All' || 
                products.some(p => p.category === cat.label);
              
              if (!hasProducts) return null; // Hide empty categories
              
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveFilter(cat.label)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-[16px] text-[10px] font-semibold font-['Poppins'] transition-all active:scale-95 ${
                    activeFilter === cat.label
                      ? 'bg-[#f6c54a] text-[#2f1a10] shadow-[0_3px_10px_rgba(246,197,74,0.25)]'
                      : 'bg-white text-[#9b8e8a] border border-[#f0e3d7] active:bg-[#fff8ed]'
                  }`}
                >
                  <i className={`${cat.icon} text-[12px]`}></i>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Indicator */}
        {activeFilter !== 'All' && (
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f6c54a]"></span>
              <span className="text-[11px] font-medium text-[#2f1a10] font-['Poppins']">
                Showing {activeFilter}
              </span>
            </div>
            <button
              onClick={() => setActiveFilter('All')}
              className="text-[10px] text-[#f4a800] font-medium font-['Poppins'] underline active:text-[#d49300]"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Products Grid - 2 Columns Mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id || index} 
                className="relative group/tile animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} index={index} />
                
                {/* Delete Button - Visible on tap for mobile */}
                <button
                  onClick={(e) => handleDelete(product.id, e)}
                  className="absolute top-1.5 right-1.5 w-[24px] h-[24px] rounded-full bg-red-500/90 text-white text-[10px] flex items-center justify-center active:bg-red-600 transition-all z-[5] backdrop-blur-sm shadow-lg"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <div className="w-[80px] h-[80px] rounded-full bg-[#f0e3d7]/30 flex items-center justify-center mb-4">
              <i className="fas fa-cupcake text-[32px] text-[#d4b896]"></i>
            </div>
            <p className="text-[#9b8e8a] font-['Poppins'] text-sm font-medium mb-1">
              No treats here yet!
            </p>
            <p className="text-[#c4b5ab] font-['Poppins'] text-[10px] text-center max-w-[200px]">
              Add some delicious products to this category
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 px-4 py-2 bg-[#f6c54a] text-[#2f1a10] rounded-[16px] text-[11px] font-semibold font-['Poppins'] active:scale-95 transition-transform"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Product Count Badge */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-[10px] text-[#9b8e8a] font-['Poppins'] border border-[#f0e3d7]">
              <i className="fas fa-check-circle text-[#6dbb58] text-[11px]"></i>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
        )}
      </div>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Active state for mobile */
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
        
        /* Prevent text selection on buttons */
        button {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default ProductList;