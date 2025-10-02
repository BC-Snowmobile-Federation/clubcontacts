import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../redux/slice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditDirectorModal from './EditDirectorModal';
import SaveChangesModal from './SaveChangesModal';
import ExistingUserModal from './ExistingUserModal';
import DeleteDirectorModal from './DeleteDirectorModal';
import { APPS_SCRIPT_URL } from '../constants';
import { toast } from 'sonner';

// const groupDataById = (data) => {
//   if (data.length >= 1) {
//     return data.reduce((groups, item) => {
//       let isBcsf = JSON.parse(localStorage.getItem("isBcsf"));
//       let club = localStorage.getItem("clubName");
//       item[3] = Boolean(isBcsf) == false ? club : item[3];
//       const id = item[3];
//       if (!groups[id]) {
//         groups[id] = [];
//       }
//       groups[id].push(item);
//       return groups;
//     }, {});
//   } else {
//     let club = localStorage.getItem("clubName");
//     return { [club]: [["", "", "", club, "", "", "", "", "", "", ""]] };
//   }
// };
const groupDataById = (data) => {
  let clubsString = localStorage.getItem('clubs');
  let clubs = JSON.parse(clubsString);

  if (data.length >= 1) {
    let resp = data.reduce((groups, item) => {
      const id = item[3];
      if (!groups[id]) {
        groups[id] = [];
      }
      groups[id].push(item);
      return groups;
    }, {});
    clubs.forEach((club) => {
      if (!resp[club]) {
        resp[club] = [['', '', '', club, '', '', '', '', '', '', '']];
      }
    });
    return resp;
  } else {
    let resp = [];
    clubs.forEach((club) => {
      if (!resp[club]) {
        resp[club] = [['', '', '', club, '', '', '', '', '', '', '']];
      }
    });
    return resp;
  }
};

