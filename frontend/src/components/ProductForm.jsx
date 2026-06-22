import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://tenant1.localhost:8000/api';

const CATEGORIES = [
  { label: 'Cookies', icon: 'fas fa-cookie-bite' },
  { label: 'Cupcakes', icon: 'fas fa-candy-cane' },
  { label: 'Cakes', icon: 'fas fa-birthday-cake' },
  { label: 'Cheesecakes', icon: 'fas fa-cheese' },
  { label: 'Dessert Cups', icon: 'fas fa-wine-glass-alt' },
];

const RIBBON_TYPES = [
  { value: '', label: 'None' },
  { value: 'bestseller', label: 'Best Seller' },
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New' },
];

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    sub: '',
    price: '',
    image: '',
    category: 'Cookies',
    icon: 'fas fa-cookie-bite',
    ribbon: '',
    ribbon_type: '',
    liked: false,
  });

  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (category) => {
    const cat = CATEGORIES.find(c => c.label === category);
    setFormData({
      ...formData,
      category,
      icon: cat ? cat.icon : '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields', {
        icon: '⚠️',
        style: { fontSize: '12px' }
      });
      return;
    }

    // Validate image URL
    if (!formData.image.match(/^https?:\/\/.+/)) {
      toast.error('Please enter a valid image URL', {
        icon: '🖼️',
        style: { fontSize: '12px' }
      });
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        sub: formData.sub,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        icon: formData.icon,
        ribbon: formData.ribbon || null,
        ribbon_type: formData.ribbon_type || null,
        liked: formData.liked,
      };

      await axios.post(`${API_BASE_URL}/products/create/`, productData);
      
      toast.success('Product added successfully! 🎉', {
        duration: 2000,
        style: { fontSize: '12px' }
      });
      
      setFormData({
        name: '',
        sub: '',
        price: '',
        image: '',
        category: 'Cookies',
        icon: 'fas fa-cookie-bite',
        ribbon: '',
        ribbon_type: '',
        liked: false,
      });

      // Scroll to top after submission
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (onProductAdded) onProductAdded();
    } catch (error) {
      toast.error('Failed to add product 😔\nPlease try again', {
        duration: 3000,
        style: { fontSize: '12px' }
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
        }}
      />
      
      <div className="px-4 pt-5 pb-24">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#f6c54a] to-[#f4a800] rounded-full flex items-center justify-center text-[28px] mx-auto mb-3 shadow-[0_6px_24px_rgba(246,197,74,0.3)] active:scale-95 transition-transform">
            🧁
          </div>
          <h1 className="font-['Dancing_Script'] text-[28px] font-bold bg-gradient-to-r from-[#2f1a10] to-[#8b5e3c] bg-clip-text text-transparent leading-tight">
            Add New Product
          </h1>
          <p className="font-['Poppins'] text-[10px] text-[#9b8e8a] mt-1">
            Fill in the details to add a delicious treat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Product Name */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-[#2f1a10] mb-1.5 font-['Poppins'] uppercase tracking-wider">
              Product Name
              <span className="text-[#f4a6af]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-white border border-[#f0e3d7] text-[13px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] focus:ring-2 focus:ring-[#f6c54a]/20 transition placeholder:text-[#c4b5ab]"
              placeholder="e.g., Red Velvet Brookies"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-[#2f1a10] mb-1.5 font-['Poppins'] uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              name="sub"
              value={formData.sub}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-white border border-[#f0e3d7] text-[13px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] focus:ring-2 focus:ring-[#f6c54a]/20 transition placeholder:text-[#c4b5ab]"
              placeholder="e.g., Brownie + Cookie · 4 pcs"
            />
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-[#2f1a10] mb-1.5 font-['Poppins'] uppercase tracking-wider">
              Price (₹)
              <span className="text-[#f4a6af]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9b8e8a] font-['Poppins'] font-medium">₹</span>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-[16px] bg-white border border-[#f0e3d7] text-[13px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] focus:ring-2 focus:ring-[#f6c54a]/20 transition placeholder:text-[#c4b5ab]"
                placeholder="12.00"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-[#2f1a10] mb-1.5 font-['Poppins'] uppercase tracking-wider">
              Category
              <span className="text-[#f4a6af]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategoryChange(cat.label)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-[14px] text-[10px] font-['Poppins'] font-medium transition-all active:scale-95 ${
                    formData.category === cat.label
                      ? 'bg-[#fff3df] border border-[#f4a800] text-[#2f1a10] shadow-[0_2px_8px_rgba(244,168,0,0.15)]'
                      : 'bg-white border border-[#f0e3d7] text-[#9b8e8a] active:bg-[#fff8ed]'
                  }`}
                >
                  <i className={`${cat.icon} text-[13px]`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-[#2f1a10] mb-1.5 font-['Poppins'] uppercase tracking-wider">
              Image URL
              <span className="text-[#f4a6af]">*</span>
            </label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-white border border-[#f0e3d7] text-[13px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] focus:ring-2 focus:ring-[#f6c54a]/20 transition placeholder:text-[#c4b5ab]"
              placeholder="https://images.unsplash.com/photo-..."
            />
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-2 rounded-[16px] overflow-hidden border-2 border-[#f0e3d7] relative group">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-[180px] object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Image failed to load', { 
                      icon: '🖼️',
                      style: { fontSize: '12px' }
                    });
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-active:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-white text-[10px] font-['Poppins'] font-medium">
                    Image Preview
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ribbon/Badge Section */}
          <div className="bg-white rounded-[16px] p-3.5 border border-[#f0e3d7] space-y-3">
            <h3 className="text-[11px] font-semibold text-[#2f1a10] font-['Poppins'] flex items-center gap-1.5">
              <i className="fas fa-tag text-[#f6c54a] text-[11px]"></i>
              Product Badge (Optional)
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] font-semibold text-[#9b8e8a] mb-1 font-['Poppins'] uppercase">
                  Badge Text
                </label>
                <input
                  type="text"
                  name="ribbon"
                  value={formData.ribbon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-[12px] bg-[#fef9f3] border border-[#f0e3d7] text-[12px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] transition placeholder:text-[#c4b5ab]"
                  placeholder="e.g., ⭐ Best Seller"
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-[#9b8e8a] mb-1 font-['Poppins'] uppercase">
                  Badge Type
                </label>
                <select
                  name="ribbon_type"
                  value={formData.ribbon_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-[12px] bg-[#fef9f3] border border-[#f0e3d7] text-[12px] text-[#2f1a10] font-['Poppins'] focus:outline-none focus:border-[#f6c54a] transition"
                >
                  {RIBBON_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Liked Toggle */}
          <div className="flex items-center justify-between bg-white rounded-[16px] px-3.5 py-3 border border-[#f0e3d7] active:bg-[#fff8ed] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all ${
                formData.liked 
                  ? 'bg-[#f4a6af]/20 text-[#f4a6af]' 
                  : 'bg-[#f0e3d7]/30 text-[#d0c0b8]'
              }`}>
                <i className={`text-[15px] ${formData.liked ? 'fas fa-heart animate-pulse' : 'far fa-heart'}`}></i>
              </div>
              <div>
                <span className="text-[13px] font-medium text-[#2f1a10] font-['Poppins'] block">
                  Liked by default
                </span>
                <span className="text-[9px] text-[#9b8e8a] font-['Poppins']">
                  Heart icon will be filled
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, liked: !formData.liked })}
              className={`relative w-[46px] h-[26px] rounded-full transition-all duration-200 active:scale-95 ${
                formData.liked ? 'bg-[#f4a6af]' : 'bg-[#e0d5ce]'
              }`}
            >
              <div
                className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform duration-200 ${
                  formData.liked ? 'translate-x-[23px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>

          {/* Required Fields Note */}
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[#f4a6af] text-[10px]">*</span>
            <span className="text-[9px] text-[#9b8e8a] font-['Poppins']">
              Required fields
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#f6c54a] to-[#f4a800] text-[#2f1a10] py-3 rounded-[16px] font-['Poppins'] font-semibold text-[14px] mt-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_4px_16px_rgba(246,197,74,0.3)] relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding Product...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-plus-circle text-[15px]"></i>
                Add Product
              </span>
            )}
          </button>

          {/* Form Progress Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${formData.name ? 'bg-[#6dbb58]' : 'bg-[#e0d5ce]'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full ${formData.price ? 'bg-[#6dbb58]' : 'bg-[#e0d5ce]'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full ${formData.image ? 'bg-[#6dbb58]' : 'bg-[#e0d5ce]'}`}></div>
            <span className="text-[9px] text-[#9b8e8a] font-['Poppins'] ml-1">form progress</span>
          </div>
        </form>
      </div>

      {/* Custom Styles */}
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239b8e8a' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
        }
        
        button {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductForm;