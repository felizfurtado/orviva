import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-[#fef9f3]">
      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0e3d7] z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
              activeTab === 'view'
                ? 'text-[#2f1a10]'
                : 'text-[#9b8e8a]'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              activeTab === 'view'
                ? 'bg-[#f6c54a] text-[#2f1a10]'
                : 'bg-transparent'
            }`}>
              <i className="fas fa-box"></i>
            </div>
            <span className="text-[10px] font-semibold font-['Poppins']">View</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
              activeTab === 'add'
                ? 'text-[#2f1a10]'
                : 'text-[#9b8e8a]'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              activeTab === 'add'
                ? 'bg-[#f6c54a] text-[#2f1a10]'
                : 'bg-transparent'
            }`}>
              <i className="fas fa-plus"></i>
            </div>
            <span className="text-[10px] font-semibold font-['Poppins']">Add</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === 'add' ? (
          <ProductForm onProductAdded={handleProductAdded} />
        ) : (
          <ProductList key={refreshKey} />
        )}
      </div>
    </div>
  );
};

export default AdminPage;