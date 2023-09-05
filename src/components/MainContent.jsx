import { useSelector } from "react-redux";

const MainContent = () => {
  let { isBcsf } = useSelector((state) => state.reducer);

  isBcsf = true;

  return (
    <div className="flex items-center justify-center">
      <div className="bg-slate-100 rounded-full w-[720px] h-10 items-center flex justify-around">
        <div className="svg-container flex h-10 items-center ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#4F5664"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isBcsf && (
          <select id="historicalClubSelect" className="...">
            {/* ...options */}
          </select>
        )}

        <select id="roleSelect" className="...">
          {/* ...options */}
        </select>

        <select id="statusSelect" className="...">
          {/* ...options */}
        </select>

        <select id="amiliaSelect" className="...">
          {/* ...options */}
        </select>
      </div>
    </div>
  );
};

export default MainContent;
