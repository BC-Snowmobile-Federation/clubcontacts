import { useState } from "react";
import { useSelector } from "react-redux";
import "./Arrow.css";

const MainContent = ({
  // eslint-disable-next-line
  handleRoleChange,
  // eslint-disable-next-line
  selectedRole,
  // eslint-disable-next-line
  handleClubChange,
  // eslint-disable-next-line
  selectedClub,
  // eslint-disable-next-line
  handleStatusChange,
  // eslint-disable-next-line
  selectedStatus,
  // eslint-disable-next-line
  handleAmiliaChange,
  // eslint-disable-next-line
  selectedAmilia,
  // eslint-disable-next-line
  uniqueRoleValues,
  // eslint-disable-next-line
  uniqueClubValues,
  // eslint-disable-next-line
  uniqueStatusValues,
  // eslint-disable-next-line
  uniqueAmiliaValues,
  setCurrentPage
}) => {
  let isBcsf = JSON.parse(localStorage.getItem("isBcsf"));

  // eslint-disable-next-line
  const [roleOptions, setRoleOptions] = useState(["All", ...uniqueRoleValues]);
  // eslint-disable-next-line
  const [clubOptions, setClubOptions] = useState(["All", ...uniqueClubValues]);
  // eslint-disable-next-line
  const [statusOptions, setStatusOptions] = useState([
    "All",
    ...uniqueStatusValues,
  ]);
  // eslint-disable-next-line
  const [amiliaOptions, setAmiliaOptions] = useState([
    "All",
    ...uniqueAmiliaValues,
  ]);

  const onRoleChange = (e) => {
    const newRole = e.target.value;
    handleRoleChange(newRole);
    setCurrentPage(1)
  };

  const onClubChange = (e) => {
    const newClub = e.target.value;
    handleClubChange(newClub);
    setCurrentPage(1)
  };

  const onStatusChange = (e) => {
    const newStatus = e.target.value;
    handleStatusChange(newStatus);
    setCurrentPage(1)
  };

  const onAmiliaChange = (e) => {
    const newAmilia = e.target.value;
    handleAmiliaChange(newAmilia);
    setCurrentPage(1)
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-transparent rounded-full w-[720px] mb-6 h-10 items-center flex justify-around">
        <div className="svg-container flex h-10 items-center mt-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#4F5664"
            className="w-6 h-6 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isBcsf && (
          <div className="mt-4">
            <label className="text-sm font-semibold">Club</label>
            <select
              id="historicalClubSelect"
              className="px-4 rounded-full bg-slate-200 border-0 arrowSelect appearance-none pr-8 focus:outline-none focus:border-none text-sm"
              value={selectedClub}
              onChange={onClubChange}
            >
              <option value="" disabled>
                Club
              </option>
              {clubOptions.map((club, index) => (
                <option key={index} value={club === "All" ? "All" : club}>
                  {club}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-4 ml-2">
          <label className="text-sm font-semibold">Role</label>
          <select
            id="roleSelect"
            className="px-4 rounded-full bg-slate-200 border-0 arrowSelect appearance-none pr-8 focus:outline-none focus:border-none text-sm"
            value={selectedRole}
            onChange={onRoleChange}
          >
            <option value="" disabled>
              Role
            </option>
            {roleOptions.map((role, index) => (
              <option key={index} value={role === "All" ? "All" : role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 ml-2">
          <label className="text-sm font-semibold">Status</label>
          <select
            id="statusSelect"
            className="px-4 rounded-full bg-slate-200 arrowSelect border-0 appearance-none pr-8 focus:outline-none focus:border-none text-sm"
            value={selectedStatus}
            onChange={onStatusChange}
          >
            <option value="" disabled>
              Status
            </option>
            {statusOptions.map((status, index) => (
              <option key={index} value={status === "All" ? "All" : status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 ml-2">
          <label className="text-sm font-semibold">Amilia</label>
          <select
            id="amiliaSelect"
            className="px-4 rounded-full bg-slate-200 arrowSelect border-0 appearance-none pr-8 focus:outline-none focus:border-none text-sm"
            value={selectedAmilia}
            onChange={onAmiliaChange}
          >
            <option value="" disabled>
              Amilia
            </option>
            {amiliaOptions.map((amilia, index) => (
              <option key={index} value={amilia === "All" ? "All" : amilia}>
                {amilia}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

export default MainContent;
