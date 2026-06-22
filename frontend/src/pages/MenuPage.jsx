import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import PreOrderNotice from '../components/PreOrderNotice';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import SeasonalNote from '../components/SeasonalNote';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [cupcakes, setCupcakes] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [cheesecakes, setCheesecakes] = useState([]);
  const [dessertCups, setDessertCups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://tenant1.localhost:8000/api/menu/');
      const data = await response.json();
      
      setCategories(data.categories);
      setCookies(data.cookies || []);
      setCupcakes(data.cupcakes || []);
      setCakes(data.cakes || []);
      setCheesecakes(data.cheesecakes || []);
      setDessertCups(data.dessert_cups || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-[390px] min-h-screen bg-[#fff8f3] rounded-[45px] overflow-hidden relative shadow-[0_32px_80px_rgba(47,26,16,0.12)] my-6 mx-auto z-[1] max-[420px]:w-screen max-[420px]:rounded-none max-[420px]:m-0 flex items-center justify-center">
        <div className="text-[#2f1a10] font-['Baloo_2'] text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[390px] min-h-screen bg-[#fff8f3] rounded-[45px] overflow-hidden relative shadow-[0_32px_80px_rgba(47,26,16,0.12)] my-6 mx-auto z-[1] max-[420px]:w-screen max-[420px]:rounded-none max-[420px]:m-0 flex items-center justify-center">
        <div className="text-red-600 font-['Baloo_2'] text-xl text-center p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-[390px] min-h-screen bg-[#fff8f3] rounded-[45px] overflow-hidden relative shadow-[0_32px_80px_rgba(47,26,16,0.12)] my-6 mx-auto z-[1] max-[420px]:w-screen max-[420px]:rounded-none max-[420px]:m-0">
      <Hero />
      <SearchBar />
      <PreOrderNotice />

      <div className="p-[18px] pb-[110px]">
        <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[5px] font-bold tracking-[-0.2px]">
          Our Menu
        </div>

        {/* Categories */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-hide">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              icon={cat.icon}
              label={cat.label}
              active={activeCategory === index}
              onClick={() => setActiveCategory(index)}
            />
          ))}
        </div>

        {/* Cookies Section */}
        {cookies.length > 0 && (
          <>
            <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[18px] font-bold tracking-[-0.2px]">
              🍪 Cookies
            </div>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px]">
              {cookies.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Cupcakes Section */}
        {cupcakes.length > 0 && (
          <>
            <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[18px] font-bold tracking-[-0.2px]">
              🧁 Cupcakes
            </div>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px]">
              {cupcakes.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Cakes Section */}
        {cakes.length > 0 && (
          <>
            <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[18px] font-bold tracking-[-0.2px]">
              🎂 Cakes
            </div>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px]">
              {cakes.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Cheesecakes Section */}
        {cheesecakes.length > 0 && (
          <>
            <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[18px] font-bold tracking-[-0.2px]">
              🧀 Cheesecakes
            </div>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px]">
              {cheesecakes.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Dessert Cups Section */}
        {dessertCups.length > 0 && (
          <>
            <div className="font-['Baloo_2'] text-[19px] text-[#2f1a10] mb-[7px] mt-[18px] font-bold tracking-[-0.2px]">
              🍷 Dessert Cups
            </div>
            <div className="grid grid-cols-2 gap-[14px] mt-[6px]">
              {dessertCups.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        <SeasonalNote />
      </div>
    </div>
  );
};

export default MenuPage;