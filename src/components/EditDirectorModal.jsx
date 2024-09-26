import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../redux/slice';
import DatePicker from 'react-datepicker';
import ConfirmClose from './ConfirmClose.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import { APPS_SCRIPT_URL } from '../constants.js';

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
  const [phone, setPhone] = useState('');
  const [phonedSet, setPhonedSet] = useState(false);

  function formatPhoneNumber(phoneNumber) {
    // Extract numeric digits from the input
    const digits = phoneNumber.match(/\d+/g)?.join('');

    if (digits && digits.length === 10) {
      // Format and return the phone number
      return `(${digits.substring(0, 3)}) ${digits.substring(
        3,
        6
      )}-${digits.substring(6)}`;
    } else {
      return '';
    }
  }

  const [formData, setFormData] = useState({
    memberName: member[0] || '',
    memberLastName: member[1] || '',
    memberEmail: member[2] || '',
    memberPhoneNumber: member[4] || '',
    memberGender: member[5] || '',
    memberRole: member[7] || '',
    memberAdmin: (member[9] == 'true' ? true : false) || '',
    memberManager: member[13] != undefined ? member[13] == 'MANAGER' : '',
    //member[13] != undefined ? member[13]=="MANAGER" :""
  });

  const dispatch = useDispatch();

  function formatDate(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  }

  const handleCloseModal = () => {
    setOpenEditModal(false);
    // if (confirmClose == false) {
    //   setConfirmClose(true);
    //   // editModalRef.current.scroll(100, 0);
    //   // window.scroll(top: 10)
    // }
  };

  useEffect(() => {
    if (member) {
      if (!dateModified) {
        // let dateToInsert = formatDate(member[5]);
        setStartDate(new Date(member[6]));
      }
      if (member && !phonedSet) {
        setPhone(formatPhoneNumber(member[4]));
      }
    }
    if (dateModified) {
      setModifiedValues((prevData) => ({
        ...prevData,
        ['editeffectivedate']: formatDate(startDate),
        email: member[2],
      }));
    }
  }, []);
  // member, dateModified, startDate, confirmClose

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    let actualValue = type === 'checkbox' ? checked : value;

    let newStateKey;
    switch (name) {
      case 'Name':
        newStateKey = 'memberName';
        break;
      case 'Last Name':
        newStateKey = 'memberLastName';
        break;
      case 'Email':
        newStateKey = 'memberEmail';
        break;
      case 'Phone number':
        newStateKey = 'memberPhoneNumber';
        break;
      case 'Gender':
        newStateKey = 'memberGender';
        break;
      case 'Role':
        newStateKey = 'memberRole';
        break;
      case 'Is Amilia admin':
        newStateKey = 'memberAdmin';
        break;
      case 'Club admin':
        newStateKey = 'memberManager';
        break;
      default:
        return; // if name doesn't match any, don't do anything
    }

    // Update formData using the callback function
    setFormData((prevState) => ({ ...prevState, [newStateKey]: actualValue }));

    const serverKey =
      'edit' +
      name
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((word, index) => {
          return index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');

    // Update modifiedValues using the callback function
    setModifiedValues((prevData) => ({
      ...prevData,
      [serverKey]: actualValue,
      email: member[2],
    }));
  }

  const roles = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Past President',
    'Membership Director',
    'Director at Large',
    'Other',
    'Staff'
  ];
  let { data } = useSelector((state) => state.reducer);
  const initialCheckboxStates = {};
  const selectedRoles = data
    .filter((el) => el[2] == formData.memberEmail && el[7] == 'Active')
    .map((el) => el[6]);

  selectedRoles.forEach((el) => {
    initialCheckboxStates[el] = el;
  });

  const [checkboxStates, setCheckboxStates] = useState(initialCheckboxStates);

  const handleCheckboxChange = (roleName) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [roleName]: !prevStates[roleName],
    }));
  };

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

      // Check for phone number format validation
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

    let checkedRolesObjects = roles
      .filter((role) => document.getElementById(role).checked)
      .map((role) => {
        return { roleKey: role, value: true };
      });

    let newModifiedValues = {
      ...modifiedValues,
      ...checkedRolesObjects.reduce((acc, curr) => {
        acc[curr.roleKey] = curr.value;
        return acc;
      }, {}),
    };

    if (!newModifiedValues.email) {
      newModifiedValues.email = member[2];
    }

    if (!newModifiedValues.username) {
      newModifiedValues.username = member[0] + ' ' + member[1];
    }

    if (newModifiedValues.editclubAdmin) {
      // Assuming editclubAdminRef is a ref to the editclubAdmin checkbox
      const editclubAdminCheckbox = managerAccessRef.current;
      if (editclubAdminCheckbox) {
        // Update the value with the checkbox's checked status
        newModifiedValues.editclubAdmin = editclubAdminCheckbox.checked
          ? 'on'
          : 'off';
      }
    }

    if (newModifiedValues.editeffectivedate) {
      newModifiedValues.editeffectivedate = formatDateString(
        newModifiedValues.editeffectivedate
      );
    }

    setModifiedValues(newModifiedValues);

    setActiveSaveButton(true);
    if (isLoading) return;
    setShouldPostEdition(true);
  };

  function formatDateString(dateString) {
    // Split the input string into parts
    const [month, day, year] = dateString.split('/');

    // Create a new Date object using the parts
    const formattedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    // Return the formatted date string
    return formattedDate.toISOString();
  }

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
    setPhonedSet(true);
    setModifiedValues((prevData) => ({
      ...prevData,
      ['editphoneNumber']: phone,
      email: member[2],
    }));
  };

  const editDirectorData = async (modifiedValues) => {
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'modifyClubSheet',
        modifiedValues: modifiedValues,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(APPS_SCRIPT_URL, options);
  };

  useEffect(() => {
    if (shouldPostEdition && !isLoading) {
      const editDirector = async () => {
        setIsLoading(true);
        await editDirectorData(modifiedValues);
        dispatch(fetchData());
        setShouldPostEdition(false);
        setIsLoading(false);
        // setIsEditing(false);
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
          <div className="relative transform overflow-hidden rounded-lg bg-white px-8 text-left shadow-xl transition-all w-[500px] ml-0 md:ml-72 sm:my-8 ">
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
                className="font-medium text-lg md:text-2xl leading-6"
                id="modal-title"
              >
                Edit Director
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
                  id="editMemberName"
                  type="text"
                  value={formData.memberName}
                  onChange={handleInputChange}
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
                  id="editMemberLastName"
                  type="text"
                  value={formData.memberLastName}
                  onChange={handleInputChange}
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
                id="editMemberEmail"
                type="text"
                value={formData.memberEmail}
                onChange={handleInputChange}
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
                id="editMemberPhoneNumber"
                type="text"
                value={phone}
                // onChange={handleInputChange}
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
                  id="editMemberGender"
                  name="Gender"
                  value={formData.memberGender}
                  onChange={handleInputChange}
                  className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                >
                  <option value="" disabled>
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
                  id="editMemberBirthdate"
                  customInput={<input ref={memberBirthdateRef} />}
                  type="text"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date); // Update the startDate with the selected date
                    setDateModified(true); // Set dateModified to true
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
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex mt-2 flex-col gap-4 w-full py-0.5 outline-none"
                  >
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center ml-2">
                        <input
                          ref={memberRoleRef}
                          id={role}
                          // checked={selectedRoles.includes(el) || false} // use the specific checkbox state
                          // name="Role"
                          // type="checkbox"
                          // onChange={() => handleCheckboxChange(el)} // pass 'el' to the handler
                          checked={checkboxStates[role]} // Use the state to set the checked property
                          name="Role"
                          type="checkbox"
                          onChange={() => handleCheckboxChange(role)} // Handle change
                          className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div className="leading-6">
                        <p className="text-sm sm:text-base">{role}</p>
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
                <div className="relative flex gap-x-3">
                  <div className="flex items-center ml-2">
                    <input
                      ref={ameliaAdminRef}
                      id="editMemberAmeliaAdmin"
                      name="Is Amilia admin"
                      type="checkbox"
                      checked={formData.memberAdmin}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
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

                        <span className="group-hover:opacity-100 group-hover:visible transition-opacity bg-white px-1 text-sm text-black rounded-md absolute -translate-x-1/2 sm:-translate-x-1/3 translate-y-9 sm:translate-y-full opacity-0 invisible mx-auto z-50 top-[-10px]">
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
                        id="editManagerAccess"
                        name="Club admin"
                        type="checkbox"
                        checked={formData.memberManager}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
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
                onClick={handleSubmit}
                id="submitAddMember"
                type="submit"
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

export default EditDirectorModal;
