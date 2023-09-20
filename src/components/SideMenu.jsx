import { useSelector } from "react-redux";

const SideMenu = ({
  // eslint-disable-next-line
  activeButton,
  // eslint-disable-next-line
  setActiveButton,
  // eslint-disable-next-line
  isEditing,
  // eslint-disable-next-line
  setIsEditing,
  // eslint-disable-next-line
  setShowModal,
  setBtnId
}) => {
  let { clubName, activeUser } = useSelector((state) => state.reducer);

  function handleChangeSection(id) {
    if (isEditing) {
      setShowModal(true)
      setBtnId(id)
    } else {
      setActiveButton(id); // <-- Make sure to change the section even if isEditing is false
    }
  }

  clubName = "British Columbia Snowmobile Federation";
  activeUser = "administrator@bcsf.org";

  const renderSvgIcon = (pathData) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
      >
        <path d={pathData} />
      </svg>
    );
  };

  const buttonData = [
    {
      id: "clubsProfile",
      iconPath:
        "M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z", // Add your SVG path data
      label: "Club Profile",
      enabled: true,
      divId: "clubProfilesDiv",
    },
    {
      id: "clubs",
      iconPath:
        "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z", // Add your SVG path data
      label: "Club Directors",
      enabled: true,
      divId: "clubsDiv",
    },
    {
      id: "historical",
      iconPath:
        "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z", // Add your SVG path data
      label: "History",
      enabled: true,
      divId: "historicalDiv",
    },
  ];

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
              <ul id="buttonsContainer" role="list" className="-mx-2 space-y-1">
                {buttonData.map((btn) => (
                  <li key={btn.id}>
                    <button
                      id={btn.id}
                      type="button"
                      disabled={!btn.enabled}
                      onClick={() => handleChangeSection(btn.id)}
                      className={`text-indigo-200 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-[240px] hover:bg-[#2D4080] 
                  ${
                    activeButton === btn.id
                      ? "bg-[#2D4080] text-white"
                      : "bg-transparent"
                  }`}
                    >
                      {renderSvgIcon(btn.iconPath)}
                      {btn.label}
                    </button>
                  </li>
                ))}
              </ul>
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