// eslint-disable-next-line
const AddDirectorModal = ({
  // eslint-disable-next-line
  handleCloseModal,
  // eslint-disable-next-line
  submitAddDirector,
  // eslint-disable-next-line
  data,
  // eslint-disable-next-line
  setIsEditing,
  // eslint-disable-next-line
  setOpenModal,
}) => {
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
  // const [shouldPost, setShouldPost] = useState(false);
  // const [clubName, setClubName] = useState("");
  // const [hasManager, setHasManager] = useState(false);
  // const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const [statusUserFound, setStatusUserFound] = useState('');
  const [existingInactiveUser, setExistingInactiveUser] = useState(false);
  const [inactiveCheckedRole, setInactiveCheckedRole] = useState([]);
  const [isLoadingInactive, setIsLoadingInactive] = useState(false);
  const [isLoadingPostInactive, setIsLoadingPostInactive] = useState(false);
  const dispatch = useDispatch();

  const roles = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Past President',
    'Membership Director',
    'Director at Large',
    'Other',
    'Staff',
  ];

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

    let checkedRoles = roles.filter(
      (role) => document.getElementById(role).checked
    );

    for (let role of checkedRoles) {
      const formDataForRole = inputRefs
        .map((ref) => {
          const element = ref.current;

          if (!element) return null;

          if (element instanceof HTMLElement) {
            if (ref === memberRoleRef) {
              return role;
            }
            return element.type === 'checkbox'
              ? element.checked
              : element.value;
          } else {
            return startDate;
          }
        })
        .filter((data) => data !== null);

      let isClubAdmin = managerAccessRef.current.checked;

      const localHasManager = formDataForRole.pop();
      const localMemberData = [...formDataForRole];
      localMemberData.splice(5, 0, startDate);
      localMemberData.splice(7, 0, 'Active');
      localMemberData.push(isClubAdmin);

      setIsLoading(true);
      setActiveSaveButton(true);

      await postDirectorData(
        submitAddDirector(),
        localMemberData,
        localHasManager
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second before the next iteration
    }

    dispatch(fetchData());
    setIsLoading(false);
    setIsEditing(false);
    setOpenModal(false);
  };

  async function checkIfUserExists() {
    let clubName = submitAddDirector();
    // let url =
    //   'https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=checkIfUserExists&email=' +
    //   memberEmailRef.current.value +
    //   '&clubName=' +
    //   encodeURIComponent(clubName);
      let url =
      'https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec?action=checkIfUserExists&email=' +
      memberEmailRef.current.value +
      '&clubName=' +
      encodeURIComponent(clubName);

    let response = await fetch(url);
    let json = await response.json();
    return json.response;
  }

  const handleCheckIfUserExists = async () => {
    toast.promise((async () => {
      const resp = await checkIfUserExists()
      if (resp.status == 'Active') {
        setStatusUserFound('Active');
        setShowExistingUser(true);
        setIsLoading(false);
      } else if (resp.status == 'Inactive') {
        setStatusUserFound('Inactive');
        let checkedRoles = roles.filter(
          (role) => document.getElementById(role).checked
        );
        setInactiveCheckedRole(checkedRoles);
        setShowExistingUser(true);
        setIsLoading(false);
      } else {
        toast.promise(handleSubmitUser()
          ,{
            loading: 'Submitting user data...',
            success: 'User data submitted successfully!',
            error: 'An error occurred while submitting user data.',
          }
        )
      }
      return resp
    })(),
      {
        loading: 'Checking if user exists...',
        success: 'User check completed!',
        error: 'An error occurred while checking user status.',
      }
    )
  };

  const handleSubmitUser = async () => {
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

    let checkedRoles = roles.filter(
      (role) => document.getElementById(role).checked
    );
    setOpenModal(false);
    for (let role of checkedRoles) {
      const formDataForRole = inputRefs
        .map((ref) => {
          const element = ref.current;

          if (!element) return null;

          if (element instanceof HTMLElement) {
            if (ref === memberRoleRef) {
              return role;
            }
            return element.type === 'checkbox'
              ? element.checked
              : element.value;
          } else {
            return startDate;
          }
        })
        .filter((data) => data !== null);

      let isClubAdmin = managerAccessRef.current.checked;

      const localHasManager = formDataForRole.pop();
      const localMemberData = [...formDataForRole];
      localMemberData.splice(5, 0, startDate);
      localMemberData.splice(7, 0, 'Active');
      localMemberData.push(isClubAdmin);

      setIsLoading(true);
      setActiveSaveButton(true);

      await postDirectorData(
        submitAddDirector(),
        localMemberData,
        localHasManager
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second before the next iteration
    }

    await dispatch(fetchData()).then(() => {
      setIsLoading(false);
      // setIsEditing(false);
      // setOpenModal(false);
    });
  };

  const handleAllSubmit = () => {
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
          newErrorMessages['Effective date'] = 'Effective date is required';
          hasErrors = true;
        }
        continue;
      }

      let isAnyRoleChecked = roles.some(
        (role) => document.getElementById(role).checked
      );

      if (
        element.tagName.toLowerCase() === 'select' &&
        element.selectedIndex === 0
      ) {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      } else if (element.type !== 'checkbox' && element.value.trim() === '') {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      } else if (!isAnyRoleChecked) {
        newErrorMessages['Role'] = 'At least one role must be selected';
        hasErrors = true;
      }

      if (
        element.name === 'Phone number' ||
        element.id === 'phoneNumberInput'
      ) {
        // Adjust the condition as per the name or id of your phone number input
        const phoneNumberPattern = /^\(\d{3}\) \d{3}-\d{4}$/; // Regex pattern for (xxx)yyy-zzzz
        if (!phoneNumberPattern.test(element.value)) {
          newErrorMessages[element.name] =
            'Phone number format should be (xxx) yyy-zzzz';
          hasErrors = true;
        }
      }
    }

    if (!dateSelected && startDate == null) {
      newErrorMessages['Effective date'] = 'Effective date is required';
      hasErrors = true;
    }

    setErrorMessages(newErrorMessages);

    if (hasErrors) return;
    setIsLoading(true);
    setActiveSaveButton(true);
    handleCheckIfUserExists();
    // setIsEditing(false);
    // setOpenModal(false);
  };

  useEffect(() => {
    if (existingInactiveUser) {
      setIsLoadingInactive(true);
      submitInactiveUser();
    }
  }, [existingInactiveUser]);

  const submitInactiveUser = async () => {
    let inactiveUseremail = memberEmailRef.current.value;
    let inactiveUserRoles = inactiveCheckedRole;
    await postInactiveUser(inactiveUseremail, inactiveUserRoles).then(
      async () => {
        setExistingInactiveUser(false);
        await dispatch(fetchData()).then(() => {
          setIsLoadingInactive(false);
          setShowExistingUser(false);
          setOpenModal(false);
          setIsEditing(false);
        });
      }
    );
  };

  const postInactiveUser = async (inactiveEmail, inactiveRole) => {
    // let url =
    //   'https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec';

    let url = 'https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec'
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'postInactiveUser',
        inactiveEmail: inactiveEmail,
        inactiveRole: inactiveRole,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(url, options);
  };

  const postDirectorData = async (clubName, memberData, hasManager) => {
    // console.log(memberData)
    // return
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'addMemberToSheet',
        memberData: memberData,
        clubName: clubName,
        hasManager: hasManager,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(APPS_SCRIPT_URL, options);
  };

  const [phone, setPhone] = useState('');

  const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
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

  useEffect(() => {
    // Add the class to disable scroll on mount
    document.body.classList.add('overflow-y-hidden');

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('overflow-y-hidden');
    };
  }, []);

  return (
    <div
      id="addMemberModal"
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto mb-16 md:mb-0">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-8 text-left shadow-xl transition-all w-[500px] ml-0 md:ml-72 sm:my-8">
            <div className="mt-3 text-center sm:mt-5 montserrat text-gray-900">
              {showExistingUser && (
                <ExistingUserModal
                  statusUserFound={statusUserFound}
                  setShowExistingUser={setShowExistingUser}
                  setExistingInactiveUser={setExistingInactiveUser}
                  inactiveCheckedRole={inactiveCheckedRole}
                  isLoadingInactive={isLoadingInactive}
                  setActiveSaveButton={setActiveSaveButton}
                />
              )}
              <h3
                className="font-medium text-lg md:text-2xl leading-6"
                id="modal-title"
              >
                Add Director
              </h3>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                  Name{' '}
                </label>
                <input
                  ref={memberNameRef}
                  name="Name"
                  id="memberName"
                  type="text"
                  className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                  placeholder="Insert name"
                />
                <span className="text-red-600 text-xs mt-1 ml-2">
                  {errorMessages['Name']}
                </span>
              </div>

              <div className="flex flex-col w-full">
                <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                  Last Name{' '}
                </label>
                <input
                  ref={memberLastNameRef}
                  name="Last Name"
                  id="memberLastName"
                  type="text"
                  className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                  placeholder="Insert last name"
                />
                <span className="text-red-600 text-xs mt-1 ml-2">
                  {errorMessages['Last Name']}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Email
              </label>
              <input
                ref={memberEmailRef}
                name="Email"
                id="memberEmail"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert email"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['Email']}
              </span>
            </div>

            <div className="flex flex-col w-full">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Phone Number{' '}
              </label>
              <input
                ref={memberPhoneNumberRef}
                name="Phone number"
                id="memberPhoneNumber"
                type="text"
                value={phone}
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="(xxx) xxx-xxxx"
                onChange={handleFormatNumber}
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['Phone number']}
              </span>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                  Gender{' '}
                </label>
                <select
                  ref={genderRef}
                  id="gender"
                  name="Gender"
                  className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                >
                  <option value="" disabled selected>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span className="text-red-600 text-xs mt-1 ml-2">
                  {errorMessages['Gender']}
                </span>
              </div>

              <div className="flex flex-col w-full">
                <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
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
                  className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                  placeholderText="Insert effective date"
                />
                <span className="text-red-600 text-xs mt-1 ml-2">
                  {errorMessages['Effective date']}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Role{' '}
              </label>
              <div className="grid grid-cols-2">
                {roles.map((el, e) => (
                  <div
                    key={e}
                    className="flex mt-2 flex-col gap-4 w-full py-0.5 outline-none"
                  >
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center ml-2">
                        <input
                          ref={memberRoleRef}
                          id={el}
                          name="Role"
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div className="leading-6">
                        <p className="text-sm sm:text-base">{el}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['Role']}
              </span>
            </div>

            <div className="flex flex-col w-full">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Access{' '}
              </label>
              <div className="grid grid-cols-2 mt-2">
                <div className="relative flex gap-x-1">
                  <div className="flex items-center ml-2">
                    <input
                      ref={ameliaAdminRef}
                      id="ameliaAdmin"
                      name="Is Amilia admin"
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-red-600 text-xs mt-1 ml-2">
                      {errorMessages['Is Amilia admin']}
                    </span>
                  </div>
                  <div className="text-sm leading-6">
                    <div className="flex gap-2 items-center">
                      <p className="text-sm sm:text-base">Amilia Admin</p>
                      <button className="relative group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                          />
                        </svg>

                        <span className="group-hover:opacity-100 group-hover:visible transition-opacity bg-white px-1 text-sm text-black rounded-md absolute -translate-x-1/2  sm:-translate-x-1/3 translate-y-9 sm:translate-y-full opacity-0 invisible mx-auto z-50 top-[-10px]">
                          <div className="flex flex-col p-2 text-xs">
                            <span className="truncate">
                              Grants the user administrator access to the club's
                              <br className="sm:hidden" />
                              Amilia Online Store
                            </span>
                          </div>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="relative flex gap-x-3">
                    <div className="flex items-center ml-2">
                      <input
                        ref={managerAccessRef}
                        id="managerAccess"
                        name="Club admin"
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="text-red-600 text-xs mt-1 ml-2">
                        {errorMessages['Club admin']}
                      </span>
                    </div>
                    <div className="leading-6">
                      <div className="flex gap-2 items-center">
                        <p className="text-sm sm:text-base">Club Admin</p>
                        <button className="relative group">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                            />
                          </svg>

                          <span className="group-hover:opacity-100 group-hover:visible transition-opacity bg-white px-1 text-sm text-black rounded-md absolute -translate-x-full sm:-translate-x-3/4 translate-y-9 sm:translate-y-full opacity-0 invisible mx-auto z-50 top-[-10px]">
                            <div className="flex flex-col p-2 text-xs">
                              <span className="truncate">
                                Allows the user to make changes to
                                <br className="sm:hidden" /> club contacts in
                                this app
                              </span>
                            </div>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="submitButtonsContainer"
              className="mt-6 mb-4 flex gap-4 justify-center"
            >
              <button
                disabled={isLoading}
                onClick={handleCloseModal}
                id="closeAddModal"
                type="button"
                className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-red-600 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button
                disabled={activeSaveButton}
                onClick={handleAllSubmit}
                id="submitAddMember"
                type="button"
                className={
                  activeSaveButton
                    ? 'w-[120px] mr-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] hover:text-[#535787] transition-all'
                    : 'w-[120px] mr-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all'
                }
              >
                {isLoading ? (
                  <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Este es el edit mode con el dropdown y el boton para editar a una persona

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
  handleSelectChange, // eslint-disable-next-line
  handleOpenModal,
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const matchingMembers = data.filter(
    (item) => item[7] === dtValue && item[3] === clubName
  );

  // Filter to get active roles for the member
  let activeRoles;
  if (member) {
    activeRoles = data
      .filter(
        (item) =>
          item[0] === member[0] && // First name matches
          item[1] === member[1] && // Last name matches
          item[8] === 'Active' // Role is active
      )
      .map((item) => item[7]);
  }

  const defaultMemberValue = member ? `${member[0]} ${member[1]}` : '';

  return (
    <dl className="divide-y divide-gray-500 montserrat">
      {openEditModal && (
        <EditDirectorModal
          member={member}
          dtValue={dtValue}
          clubName={clubName}
          setOpenEditModal={setOpenEditModal}
          setIsEditing={setIsEditing}
        />
      )}
      {openDeleteModal && (
        <DeleteDirectorModal
          member={member}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}
      <div className="px-4 py-4">
        <div className="">
          {isEditing && editSelectedClub == clubName ? (
            <div className="flex justify-between">
              <div className="flex">
                <dd
                  id={`${clubName}-${dtValue}-${index}`}
                  data-index={index}
                  className="text-sm pr-2 leading-6 whitespace-nowrap text-gray-900 sm:col-start-3 min-w-[140px] w-[140px] text-wrap sm:text-nowrap lg:w-[180px] "
                >
                  {member ? member[0] + ' ' + member[1] : ''}
                </dd>
                <div className="flex pr-2 sm:w-[140px] lg:w-[200px] items-center text-left">
                  {activeRoles.length > 0 && (
                    <p className="text-left text-xs text-gray-600 text-wrap">
                      {activeRoles.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {isManager &&
                member &&
                isEditing &&
                editSelectedClub == clubName && (
                  <div className="flex gap-4">
                    <button onClick={handleOpenEditModal} className="w-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      className="w-5 text-red-600"
                      onClick={handleOpenDeleteModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                )}
            </div>
          ) : member ? (
            <div className="flex justify-between px-4">
              <dt
                className="text-sm font-medium leading-6 text-gray-900 whitespace-nowrap sm:col-start-1 text-left"
                data-dthtml-value={dtValue}
              >
                {dtValue}
              </dt>

              <dd
                id={`${clubName}-${dtValue}-${index}`}
                data-value={`${member[0]} ${member[1]}`}
                data-index={index}
                className="text-sm leading-6 text-gray-900 whitespace-nowrap sm:col-start-3 text-right flex justify-end"
              >
                {member[0]} {member[1]}
              </dd>
            </div>
          ) : (
            <div className="flex justify-between px-4">
              <dt
                className="text-sm font-medium leading-6 text-gray-900 whitespace-nowrap sm:col-start-1 text-left"
                data-dthtml-value={dtValue}
              >
                {dtValue}
              </dt>
              <dd
                id={`${clubName}-${dtValue}-${index}`}
                data-index={index}
                className="text-sm leading-6 whitespace-nowrap text-gray-700 sm:col-start-3 text-right flex justify-end"
              ></dd>
            </div>
          )}
        </div>
      </div>
    </dl>
  );
};

//
// eslint-disable-next-line
const MemberCard = ({
  clubData,
  isManager,
  setOpenModal,
  setSelectedClubName,
  isEditing,
  setIsEditing,
  data,
  showModal,
  setShowModal,
  setActiveButton,
  btnId,
}) => {
  const dtValues = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Past President',
    'Membership Director',
    'Director at Large',
    'Other',
    'Staff',
  ];

  const [editSelectedClub, setEditSelectedClub] = useState('');
  const [shouldChange, setShouldChange] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isChangingSelect, setIsChangingSelect] = useState(false);

  const clubName = clubData[0][3];
  const activeMembers = clubData.filter((el) => el[8] === 'Active');

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedClubName(clubName);
  };

  const handleEdit = (clubName) => {
    setIsEditing(true);
    setEditSelectedClub(clubName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSelectedClub('');
  };

  const [selectedChanges, setSelectedChanges] = useState([]);
  const dispatch = useDispatch();

  const handleSelectChange = (clubName, newValue, oldValue, dtValue) => {
    if (newValue === 'openAddModal') {
      handleOpenModal();
    } else {
      const changeObj = {
        clubName: clubName,
        newValue: newValue,
        oldValue: oldValue,
        role: dtValue,
      };
      setSelectedChanges((prev) => {
        if (
          prev.some(
            (item) =>
              item.clubName === changeObj.clubName &&
              item.newValue === changeObj.newValue &&
              item.oldValue === changeObj.oldValue &&
              item.role === changeObj.role
          )
        ) {
          return prev;
        }
        return [...prev, changeObj];
      });
    }
  };

  const handleChangesSubmit = () => {
    setIsChangingSelect(true);
    if (isLoadingSelect) return;
    setShouldChange(true);
  };

  const postSelectChanges = async (changes) => {
    // let url =
    //   'https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec';

    let url = 'https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec'

    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'editClubInSheet',
        changes: changes,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(url, options);
  };

  useEffect(() => {
    if (shouldChange && !isLoadingSelect) {
      const sendSelectChanges = async () => {
        setIsLoadingSelect(true);
        await postSelectChanges(selectedChanges);
        // esperamos un segundo antes de buscar la data
        setTimeout(() => {
          dispatch(fetchData());
        setShouldChange(false);
        setIsLoadingSelect(false);
        setIsEditing(false);
        setIsChangingSelect(false);
        }, 2000); 
      };
      sendSelectChanges();
    }
  }, [shouldChange, isLoadingSelect, selectedChanges, dispatch]);

  const uniqueMembers = clubData.reduce(
    (acc, member) => {
      const uniqueKey = `${member[0]}|${member[1]}`; // Create a unique key based on the first two elements
      if (!acc.seen.has(uniqueKey)) {
        acc.seen.add(uniqueKey);
        acc.result.push(member);
      }
      return acc;
    },
    { seen: new Set(), result: [] }
  ).result;

  // hay que checkear esto, ver como se llama la data luego de que se hagan edits

  const membersJSX = editSelectedClub
    ? uniqueMembers.map((member, index) => {
        if (member[0] === '') {
          return (
            <div className="flex items-center justify-center py-8 text-sm font-medium">
              <h3>
                No directors found. Use the 'Add Director' button to start.
              </h3>
            </div>
          );
        }
        return (
          <MemberDetail
            key={`${index}-${member[0]}`}
            dtValue={member[7]}
            member={member}
            index={index}
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
      })
    : dtValues.map((dtValue, dtIndex) => {
        if (
          dtValue === 'Director at Large' ||
          dtValue === 'Other' ||
          dtValue === 'Staff'
        ) {
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
    <div className="mt-8 min-w-[350px] sm:w-[400px]  lg:w-[500px] rounded-xl shadow-2xl border mx-4">
      <div className="flex text-xl px-4 py-4 bg-gray-200 rounded-t-xl justify-between items-center">
        <h2
          className={`font-semibold ${
            isEditing && editSelectedClub === clubName
              ? 'mr-2 md:truncate md:max-w-[190px] lg:max-w-[225px]'
              : 'mr-4'
          }`}
        >
          {clubName}
        </h2>

        <div className="flex space-x-4">
          {isEditing && editSelectedClub === clubName ? (
            <>
              {isChangingSelect ? (
                <div className="mt-[2px]">
                  <div
                    className="spinner w-2 h-2 border-t-2 border-white border-solid rounded-full animate-spin"
                    style={{
                      borderColor: '#535787',
                      borderRightColor: 'transparent',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                  ></div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row lg:items-center gap-4">
                  <button
                    className="text-base font-semibold border border-[#535787] px-4 py-1 text-[#535787] rounded-xl hover:bg-[#535787] hover:text-white transition-all"
                    onClick={handleOpenModal}
                  >
                    Add Director
                  </button>
                  <button
                    className="text-base font-semibold border border-red-600 px-4 py-1 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          ) : (
            isManager === 'MANAGER' && (
              <button
                className="flex items-center gap-3 edit-button bg-transparent border border-[#535787] text-[#535787] px-4 py-1 rounded-xl hover:bg-[#535787] hover:text-white transition-all"
                onClick={() => handleEdit(clubName)}
              >
                <p className="font-semibold text-base cursor-pointer">Edit</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
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
      {isEditing && editSelectedClub === clubName && (
        <div className="flex items-center justify-center py-4 text-xs font-medium">
          <h4>* Changes might take a while to come into effect *</h4>
        </div>
      )}
    </div>
  );
};
// eslint-disable-next-line
const ClubDirectors = ({
  // isManager,
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
    const after = row.slice(3, 13);
    return [...before, item9, ...after];
  });

  const groups = groupDataById(data);
  const [selectedClub, setSelectedClub] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedClubName, setSelectedClubName] = useState('');
  const [version, setVersion] = useState(0);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVersion((prevVersion) => prevVersion + 1);
  };

  const submitAddDirector = () => {
    return selectedClubName;
  };

  return (
    <div className="flex-col flex items-center justify-center">
      {isBcsf ? (
        <>
          <div className="flex items-center justify-center flex-col lg:flex-row gap-4">
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
            <div className="bg-slate-100 rounded-full w-[250px] h-10 lg:ml-2 items-center flex justify-around">
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
                className="px-2 rounded-full w-[205px] statusSelect bg-transparent appearance-none border-0 pr-8 focus:outline-none focus:ring-0 focus:border-none text-sm"
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
                setIsEditing={setIsEditing}
                setOpenModal={setOpenModal}
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
              .map(([clubName, clubData], index) => {
                const clubInfo = JSON.parse(
                  localStorage.getItem(clubName) || '{}'
                );
                return (
                  <MemberCard
                    key={`${index}-${clubName}`}
                    clubData={clubData}
                    isManager={
                      clubInfo.isManager == true ? 'MANAGER' : 'MEMBER'
                    }
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
                );
              })}
          </div>
        </>
      ) : (
        <div
          id="container"
          className="flex-col mt-12 justify-center items-center"
        >
          {openModal ? (
            <AddDirectorModal
              handleCloseModal={handleCloseModal}
              submitAddDirector={submitAddDirector}
              data={data}
              setIsEditing={setIsEditing}
              setOpenModal={setOpenModal}
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
            .map(([clubName, clubData], index) => {
              const clubInfo = JSON.parse(
                localStorage.getItem(clubName) || '{}'
              );
              return (
                <MemberCard
                  key={`${index}-${clubName}`}
                  clubData={clubData}
                  isManager={clubInfo.isManager == true ? 'MANAGER' : 'MEMBER'}
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
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ClubDirectors;
