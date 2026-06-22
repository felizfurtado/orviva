import { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      alert('Searching for: ' + query);
    } else {
      alert('Please enter a search term.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative z-10 -mt-9 px-5">
      <div className="bg-white rounded-[30px] p-1.5 pl-5 flex items-center gap-2 search-shadow border-[1.5px] border-[#f0e3d7] transition-all duration-300 focus-within:border-[#f4a800] focus-within:shadow-[0_12px_35px_rgba(244,168,0,0.2)] focus-within:-translate-y-px">
        <span className="text-[#e9c79b] text-base flex-shrink-0">
          <i className="fas fa-search"></i>
        </span>
        <input
          type="text"
          placeholder="Search our delicious menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-none outline-none font-['Poppins'] text-sm text-[#2f1a10] w-full bg-transparent py-2.5 placeholder:text-[#9b8e8a] placeholder:font-normal"
        />
        <button
          onClick={handleSearch}
          className="w-[42px] h-[42px] rounded-full bg-[#f6c54a] border-none text-[#2f1a10] text-base flex items-center justify-center cursor-pointer flex-shrink-0 shadow-[0_4px_12px_rgba(246,197,74,0.3)] hover:bg-[#f4a800] hover:text-white hover:scale-105 hover:shadow-[0_6px_18px_rgba(244,168,0,0.4)] active:scale-95 transition-all"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;