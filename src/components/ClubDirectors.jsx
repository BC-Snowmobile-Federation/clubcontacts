import { useState } from "react";

const groupDataById = (data) => {
  return data.reduce((groups, item) => {
    const id = item[3];
    if (!groups[id]) {
      groups[id] = [];
    }
    groups[id].push(item);
    return groups;
  }, {});
};

// eslint-disable-next-line
const MemberDetail = ({ dtValue, member, index, clubName, isManager }) => {
  return (
    <dl className="divide-y divide-gray-500 montserrat">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-[8rem] sm:px-0">
        <div className="sm:grid sm:grid-cols-3 sm:gap-[8rem] items-center">
          <dt
            className="text-sm font-medium leading-6 text-gray-900 whitespace-nowrap sm:col-start-1 ml-[25px] text-left"
            data-dthtml-value={dtValue}
          >
            {dtValue}
          </dt>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:gap-[8rem]">
          {member ? (
            <dd
              id={`${clubName}-${dtValue}-${index}`}
              data-value={`${member[0]} ${member[1]}`}
              data-index={index}
              className="text-sm leading-6 text-gray-900 whitespace-nowrap sm:col-start-3 text-right flex justify-end"
            >
              {member[0]} {member[1]}
            </dd>
          ) : (
            <dd
              id={`${clubName}-${dtValue}-${index}`}
              data-index={index}
              className="text-sm leading-6 whitespace-nowrap text-gray-700 sm:col-start-3 text-right flex justify-end"
            ></dd>
          )}
        </div>
        {isManager && member && <button>{/* Your SVG here */}</button>}
      </div>
    </dl>
  );
};
// eslint-disable-next-line
const MemberCard = ({ clubData, isManager }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dtValues = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Past President",
    "Membership Director",
    "Director at Large",
    "Other",
  ];

  const clubName = clubData[0][3]; // Assuming clubName is at index 3
  // eslint-disable-next-line
  const activeMembers = clubData.filter((el) => el[8] === "Active");

  const membersJSX = dtValues.map((dtValue, dtIndex) => {
    if (dtValue === "Director at Large" || dtValue === "Other") {
      const membersWithRole = activeMembers.filter(
        (item) => item[7] === dtValue
      );

      // If there are no active members with the role, add a null member to ensure the dtValue is shown
      if (membersWithRole.length === 0) {
        membersWithRole.push(null);
      }

      return membersWithRole.map((member, memberIndex) => (
        <MemberDetail
          key={dtIndex}
          dtValue={dtValue}
          member={member}
          index={dtIndex + memberIndex}
          clubName={clubName}
          isManager={isManager}
        />
      ));
    } else {
      const member = activeMembers.find((item) => item[7] === dtValue);
      return (
        <MemberDetail
          key={dtIndex}
          dtValue={dtValue}
          member={member || null}
          index={dtIndex}
          clubName={clubName}
          isManager={isManager}
        />
      );
    }
  });

  return (
    <div className="mt-8 w-[500px] rounded-xl shadow-2xl border">
      <div className="flex text-xl justify-between px-4 py-5 bg-gray-200 rounded-t-xl">
        <h2 className="font-semibold">{clubName}</h2>
        {isEditing ? (
          <>
            <button className="add-director-button right-0 bg-transparent">
              <p className="font-semibold text-base text-[#535787] cursor-pointer">
                Add Director
              </p>
            </button>
            <button className="save-button -ml-6 right-0 bg-transparent">
              <p className="font-semibold text-base text-[#535787] cursor-pointer">
                Save
              </p>
            </button>
          </>
        ) : (
          isManager === "MANAGER" && (
            <button
              className="edit-button right-0 bg-transparent"
              onClick={() => setIsEditing(true)}
            >
              <p className="font-semibold text-base text-[#535787] cursor-pointer">
                Edit
              </p>
            </button>
          )
        )}
      </div>
      {membersJSX}
    </div>
  );
};
// eslint-disable-next-line
const ClubDirectors = ({ isManager, data, isBcsf, uniqueClubValues }) => {
  const groups = groupDataById(data);
  console.log(groups);
  const [selectedClub, setSelectedClub] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  return (
    <div className="flex-col flex items-center justify-center">
      {isBcsf ? (
        <>
          <div className="flex items-center justify-center">
            <div className="relative bg-transparent border-slate-100 border rounded-full w-[250px] h-10 items-center flex justify-around">
              <input
                id="clubSearch"
                className="pl-8 px-4 rounded-full bg-transparent appearance-none pr-8 focus:outline-none focus:border-none text-sm w-full"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#4F5664"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div className="bg-slate-100 rounded-full w-[250px] h-10 ml-2 items-center flex justify-around">
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
              <select
                id="clubSelect"
                className="px-2 rounded-full bg-transparent appearance-none border-0 pr-8 focus:outline-none focus:ring-0 focus:border-none text-sm"
                onChange={handleClubChange}
              >
                <option value="">All Clubs</option>
                {/* eslint-disable-next-line */}
                {uniqueClubValues.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            id="container"
            className="flex-col mt-4 justify-center items-center"
          >
            {Object.entries(groups)
              // eslint-disable-next-line
              .filter(([clubName, clubData]) => {
                if (searchTerm) {
                  return clubName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
                return !selectedClub || clubName === selectedClub;
              })
              // eslint-disable-next-line
              .map(([clubName, clubData], index) => (
                <MemberCard
                  key={index}
                  clubData={clubData}
                  isManager={isManager}
                />
              ))}
          </div>
        </>
      ) : (
        <div
          id="container"
          className="flex-col mt-12 justify-center items-center"
        >
          {Object.values(groups).map((clubData, index) => (
            <MemberCard key={index} clubData={clubData} isManager={isManager} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubDirectors;
