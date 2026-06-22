import { useState } from 'react';

const ProductCard = ({ product, index }) => {
  const [liked, setLiked] = useState(product.liked || false);
  const [pop, setPop] = useState(false);

  const handleFavClick = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setPop(true);
    setTimeout(() => setPop(false), 320);
  };

  const handleCardClick = () => {
    window.location.href = '/desc';
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    window.location.href = '/desc';
  };

  const delayMap = {
    0: '0.06s',
    1: '0.13s',
    2: '0.2s',
    3: '0.27s',
    4: '0.34s',
    5: '0.41s',
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-[26px] p-3.5 pt-3.5 product-card-shadow cursor-pointer transition-all duration-[220ms] relative border border-[#f0e3d7] opacity-0 animate-fade-up hover:shadow-[0_14px_34px_rgba(47,26,16,0.12)] active:shadow-[0_14px_34px_rgba(47,26,16,0.12)] active:-translate-y-1 active:scale-[1.01]"
      style={{ animationDelay: delayMap[index] || '0.06s' }}
    >
      {product.ribbon && (
        <div
          className={`absolute top-3 left-3 text-[8px] font-bold tracking-[0.8px] uppercase px-2.5 py-0.5 rounded-xl z-[2] font-['Poppins'] ${
            product.ribbonType === 'new'
              ? 'bg-[#f4a6af] text-white'
              : 'bg-[#f6c54a] text-[#2f1a10]'
          }`}
        >
          {product.ribbon}
        </div>
      )}

      <button
        onClick={handleFavClick}
        className={`absolute top-[13px] right-[13px] w-[30px] h-[30px] rounded-full bg-white/95 border-none flex items-center justify-center cursor-pointer text-sm transition-transform z-[2] hover:scale-125 ${
          liked ? 'text-[#f4a6af]' : 'text-[#d0c0b8]'
        } ${pop ? 'animate-heart-pop' : ''}`}
      >
        <i className={liked ? 'fas fa-heart' : 'far fa-heart'}></i>
      </button>

      <div className="w-full h-[150px] flex items-center justify-center mb-2.5 mt-2.5 rounded-[18px] overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover block"
        />
      </div>

      <div className="font-['Baloo_2'] text-[15px] text-[#2f1a10] leading-tight min-h-[37px] font-bold">
        {product.name}
      </div>
      <div className="text-[10px] text-[#9b8e8a] mt-[3px] font-medium font-['Poppins']">
        {product.sub}
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-base font-bold text-[#2f1a10] font-['Baloo_2']">
          ₹{product.price}
        </span>
        <button
          onClick={handleViewClick}
          className="w-7 h-7 rounded-full bg-[#2f1a10] border-none text-white text-sm flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[#3d2417] hover:scale-110"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;