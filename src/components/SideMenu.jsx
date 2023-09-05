import { useSelector } from "react-redux";

const SideMenu = () => {
  let { clubName, activeUser } = useSelector(
    (state) => state.reducer
  );

  clubName = "British Columbia Snowmobile Federation";
  activeUser = "mora@setandforget.io";

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#243570] px-6 pb-4">
        <div className="flex h-16 mt-12 shrink-0 items-center justify-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/628806f87107170399d7b906/daf273e4-d504-4ffd-b5e0-f6c9a9764259/BCSF+Logo+RGB.png?format=1500w"
            alt="BCSF"
            className="w-32 h-24"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <h2 className="montserrat text-xl font-medium text-white">
            Welcome 
            <span className="font-semibold"> {clubName}</span>
          </h2>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul
                id="buttonsContainer"
                role="list"
                className="-mx-2 space-y-1"
              ></ul>
            </li>

            <div className="bottom-4 fixed">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>

              <li className="flex mt-4 montserrat">
                <button
                  type="button"
                  disabled
                  className="text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-[240px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#FFFFFF"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {activeUser}
                </button>
              </li>

              <li className="flex montserrat">
                <button
                  type="button"
                  id="logout"
                  className="bg-[#EF3741] h-10 text-white hover:text-white hover:bg-[#F37164] group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-[240px] relative"
                >
                  <div
                    id="logout-content"
                    className="flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 text-white group-hover:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    <span className="ml-2">Logout</span>
                  </div>
                </button>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideMenu;
