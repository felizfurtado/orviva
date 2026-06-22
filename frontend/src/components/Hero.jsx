import logo from '../assets/logo.jpeg';

const Hero = () => {
  return (
    <div className="relative h-[340px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://i.pinimg.com/736x/0c/2f/dd/0c2fdd41b9a5513e5ac3af2ff7eb6d3d.jpg")`,
          backgroundPosition: 'center 30%'
        }}
      />
      <div className="absolute inset-0 hero-overlay z-[1]" />
      <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255, 214, 107, 0.45) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-[-1px] left-0 right-0 h-8 hero-wave z-[3]" />

      {/* Top buttons */}
      <div className="absolute top-5 right-5 flex items-center justify-end z-[5]">
        <button
          className="w-[42px] h-[42px] rounded-full bg-white/90 backdrop-blur-[10px] border-none flex items-center justify-center cursor-pointer text-[17px] text-[#2f1a10] flex-shrink-0 hover:scale-110 transition-transform relative"
          onClick={() => alert('You have 3 new notifications! 🎂')}
        >
          <i className="fas fa-bell"></i>
          <span className="absolute top-[-3px] right-[-3px] w-[18px] h-[18px] bg-[#ff4757] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse-slow shadow-[0_2px_8px_rgba(255,71,87,0.3)]">
            3
          </span>
        </button>
      </div>

      {/* Logo section */}
      <div className="absolute bottom-[70px] left-1/2 -translate-x-1/2 z-[4] text-center w-[85%]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-[65px] h-[65px] bg-white/15 backdrop-blur-[15px] rounded-full flex items-center justify-center text-[32px] text-[#ffd66b] border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-[5px] animate-logo-float overflow-hidden">
            <img src={logo} alt="She Who Bakes Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-[6px]">
            <div className="brand-gradient font-['Dancing_Script'] text-[38px] font-bold leading-tight">
              She Who Bakes
            </div>
            <div className="flex items-center gap-[10px] w-[70%]">
              <span className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
              <i className="fas fa-heart text-[#f7b3bc] text-[10px] animate-heart-beat"></i>
              <span className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
            </div>
            <div className="font-['Poppins'] text-[11px] font-medium text-white/90 tracking-[3px] uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
              handcrafted with love
            </div>
          </div>
        </div>
        <div className="flex gap-[10px] justify-center mt-[10px]">
          <span className="bg-white/20 backdrop-blur-[10px] border border-white/30 text-white text-[9px] font-semibold px-3 py-1 rounded-[20px] tracking-[0.5px] font-['Poppins'] flex items-center gap-1 hover:bg-white/30 hover:-translate-y-0.5 transition-all cursor-pointer">
            <i className="fas fa-star text-[#ffd66b] text-[8px]"></i> Artisan
          </span>
          <span className="bg-white/20 backdrop-blur-[10px] border border-white/30 text-white text-[9px] font-semibold px-3 py-1 rounded-[20px] tracking-[0.5px] font-['Poppins'] flex items-center gap-1 hover:bg-white/30 hover:-translate-y-0.5 transition-all cursor-pointer">
            <i className="fas fa-leaf text-[#ffd66b] text-[8px]"></i> Fresh Daily
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;