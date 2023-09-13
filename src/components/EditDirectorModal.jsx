import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// eslint-disable-next-line
const EditDirectorModal = ({ member, dtValue, clubName }) => {
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
  const [shouldPostEdition, setShouldPostEdition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);

  const dispatch = useDispatch();
  console.log(member);
  useEffect(() => {
    if (member) {
      memberNameRef.current.value = member[0] || ""; // Assuming position 0 holds the name.
      memberLastNameRef.current.value = member[1] || ""; // And so on...
      memberEmailRef.current.value = member[2] || "";
      memberPhoneNumberRef.current.value = member[4] || "";
      genderRef.current.value = member[5] || "";
      // memberBirthdateRef is special since it's a datepicker
      // If using react-datepicker you might set state here instead
      // For simplicity, let's assume it's a normal input for now
      setStartDate(new Date(member[10]));
      memberRoleRef.current.value = member[7] || "";
      ameliaAdminRef.current.value = member[8] || "";
      managerAccessRef.current.checked = member[9] || ""; // Assuming position 8 holds a boolean for the checkbox
    }
  }, [member]);

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
        console.log("entre");
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

    const localMemberData = formData;
    localMemberData.splice(5, 0, startDate);
    localMemberData.splice(7, 0, "Active");

    setActiveSaveButton(true);
    if (isLoading) return;
    setShouldPostEdition(true);
  };

  const editDirectorData = async (clubName, memberData, hasManager) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec"; // Your URL here

    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        // action: "addMemberToSheet",
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

  //   useEffect(() => {
  //     if (shouldPostEdition && !isLoading) {
  //       const addDirector = async () => {
  //         setIsLoading(true);
  //         await editDirectorData(clubName, memberData, hasManager);
  //         dispatch(fetchData());
  //         setShouldPostEdition(false); // Reset the flag after making the API call
  //         setIsLoading(false);
  //       };
  //       addDirector();
  //     }
  //   }, [shouldPostEdition, clubName, memberData, hasManager, data, isLoading, dispatch]);

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
                id="submitAddMember"
                type="button"
                className="w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
              >
                Save
              </button>

              <button
                disabled={isLoading}
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
