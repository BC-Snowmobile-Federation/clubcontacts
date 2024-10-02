import { googleLogout } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clear } from '../../redux/slice';
import { useEffect, useRef, useState } from 'react';

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
  // eslint-disable-next-line
  setBtnId,
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  function handleChangeSection(id) {
    if (isEditing) {
      // before we showed a modal asking if we wanted to save changes
      // uncomment this 2 lines of code to add back the functionality
      // setShowModal(true);
      // setBtnId(id);
      setActiveButton(id);
    } else {
      setActiveButton(id);
    }
  }

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    localStorage.setItem('userEmail', null);
    localStorage.setItem('userInfo', null);
    dispatch(clear());
    navigate('/');
  };

  let user = JSON.parse(localStorage.getItem('userEmail'));
  let activeUser = user.email;
  let name = user.name;

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
      id: 'clubsProfile',
      iconPath:
        'M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z', // Add your SVG path data
      label: 'Club Profile',
      enabled: true,
      divId: 'clubProfilesDiv',
    },
    {
      id: 'clubs',
      iconPath:
        'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', // Add your SVG path data
      label: 'Club Directors',
      enabled: true,
      divId: 'clubsDiv',
    },
    {
      id: 'historical',
      iconPath:
        'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', // Add your SVG path data
      label: 'History',
      enabled: true,
      divId: 'historicalDiv',
    },
  ];

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
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
              <span className="font-semibold"> {name}</span>
            </h2>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul
                  id="buttonsContainer"
                  role="list"
                  className="-mx-2 space-y-1"
                >
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
                      ? 'bg-[#2D4080] text-white'
                      : 'bg-transparent'
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
                    onClick={logOut}
                    className="bg-[#324280] hover:bg-[#2D4080] transition-all h-10 text-white hover:text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-[240px] relative"
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
      {/* Bottom Menu for Smaller Screens */}
      <div className="flex fixed inset-x-0 bottom-0 bg-[#243570] p-2 justify-around items-center z-50 md:hidden">
        {buttonData.slice(0, 3).map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleChangeSection(btn.id)}
            className={`text-white p-3 rounded-full hover:bg-[#2D4080] ${
              activeButton === btn.id ? 'bg-[#2D4080]' : ''
            }`}
          >
            {renderSvgIcon(btn.iconPath)}
          </button>
        ))}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="text-white p-3 rounded-full hover:bg-[#2D4080]"
        >
          {renderSvgIcon(
            'M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
          )}
        </button>
        {isProfileMenuOpen && (
          <div
            ref={profileMenuRef}
            className="absolute bottom-16 right-2 bg-white rounded-md shadow-lg border mb-2"
          >
            <p className="text-sm text-gray-800 text-medium rounded-md px-4 py-2 m-1 hover:bg-gray-100">
              {name}
            </p>
            <p className="text-xs text-gray-800 rounded-md px-4 py-2 m-1 hover:bg-gray-100">
              {activeUser}
            </p>
            <button
              onClick={logOut}
              className="flex justify-end gap-1 mt-2 w-full border-t p-2 text-sm hover:bg-gray-100 text-right text-red-600"
            >
              Logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
