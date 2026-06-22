const CategoryCard = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-[78px] h-[78px] rounded-[22px] flex flex-col items-center justify-center gap-[5px] cursor-pointer border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(47,26,16,0.1)] ${
        active
          ? 'border-[#f4a800] bg-[#fff3df]'
          : 'border-transparent bg-[#f5d6a9]'
      }`}
    >
      <div
        className={`text-[26px] w-[38px] h-[38px] flex items-center justify-center rounded-[14px] ${
          active
            ? 'bg-[#f6c54a] text-[#2f1a10]'
            : 'bg-[rgba(246,197,74,0.25)] text-[#2f1a10]'
        }`}
      >
        <i className={icon}></i>
      </div>
      <span
        className={`text-[9px] font-semibold whitespace-nowrap font-['Poppins'] ${
          active ? 'text-[#2f1a10] font-bold opacity-100' : 'text-[#2f1a10] opacity-80'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default CategoryCard;