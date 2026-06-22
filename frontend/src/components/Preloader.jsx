import { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';

const Preloader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-[#fff8f3] flex flex-col items-center justify-center z-[9999] transition-opacity duration-500 ${
        hidden ? 'preloader-hidden' : ''
      }`}
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mb-5 animate-preloader-bounce">
        <img src={logo} alt="She Who Bakes Logo" className="w-full h-full object-cover" />
      </div>
      <div className="w-10 h-10 border-[3px] border-[#f5d6a9] border-t-[#f4a800] rounded-full animate-spin-slow mb-4"></div>
      <div className="font-['Dancing_Script'] text-2xl text-[#2f1a10] font-bold">
        She Who Bakes
      </div>
    </div>
  );
};

export default Preloader;