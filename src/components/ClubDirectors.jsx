import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditDirectorModal from "./EditDirectorModal";
import SaveChangesModal from "./SaveChangesModal";

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
const AddDirectorModal = ({ handleCloseModal, submitAddDirector, data }) => {
  // Using refs to easily access the DOM elements without triggering renders
  const memberNameRef = useRef(null);
  const memberLastNameRef = useRef(null);
  const memberEmailRef = useRef(null);
  const memberPhoneNumberRef = useRef(null);
  const genderRef = useRef(null);
  const memberBirthdateRef = useRef(null);
  const memberRoleRef = useRef(null);
  const ameliaAdminRef = useRef(null);
  const managerAccessRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [shouldPost, setShouldPost] = useState(false);
  const [clubName, setClubName] = useState("");
  const [hasManager, setHasManager] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const inputRefs = [
      memberNameRef,
      memberLastNameRef,
      memberEmailRef,
      memberPhoneNumberRef,
      genderRef,
      memberBirthdateRef,
      memberRoleRef,
      ameliaAdminRef,
      managerAccessRef,
    ];

    let newErrorMessages = {};
    let hasErrors = false;

    for (let i = 0; i < inputRefs.length; i++) {
      const element = inputRefs[i]?.current;

      if (!element) continue;

      if (element == null) {
        if (!startDate) {
          newErrorMessages["Effective date"] = "Effective date is required";
          hasErrors = true;
        }
        continue;
      }

      if (
        element.tagName.toLowerCase() === "select" &&
        element.selectedIndex === 0
      ) {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      } else if (element.type !== "checkbox" && element.value.trim() === "") {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      }

      // Check for phone number format validation
      if (
        element.name === "Phone number" ||
        element.id === "phoneNumberInput"
      ) {
        // Adjust the condition as per the name or id of your phone number input
        const phoneNumberPattern = /^\(\d{3}\)\d{3}-\d{4}$/; // Regex pattern for (xxx)yyy-zzzz
        if (!phoneNumberPattern.test(element.value)) {
          newErrorMessages[element.name] =
            "Phone number format should be (xxx)yyy-zzzz";
          hasErrors = true;
        }
      }
    }

    if (!dateSelected && startDate == null) {
      newErrorMessages["Effective date"] = "Effective date is required";
      hasErrors = true;
    }

    setErrorMessages(newErrorMessages);

    if (hasErrors) return;

    const formData = inputRefs
      .map((ref) => {
        const element = ref.current;

        if (!element) return null;

        if (element instanceof HTMLElement) {
          return element.type === "checkbox" ? element.checked : element.value;
        } else {
          return startDate;
        }
      })
      .filter((data) => data !== null);

    const localHasManager = formData.pop();
    const localMemberData = formData;
    localMemberData.splice(5, 0, startDate);
    localMemberData.splice(7, 0, "Active");

    setClubName(submitAddDirector());
    setHasManager(localHasManager);
    setMemberData(localMemberData);

    setActiveSaveButton(true);
    if (isLoading) return;
    setShouldPost(true);
  };

  const postDirectorData = async (clubName, memberData, hasManager) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec"; // Your URL here

    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        action: "addMemberToSheet",
        memberData: memberData,
        clubName: clubName,
        hasManager: hasManager,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options);
    // const responseData = await response.json();
    // return response;
  };

  useEffect(() => {
    if (shouldPost && !isLoading) {
      const addDirector = async () => {
        setIsLoading(true);
        await postDirectorData(clubName, memberData, hasManager);
        dispatch(fetchData());
        setShouldPost(false); // Reset the flag after making the API call
        setIsLoading(false);
      };
      addDirector();
    }
  }, [shouldPost, clubName, memberData, hasManager, data, isLoading, dispatch]);

  const [phone, setPhone] = useState("");

  const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, "");
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue;
      if (cvLength < 7)
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
        3,
        6
      )}-${currentValue.slice(6, 10)}`;
    }
  };

  const handleFormatNumber = (e) => {
    const value = e.target.value;
    setPhone((prevPhone) => normalizeInput(value, prevPhone));
  };

  return (
    <div
      id="addMemberModal"
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              <h3
                className=" font-semibold lg:text-sm leading-6 text-gray-900"
                id="modal-title"
              >
                Add Director
              </h3>
              <p>Complete this fields to add new director.</p>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Name{" "}
              </label>
              <input
                ref={memberNameRef}
                name="Name"
                id="memberName"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert name"
              />
              <span className="text-red-500">{errorMessages["Name"]}</span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Last Name{" "}
              </label>
              <input
                ref={memberLastNameRef}
                name="Last Name"
                id="memberLastName"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert last name"
              />
              <span className="text-red-500">{errorMessages["Last Name"]}</span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Email
              </label>
              <input
                ref={memberEmailRef}
                name="Email"
                id="memberEmail"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert email"
              />
              <span className="text-red-500">{errorMessages["Email"]}</span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Phone Number{" "}
              </label>
              <input
                ref={memberPhoneNumberRef}
                name="Phone number"
                id="memberPhoneNumber"
                type="text"
                value={phone}
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="(xxx) xxx-xxxx"
                onChange={handleFormatNumber}
              />
              <span className="text-red-500">
                {errorMessages["Phone number"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  lg:text-sm">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Gender{" "}
              </label>
              <select
                ref={genderRef}
                id="gender"
                name="Gender"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
              >
                <option value="" disabled selected>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span className="text-red-500">{errorMessages["Gender"]}</span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Effective Date
              </label>
              <DatePicker
                name="Effective date"
                id="memberBirthdate"
                customInput={<input ref={memberBirthdateRef} />}
                type="text"
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setDateSelected(!!date);
                }}
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
                placeholderText="Insert effective date"
              />
              <span className="text-red-500">
                {errorMessages["Effective date"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Role{" "}
              </label>
              <select
                ref={memberRoleRef}
                name="Role"
                id="memberRole"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
              >
                <option value="" disabled selected>
                  Select role
                </option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Past President">Past President</option>
                <option value="Membership Director">Membership Director</option>
                <option value="Director at Large">Director at Large</option>
                <option value="Other">Other</option>
              </select>
              <span className="text-red-500">{errorMessages["Role"]}</span>
            </div>

            <div className="flex mt-4 flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    ref={ameliaAdminRef}
                    id="ameliaAdmin"
                    name="Is Amilia admin"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-red-500">
                    {errorMessages["Is Amilia admin"]}
                  </span>
                </div>
                <div className="text-sm leading-6">
                  <p className="text-gray-500 sm:text-2xl lg:text-base">
                    Amilia Admin
                  </p>
                </div>
              </div>
            </div>

            <div className="flex mt-4 flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    ref={managerAccessRef}
                    id="managerAccess"
                    name="Club admin"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-red-500">
                    {errorMessages["Club admin"]}
                  </span>
                </div>
                <div className="text-sm leading-6">
                  <p className="text-gray-500 sm:text-2xl lg:text-base">
                    Club Admin
                  </p>
                </div>
              </div>
            </div>

            <div
              id="submitButtonsContainer"
              className="mt-5 flex justify-center"
            >
              <button
                disabled={activeSaveButton}
                onClick={handleSubmit}
                id="submitAddMember"
                type="button"
                className={
                  activeSaveButton
                    ? "w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
                    : "w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm"
                }
              >
                {isLoading ? (
                  <div
                    className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-solid rounded-full animate-spin"
                    style={{
                      borderColor: "#535787",
                      borderRightColor: "transparent",
                      width: "1.2rem",
                      height: "1.2rem",
                    }}
                  ></div>
                ) : (
                  "Save"
                )}
              </button>

              <button
                disabled={isLoading}
                onClick={handleCloseModal}
                id="closeAddModal"
                type="button"
                className="w-[120px] mr-2 rounded-lg bg-[#243570] px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-[#535787]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line
const MemberDetail = ({
  // eslint-disable-next-line
  dtValue, // eslint-disable-next-line
  member, // eslint-disable-next-line
  index, // eslint-disable-next-line
  clubName, // eslint-disable-next-line
  isManager, // eslint-disable-next-line
  isEditing, // eslint-disable-next-line
  setIsEditing, // eslint-disable-next-line
  data, // eslint-disable-next-line
  editSelectedClub, // eslint-disable-next-line
  handleChangesSubmit, // eslint-disable-next-line
  handleSelectChange,
  handleOpenModal,
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const matchingMembers = data.filter(
    (item) => item[7] === dtValue && item[3] === clubName
  );

  // const activeMatchingMember = matchingMembers.find(
  //   (item) => item[8] == "Active"
  // );

  const defaultMemberValue = member
    ? `${member[0]} ${member[1]}`
    : "none";

  return (
    <dl className="divide-y divide-gray-500 montserrat">
      {openEditModal ? (
        <EditDirectorModal
          member={member}
          dtValue={dtValue}
          clubName={clubName}
          setOpenEditModal={setOpenEditModal}
          setIsEditing={setIsEditing}
        />
      ) : (
        <></>
      )}
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
          {isEditing && editSelectedClub == clubName ? (
            <dd
              id={`${clubName}-${dtValue}-${index}`}
              data-index={index}
              className="text-sm leading-6 whitespace-nowrap text-gray-700 sm:col-start-3 text-right flex justify-end"
            >
              <select
                className="ml-4 ring-0 border-transparent text-sm -ml-8 text-right appearance-none border-0 focus:outline-none focus:ring-0 focus:border-none"
                defaultValue={defaultMemberValue}
                onChange={(e) => {
                  handleSelectChange(
                    clubName,
                    e.target.value,
                    defaultMemberValue,
                    dtValue
                  );
                }}
              >
                <option value="">None</option>
                {matchingMembers.map((item, idx) => (
                  <option
                    key={idx}
                    value={`${item[0]} ${item[1]}`}
                  >{`${item[0]} ${item[1]}`}</option>
                ))}
                <option value="openAddModal">Add director</option>
              </select>
            </dd>
          ) : member ? (
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

        {isManager && member && isEditing && editSelectedClub == clubName && (
          <button onClick={handleOpenEditModal} className="w-5 ml-[54px]">
            <svg
              className="h-5 w-5 mt-0.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="#243570"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        )}
      </div>
    </dl>
  );
};
// eslint-disable-next-line
const MemberCard = ({
  // eslint-disable-next-line
  clubData, // eslint-disable-next-line
  isManager, // eslint-disable-next-line
  setOpenModal, // eslint-disable-next-line
  setSelectedClubName, // eslint-disable-next-line
  isEditing, // eslint-disable-next-line
  setIsEditing, // eslint-disable-next-line
  data,
  showModal,
  setShowModal, 
  setActiveButton,
  btnId
}) => {
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

  const [editSelectedClub, setEditSelectedClub] = useState("");
  const [shouldChange, setShouldChange] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isChangingSelect, setIsChangingSelect] = useState(false);

  const clubName = clubData[0][3];
  // eslint-disable-next-line
  const activeMembers = clubData.filter((el) => el[8] === "Active");

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedClubName(clubName);
  };

  const handleEdit = (clubName) => {
    setIsEditing(true);
    setEditSelectedClub(clubName);
  };

  const [selectedChanges, setSelectedChanges] = useState([]);
  const dispatch = useDispatch();

  const handleSelectChange = (clubName, newValue, oldValue, dtValue) => {
    if (newValue == "openAddModal") {
      handleOpenModal();
    } else {
      const changeObj = {
        clubName: clubName,
        newValue: newValue,
        oldValue: oldValue,
        role: dtValue,
      };

      setSelectedChanges((prev) => [...prev, changeObj]);
    }
  };

  const handleChangesSubmit = () => {
    console.log(selectedChanges);
    setIsChangingSelect(true);
    if (isLoadingSelect) return;
    setShouldChange(true);
  };

  const postSelectChanges = async (changes) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec";

    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        action: "editClubInSheet",
        changes: changes,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options);
  };

  useEffect(() => {
    if (shouldChange && !isLoadingSelect) {
      const sendSelectChanges = async () => {
        setIsLoadingSelect(true);
        await postSelectChanges(selectedChanges);
        dispatch(fetchData());
        setShouldChange(false);
        setIsLoadingSelect(false);
        setIsEditing(false);
        setIsChangingSelect(false);
      };
      sendSelectChanges();
    }
  }, [shouldChange, isLoadingSelect, selectedChanges, dispatch]);

  const membersJSX = dtValues.map((dtValue, dtIndex) => {
    if (dtValue === "Director at Large" || dtValue === "Other") {
      const membersWithRole = activeMembers.filter(
        (item) => item[7] === dtValue
      );

      if (membersWithRole.length === 0) {
        membersWithRole.push(null);
      }

      return membersWithRole.map((member, memberIndex) => (
        <MemberDetail
          key={`${dtIndex}-${memberIndex}`}
          dtValue={dtValue}
          member={member}
          index={dtIndex + memberIndex}
          clubName={clubName}
          isManager={isManager}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          data={data}
          editSelectedClub={editSelectedClub}
          handleSelectChange={handleSelectChange}
          handleChangesSubmit={handleChangesSubmit}
          handleOpenModal={handleOpenModal}
        />
      ));
    } else {
      const member = activeMembers.find((item) => item[7] === dtValue);
      return (
        <MemberDetail
          key={`${dtIndex}-${dtValue}`}
          dtValue={dtValue}
          member={member || null}
          index={dtIndex}
          clubName={clubName}
          isManager={isManager}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          data={data}
          editSelectedClub={editSelectedClub}
          handleSelectChange={handleSelectChange}
          handleChangesSubmit={handleChangesSubmit}
          handleOpenModal={handleOpenModal}
        />
      );
    }
  });

  return (
    <div className="mt-8 w-[500px] rounded-xl shadow-2xl border">
      <div className="flex text-xl px-4 py-5 bg-gray-200 rounded-t-xl justify-between">
        <h2 className="font-semibold">{clubName}</h2>

        <div className="flex space-x-4">
          {isEditing && editSelectedClub == clubName ? (
            <>
              {/* {isChangingSelect ? (
                <button
                  className="add-director-button hidden bg-transparent"
                  onClick={handleOpenModal}
                >
                  <p className="font-semibold text-base text-[#535787] cursor-pointer">
                    Add Director
                  </p>
                </button>
              ) : (
                <button
                  className="add-director-button bg-transparent"
                  onClick={handleOpenModal}
                >
                  <p className="font-semibold text-base text-[#535787] cursor-pointer">
                    Add Director
                  </p>
                </button>
              )} */}
              {isChangingSelect ? (
                <div className="mt-[2px]">
                  <div
                    className="spinner w-2 h-2 border-t-2 border-solid rounded-full animate-spin"
                    style={{
                      borderColor: "#535787",
                      borderRightColor: "transparent",
                      width: "1.2rem",
                      height: "1.2rem",
                    }}
                  ></div>
                </div>
              ) : (
                <button
                  className="save-button bg-transparent"
                  onClick={handleChangesSubmit}
                >
                  <p className="font-semibold text-base text-[#535787] cursor-pointer">
                    Save
                  </p>
                </button>
              )}
            </>
          ) : (
            isManager === "MANAGER" && (
              <button
                className="edit-button bg-transparent"
                onClick={() => handleEdit(clubName)}
              >
                <p className="font-semibold text-base text-[#535787] cursor-pointer">
                  Edit
                </p>
              </button>
            )
          )}
        </div>
      </div>
      {showModal && (
        <SaveChangesModal
          showModal={showModal}
          setShowModal={setShowModal}
          setActiveButton={setActiveButton}
          btnId={btnId}
          setIsEditing={setIsEditing}
        />
      )}
      {membersJSX}
    </div>
  );
};
// eslint-disable-next-line
const ClubDirectors = ({
  isManager,
  isBcsf,
  uniqueClubValues,
  isEditing,
  setIsEditing,
  showModal,
  setShowModal,
  setActiveButton,
  btnId,
}) => {
  let { data } = useSelector((state) => state.reducer);
  data = data.map((row) => {
    const item9 = row[11];
    const before = row.slice(0, 3);
    const after = row.slice(3, 10);
    return [...before, item9, ...after];
  });
  const groups = groupDataById(data);
  const [selectedClub, setSelectedClub] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedClubName, setSelectedClubName] = useState("");
  const [version, setVersion] = useState(0);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVersion((prevVersion) => prevVersion + 1);
    setIsEditing(false);
  };

  const submitAddDirector = () => {
    return selectedClubName;
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
                  <option key={`${index}-${name}`} value={name}>
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
            {openModal ? (
              <AddDirectorModal
                handleCloseModal={handleCloseModal}
                submitAddDirector={submitAddDirector}
                data={data}
              />
            ) : (
              <></>
            )}
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
                  key={`${index}-${clubName}`}
                  clubData={clubData}
                  isManager={isManager}
                  setOpenModal={setOpenModal}
                  setSelectedClubName={setSelectedClubName}
                  version={version}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  data={data}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  setActiveButton={setActiveButton}
                  btnId={btnId}
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
            <MemberCard
              key={`${index}-${clubData[0][3]}`}
              clubData={clubData}
              isManager={isManager}
              setOpenModal={setOpenModal}
              setIsEditing={setIsEditing}
              data={data}
              showModal={showModal}
              setShowModal={setShowModal}
              setActiveButton={setActiveButton}
              btnId={btnId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubDirectors;
