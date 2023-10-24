import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import DatePicker from "react-datepicker";
import ConfirmClose from "./ConfirmClose.jsx";
import "react-datepicker/dist/react-datepicker.css";

// eslint-disable-next-line
const EditDirectorModal = ({
  member,
  dtValue,
  clubName,
  setOpenEditModal,
  setIsEditing,
}) => {
  const memberNameRef = useRef(null);
  const memberLastNameRef = useRef(null);
  const memberEmailRef = useRef(null);
  const memberPhoneNumberRef = useRef(null);
  const genderRef = useRef(null);
  const memberBirthdateRef = useRef(null);
  const memberRoleRef = useRef(null);
  const ameliaAdminRef = useRef(null);
  const managerAccessRef = useRef(null);
  const editModalRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [shouldPostEdition, setShouldPostEdition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [modifiedValues, setModifiedValues] = useState({});
  const [dateModified, setDateModified] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [closeModalConfirmed, setCloseModalConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    memberName: member[0] || "",
    memberLastName: member[1] || "",
    memberEmail: member[2] || "",
    memberPhoneNumber: member[4] || "",
    memberGender: member[5] || "",
    memberRole: member[7] || "",
    memberAdmin: member[9] || "",
    memberManager: member[10] || "",
  });

  const dispatch = useDispatch();

  function formatDate(d) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); 
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  }

  const handleCloseModal = () => {
    if (confirmClose == false) {
      setConfirmClose(true);
      // editModalRef.current.scroll(100, 0);
      // window.scroll(top: 10)
    }
  };

  useEffect(() => {
    if (member) {
      // let dateToInsert = formatDate(member[5]);
      setStartDate(new Date(member[6]));
    }
    if (dateModified) {
      setModifiedValues((prevData) => ({
        ...prevData,
        ["editeffectivedate"]: formatDate(startDate),
        email: member[2],
      }));
    }
  }, [member, dateModified, startDate, confirmClose]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    let actualValue = type === "checkbox" ? checked : value;

    let newStateKey;
    switch (name) {
      case "Name":
        newStateKey = "memberName";
        break;
      case "Last Name":
        newStateKey = "memberLastName";
        break;
      case "Email":
        newStateKey = "memberEmail";
        break;
      case "Phone number":
        newStateKey = "memberPhoneNumber";
        break;
      case "Gender":
        newStateKey = "memberGender";
        break;
      case "Role":
        newStateKey = "memberRole";
        break;
      case "Is Amilia admin":
        newStateKey = "memberAdmin";
        break;
      case "Club admin":
        newStateKey = "memberManager";
        break;
      default:
        return; // if name doesn't match any, don't do anything
    }

    setFormData((prevState) => ({ ...prevState, [newStateKey]: actualValue }));
    const serverKey =
      "edit" +
      name
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word, index) => {
          return index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");
    setModifiedValues((prevData) => ({
      ...prevData,
      [serverKey]: value,
      email: member[2],
    }));
  }

  const roles = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Past President",
    "Membership Director",
    "Director at Large",
    "Other",
  ];

  const initialCheckboxStates = {};
  roles.forEach((el) => {
    initialCheckboxStates[el] = formData.memberRole == el;
  });

  const [checkboxStates, setCheckboxStates] = useState(initialCheckboxStates);

  const handleCheckboxChange = (el) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [el]: !prevStates[el],
    }));
  };

  let { data } = useSelector((state) => state.reducer);

  const selectedRoles = data
    .filter((el) => el[2] == formData.memberEmail && el[7] == "Active")
    .map((el) => el[6]);

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

      let isAnyRoleChecked = roles.some(
        (role) => document.getElementById(role).checked
      );

      if (
        element.tagName.toLowerCase() === "select" &&
        element.selectedIndex === 0
      ) {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      } else if (element.type !== "checkbox" && element.value.trim() === "") {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      } else if (!isAnyRoleChecked) {
        newErrorMessages["Role"] = "At least one role must be selected";
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

    let checkedRolesObjects = roles
      .filter((role) => document.getElementById(role).checked)
      .map((role) => {
        return { roleKey: role, value: true };
      });

    const newModifiedValues = {
      ...modifiedValues,
      ...checkedRolesObjects.reduce((acc, curr) => {
        acc[curr.roleKey] = curr.value;
        return acc;
      }, {}),
    };

    if (!newModifiedValues.email) {
      newModifiedValues.email = member[2];
    }

    setModifiedValues(newModifiedValues);

    setActiveSaveButton(true);
    if (isLoading) return;
    setShouldPostEdition(true);
  };

  const editDirectorData = async (modifiedValues) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec"; // Your URL here

    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        action: "modifyClubSheet",
        modifiedValues: modifiedValues,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options);
  };

  useEffect(() => {
    if (shouldPostEdition && !isLoading) {
      const editDirector = async () => {
        setIsLoading(true);
        await editDirectorData(modifiedValues);
        dispatch(fetchData());
        setShouldPostEdition(false);
        setIsLoading(false);
        setIsEditing(false);
        setOpenEditModal(false);
        setActiveSaveButton(false);
      };
      editDirector();
    }
  }, [
    shouldPostEdition,
    clubName,
    modifiedValues,
    setIsEditing,
    setOpenEditModal,
    isLoading,
    dispatch,
  ]);

  return (
    <div
    // ref={editModalRef}
      id="editMemberModal"
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            {confirmClose && (
              <div>
                <ConfirmClose
                  confirmClose={confirmClose}
                  setConfirmClose={setConfirmClose}
                  setCloseModalConfirmed={setCloseModalConfirmed}
                  setOpenEditModal={setOpenEditModal}
                  setIsEditing={setIsEditing}
                />
              </div>
            )}
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              <h3
                className=" font-semibold lg:text-sm leading-6 text-gray-900"
                id="modal-title"
              >
                Edit Director
              </h3>
              <p>Complete this fields to edit director information.</p>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Name{" "}
              </label>
              <input
                ref={memberNameRef}
                name="Name"
                id="editMemberName"
                type="text"
                value={formData.memberName}
                onChange={handleInputChange}
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
                id="editMemberLastName"
                type="text"
                value={formData.memberLastName}
                onChange={handleInputChange}
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
                id="editMemberEmail"
                type="text"
                value={formData.memberEmail}
                onChange={handleInputChange}
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
                id="editMemberPhoneNumber"
                type="text"
                value={formData.memberPhoneNumber}
                onChange={handleInputChange}
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert phone number"
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
                id="editMemberGender"
                name="Gender"
                value={formData.memberGender}
                onChange={handleInputChange}
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
                id="editMemberBirthdate"
                customInput={<input ref={memberBirthdateRef} />}
                type="text"
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date); // Update the startDate with the selected date
                  setDateModified(true); // Set dateModified to true
                }}
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
                placeholderText="Insert effective date"
              />
              <span className="text-red-500">
                {errorMessages["Effective date"]}
              </span>
            </div>

            <div className="flex flex-col gap-3 w-full py-2 text-gray-500 px-1 outline-none ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Role{" "}
              </label>
              {roles.map((el, e) => (
                <div
                  key={e}
                  className="flex mt-2 flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none"
                >
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        ref={memberRoleRef}
                        id={el}
                        checked={selectedRoles.includes(el) || false} // use the specific checkbox state
                        name="Role"
                        type="checkbox"
                        onChange={() => handleCheckboxChange(el)} // pass 'el' to the handler
                        className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <p className="text-gray-500 sm:text-2xl lg:text-base">
                        {el}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <span className="text-red-500">{errorMessages["Role"]}</span>
            </div>

            <div className="flex mt-4 flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Access{" "}
              </label>
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    ref={ameliaAdminRef}
                    id="editMemberAmeliaAdmin"
                    name="Is Amilia admin"
                    type="checkbox"
                    checked={formData.memberAdmin == 'true' ? true : false}
                    onChange={handleInputChange}
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
                    id="editManagerAccess"
                    name="Club admin"
                    type="checkbox"
                    checked={formData.memberManager == 'true' ? true : false}
                    onChange={handleInputChange}
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
                type="submit"
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

export default EditDirectorModal;
