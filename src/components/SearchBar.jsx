const SearchBar = () => {
  return (
    <div
      id="searchContainer"
      className="flex items-center justify-start mt-6 relative border-y border-gray-300"
    >
      <input
        type="text"
        id="searchBox"
        className="outline-none ring-0 border-none w-[720px] h-14 pl-8 focus:ring-0"
        placeholder="Search..."
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
