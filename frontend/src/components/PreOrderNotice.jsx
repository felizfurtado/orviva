const PreOrderNotice = () => {
  return (
    <div className="bg-white/95 backdrop-blur-[4px] mx-[18px] mt-4 p-3 px-4 rounded-[20px] flex items-center gap-3 border border-dashed border-[#f4a800] shadow-[0_4px_12px_rgba(244,168,0,0.1)] relative z-10 bg-[#fff3df]/95">
      <div className="text-[22px] text-[#f4a800] bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
        <i className="fas fa-clock"></i>
      </div>
      <div className="flex-1">
        <strong className="font-['Baloo_2'] text-[15px] text-[#2f1a10] block leading-tight">
          Order 1 Day in Advance
        </strong>
        <span className="text-[11px] text-[#7b6e66] font-medium">
          We bake fresh after you order · Not instant
        </span>
      </div>
    </div>
  );
};

export default PreOrderNotice;