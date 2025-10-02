import { useState, useEffect, useRef } from 'react';
import { fetchClubData, fetchData } from '../../redux/slice';
import { useDispatch } from 'react-redux';
import AddClubModal from './AddClubModal';
import DatePicker from 'react-datepicker';

import './Arrow.css';
import { APPS_SCRIPT_URL } from '../constants';
import Spinner from './Spinner';
// eslint-disable-next-line
function ClubProfile({ isBcsf, clubData, uniqueClubValues }) {
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
  }
  const clubMailingAddressRef = useRef(null);
  const clubMailingTownRef = useRef(null);
  const clubMailingProvinceRef = useRef(null);
  const clubTourismRegionRef = useRef(null);
  const clubMainPhoneRef = useRef(null);
  const clubGeneralEmailRef = useRef(null);
  const clubWebsiteRef = useRef(null);
  const clubBCSNumberRef = useRef(null);
  const clubFEYDRef = useRef(null);
  // menu ref
  const menuRef = useRef(null);

  // eslint-disable-next-line
  const [selectedClub, setSelectedClub] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [clubMenuOpen, setClubMenuOpen] = useState('');
  const [clubToDelete, setClubToDelete] = useState('');
  const [postDeleteClub, setPostDeleteClub] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [openAddClubModal, setOpenAddClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isLoadingEditClub, setIsLoadingEditClub] = useState(false);
  const [postingEditClub, setPostingEditClub] = useState(false);
  const [editedDate, setEditedDate] = useState(null);
  const [editErrorsMessages, setEditErrorsMessages] = useState({});
  const fileInputRefs = useRef([]);
  const [allFiles, setAllFiles] = useState([
    { file: '', type: '', expiry: '' },
  ]);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');


  const handleEditClick = (clubName) => {
    setEditErrorsMessages({});
    setEditingClub(clubName);
    setMenuVisible(false);
    //club[7] != "" && club[7] != null ? new Date(club[7]) : null
    for (let i = 0; i < filteredClubs.length; i++) {
      if (filteredClubs[i][0] == clubName) {
        if (filteredClubs[i][7] && filteredClubs[i][7] != '') {
          setEditedDate(new Date(filteredClubs[i][7]));
        }
      }
    }
  };

  const dispatch = useDispatch();

  const postEditClub = async (clubName, editedData) => {
    // let url =
    //   'https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec'; // Your URL here
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'editClubData',
        changes: editedData,
        clubName: clubName,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(APPS_SCRIPT_URL, options);
  };

  const deleteClub = async (clubName) => {
    // let url = `https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=deleteClub&clubName=${encodeURIComponent(
    //   clubName
    // )}`;
    let url = `https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec?action=deleteClub&clubName=${encodeURIComponent(
      clubName
    )}`;

    await fetch(url, {
      mode: 'no-cors',
    });
  };

  useEffect(() => {
    // Apply search and select filters here
    let filtered = JSON.parse(JSON.stringify(clubData));

    if (searchTerm) {
      filtered = filtered.filter((club) =>
        club[0].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClub) {
      filtered = filtered.filter((club) => club[0] === selectedClub);
    }

    filtered.forEach((c) => {
      const addressSplitted = c[1].split(';');
      c.push(addressSplitted[0]);
      if (addressSplitted.length > 1) {
        c.push(addressSplitted[1]);
      }
      if (addressSplitted.length > 2) {
        c.push(addressSplitted[2]);
      }
    });

    setFilteredClubs(filtered);

    if (postDeleteClub == true && !isLoadingPost) {
      const deletePost = async () => {
        setIsLoadingPost(true);
        await deleteClub(clubToDelete);
        dispatch(fetchData());
        dispatch(fetchClubData());
        setPostDeleteClub(false);
        setIsLoadingPost(false);
        setMenuVisible(false);
      };
      deletePost();
    }

    if (postingEditClub == true && !isLoadingEditClub) {
      const editingClubData = async () => {
        setIsLoadingEditClub(true);
        await postEditClub(editingClub, editedData);
        dispatch(fetchClubData());
        setEditingClub(null);
        setPostingEditClub(false);
        setIsLoadingEditClub(false);
        setMenuVisible(false);
        setAllFiles([{ file: '', type: '', expiry: '' }]);
        // postEditClub(false);
      };
      editingClubData();
    }
  }, [
    searchTerm,
    selectedClub,
    clubData,
    clubToDelete,
    postDeleteClub,
    isLoadingPost,
    editingClub,
    editedData,
    isLoadingEditClub,
    postingEditClub,
    editedDate,
    dispatch,
  ]);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleSaveChanges = async () => {
    setEditErrorsMessages({});
    let errors = {};

    if (!clubMailingAddressRef.current.value) {
      errors['editMailingAddress'] = 'Mailing Address is required';
    }
    if (!clubMailingTownRef.current.value) {
      errors['editMailingTown'] = 'Mailing Town is required';
    }
    if (!clubMailingProvinceRef.current.value) {
      errors['editMailingProvince'] = 'Mailing Province is required';
    }
    if (!clubTourismRegionRef.current.value) {
      errors['editTourismRegion'] = 'Tourism Region is required';
    }
    if (!clubMainPhoneRef.current.value) {
      errors['editMainPhone'] = 'Main Phone is required';
    }
    if (!clubGeneralEmailRef.current.value) {
      errors['editGeneralEmail'] = 'General Email is required';
    }
    if (!clubWebsiteRef.current.value) {
      errors['editWebsite'] = 'Website is required';
    }

    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(clubGeneralEmailRef.current.value)) {
      errors['editGeneralEmail'] = 'Please enter a valid email';
    }

    // get the base 64 and validate that type and expiry are not empty in case a file is selected
    const processedFiles = await Promise.all(
      allFiles.map(async (file, index) => {
        if (file.file) {
          // If a file is selected, validate type and expiry date
          if (!file.type) {
            errors[`fileType_${index}`] = 'File type is required';
          }
          if (!file.expiry) {
            errors[`fileExpiry_${index}`] = 'File expiry date is required';
          }

          return {
            file: await convertFileToBase64(file.file),
            type: file.type,
            expiry: file.expiry,
          };
        } else {
          return null;
        }
      })
    );

    if (Object.keys(errors).length > 0) {
      setEditErrorsMessages(errors);
      return;
    }

    // Filter out any null values from processedFiles
    const validFiles = processedFiles.filter((file) => file !== null);

    // Update the editedData with the processed files
    setEditedData((prevData) => {
      const updatedData = { ...prevData };

      if (validFiles.length > 0) {
        updatedData.files = validFiles;
      }

      return updatedData;
    });

    setEditErrorsMessages({});
    setPostingEditClub(true);
  };

  // funcion auxiliar para convertir el file a base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  // funciones para agregar un archivo
  const addFile = () => {
    setAllFiles([...allFiles, { file: '', type: '', expiry: '' }]);
  };
  // funcion para manejar los cambios
  const handleFilesChange = (index, field, value) => {
    const updatedFiles = allFiles.map((file, i) =>
      i === index ? { ...file, [field]: value } : file
    );
    setAllFiles(updatedFiles);
  };
  // funcion para hacer clear de el file input
  const clearFileInput = (index) => {
    fileInputRefs.current[index].value = '';
    handleFilesChange(index, 'file', '');
  };
  // funcion para eliminar un archivo
  const removeFile = (index) => {
    // Remove the file from the state
    const updatedFiles = allFiles.filter((_, i) => i !== index);
    setAllFiles(updatedFiles);

    // Update the file input elements to reflect the correct file names
    updatedFiles.forEach((file, i) => {
      if (fileInputRefs.current[i]) {
        if (file.file) {
          // If the file exists, create a new DataTransfer object to simulate selecting the file
          const dataTransfer = new DataTransfer();
          const newFile = new File([file.file], file.file.name);
          dataTransfer.items.add(newFile);
          fileInputRefs.current[i].files = dataTransfer.files;
        } else {
          // If no file is selected (file is undefined), reset the input
          fileInputRefs.current[i].value = '';
        }
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingClub(null);
    setMenuVisible(false);
  };

  function handleInputChange(label, value, club = null) {
    let newValue = value;
    let labelToChange = label;
    let addressArray = ['', '', ''];
    if ('Club Mailing Address' in editedData) {
      const splittedMailingAddress =
        editedData['Club Mailing Address'].split(';');
      addressArray[0] = splittedMailingAddress[0] || club[15] || '';
      addressArray[1] = splittedMailingAddress[1] || club[16] || '';
      addressArray[2] = splittedMailingAddress[2] || club[17] || '';
    }
    if (label == 'Club Mailing Address') {
      addressArray[0] = value;
      newValue = addressArray.join(';');
      labelToChange = 'Club Mailing Address';
    } else if (label == 'Club Mailing Town') {
      addressArray[1] = value;
      newValue = addressArray.join(';');
      labelToChange = 'Club Mailing Address';
    }
    if (label == 'Club Mailing Province') {
      addressArray[2] = value;
      newValue = addressArray.join(';');
      labelToChange = 'Club Mailing Address';
    }

    setEditedData((prevData) => ({
      ...prevData,
      [labelToChange]: newValue,
    }));
  }

  const handleOpenMenu = (clubname) => {
    if (menuVisible == false) {
      setIsLoadingEditClub(false);
      setMenuVisible(true);
      setClubMenuOpen(clubname);
    } else {
      setDeleteConfirmation('')
      setMenuVisible(false);
    }
  };

  // functions to handle menu closing after clicking outside
  // Function to handle click outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
      setDeleteConfirmation('');
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the menu
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // const handleDeleteClub = (clubname) => {
  //   setClubToDelete(clubname);
  //   setPostDeleteClub(true);
  // };

  const handleDeleteClub = (clubName) => {
    if (deleteConfirmation === clubName) {
      // If the user clicks again, perform the delete action
      setClubToDelete(clubName);
      setPostDeleteClub(true);
      setDeleteConfirmation(''); // Reset confirmation state after delete
    } else {
      // Set the confirmation state to the clicked club
      setDeleteConfirmation(clubName);
  
      // // Optionally, reset the confirmation state after a timeout if the user doesn't confirm
      // setTimeout(() => {
      //   setDeleteConfirmation('');
      // }, 5000); // Reset after 5 seconds if not confirmed
    }
  };
  

  const handleOpenAddClubModal = () => {
    setMenuVisible(false);
    setOpenAddClubModal(true);
  };

  const cancelButton = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );

  const editButton = (
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
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );

  const deleteIcon = (
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
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );

  return (
    <div>
      {isBcsf ? (
        <>
          <div className="flex justify-end">
            <button
              id="addClubBtn"
              type="button"
              onClick={handleOpenAddClubModal}
              className="w-[130px] mb-4 mr-4 sm:mr-2 right-0 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all"
            >
              Add Club
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-col justify-center items-center">
        {isBcsf ? (
          <>
            <div>
              <div className="flex items-center mb-8 justify-center flex-col lg:flex-row gap-4">
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
                <div className="bg-slate-100 rounded-full w-[250px] h-10 items-center flex justify-around">
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
                    className="px-2 rounded-full w-[210px] statusSelect bg-transparent appearance-none border-0 pr-8 focus:outline-none focus:ring-0 focus:border-none text-sm"
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
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="flex flex-wrap justify-center items-start">
          <div className="w-full p-4">
            {openAddClubModal ? (
              <AddClubModal setOpenAddClubModal={setOpenAddClubModal} />
            ) : (
              <></>
            )}
            <ul
              role="list"
              id="clubsProfileContainer"
              className={
                filteredClubs.length >= 2
                  ? 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-8 xl:gap-x-8 flex justify-center items-center'
                  : 'flex justify-center items-center'
              }
            >
              {filteredClubs &&
                // eslint-disable-next-line
                filteredClubs.map((club, index) => {
                  return (
                    <li
                      key={index}
                      className="overflow-hidden montserrat rounded-xl border border-gray-200 w-[358px] sm:w-[416px]"
                    >
                      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                        <div className="text-base font-semibold leading-6 text-[#243746]">
                          {club[0]}
                        </div>
                        {JSON.parse(localStorage.getItem(club[0]) || '{}')
                          .isManager ? (
                          <div className="relative ml-auto">
                            {editingClub === club[0] ? (
                              isLoadingEditClub ? (
                                <div className="flex justify-center items-center h-6 w-6">
                                  <div
                                    className="inline-block text-[#535787] h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                  >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                      Loading...
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <button
                                    className="text-base font-semibold border border-[#535787] px-3 py-1 text-[#535787] rounded-xl hover:bg-[#535787] hover:text-white transition-all"
                                    onClick={() => handleSaveChanges(club[0])}
                                  >
                                    Save
                                    <span className="sr-only">, {club[0]}</span>
                                  </button>
                                  <button
                                    className="font-semibold text-base text-[#535787] cursor-pointer bg-transparent ml-2"
                                    onClick={handleCancelEdit}
                                  >
                                    {cancelButton}
                                    <span className="sr-only">, {club[0]}</span>
                                  </button>
                                </div>
                              )
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenMenu(club[0])}
                                  className="menu-button -m-2.5 block p-1.5 text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                                  id={`options-menu-${index}-button`}
                                  aria-expanded="false"
                                  aria-haspopup="true"
                                >
                                  <span className="sr-only">Open options</span>
                                  <svg
                                    className="h-5 w-5 rotate-90"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                  </svg>
                                </button>
                                {menuVisible && club[0] === clubMenuOpen && (
                                  <div
                                    ref={menuRef}
                                    className="dropdown-menu absolute right-0 z-10 mt-0.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby={`options-menu-${index}-button`}
                                    tabIndex="-1"
                                  >
                                    {isLoadingPost || isLoadingEditClub ? (
                                      <div className="flex justify-center items-center w-full h-24">
                                        <div
                                          className={`inline-block ${isLoadingPost ? 'text-red-600' : 'text-[#535787]'} h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] self-center`}
                                          role="status"
                                        >
                                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                            Loading...
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="flex items-center">
                                          <button
                                            className="block w-full mx-2 py-1 text-sm leading-6 text-gray-900 delete-button flex items-center gap-2 mb-1 rounded-md hover:bg-gray-100 transition-all pl-2"
                                            role="menuitem"
                                            onClick={() =>
                                              handleEditClick(club[0])
                                            }
                                            tabIndex="-1"
                                            id={`options-menu-${index}-item-2`}
                                          >
                                            {editButton} Edit club
                                            <span className="sr-only">
                                              , {club[0]}
                                            </span>
                                          </button>
                                        </div>
                                        {isBcsf && (
                                          <div className="border-t flex items-center">
                                            <button
                                              className="block w-full mx-2 py-1 text-sm leading-6 text-red-600 delete-button flex items-center text-left mt-2 rounded-md hover:bg-red-600 hover:text-white transition-all pr-6 pl-2"
                                              role="menuitem"
                                              onClick={() =>
                                                handleDeleteClub(club[0])
                                              }
                                              tabIndex="-1"
                                              id={`options-menu-${index}-item-1`}
                                            >
                                              <span className="mr-2">{deleteIcon}</span> {deleteConfirmation === club[0] ? 'Click again to confirm' : 'Delete club'}
                                              <span className="sr-only">
                                                , {club[0]}
                                              </span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                        {isBcsf ? (
                          <>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Address
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingAddressRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Address',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[15] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingAddress']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[15] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Town
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingTownRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Town',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[16] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingTown']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[16] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Province
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingProvinceRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Province',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[17] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingProvince']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[17] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                          </>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Address
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingAddressRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Address',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[16] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingAddress']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[16] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Town
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingTownRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Town',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[17] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingTown']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[17] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-3 gap-x-2">
                              <dt className="basis-1/2 text-gray-500">
                                Club Mailing Province
                              </dt>
                              {editingClub === club[0] ? (
                                <div className="basis-1/2 flex flex-col items-end">
                                  <input
                                    className="border text-sm rounded-md w-full px-2 py-1"
                                    ref={clubMailingProvinceRef}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'Club Mailing Province',
                                        e.target.value,
                                        club
                                      )
                                    }
                                    defaultValue={club[18] || ''}
                                  />
                                  <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                    {editErrorsMessages['editMailingProvince']}
                                  </span>
                                </div>
                              ) : (
                                <dd className="flex items-center justify-end basis-1/2">
                                  <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                    {club[18] || ''}
                                  </div>
                                </dd>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Tourism Region
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <select
                                className="border text-sm rounded-md w-full px-2 py-1"
                                ref={clubTourismRegionRef}
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Tourism Region',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[2]}
                              >
                                <option selected disabled value="">
                                  Select club tourism region
                                </option>
                                <option value="Cariboo Chilcotin Coast">
                                  Cariboo Chilcotin Coast
                                </option>
                                <option value="Northern">Northern</option>
                                <option value="Kootenay Rockies">
                                  Kootenay Rockies
                                </option>
                                <option value="Thompson Okanagan">
                                  Thompson Okanagan
                                </option>
                                <option value="Vancouver Island">
                                  Vancouver Island
                                </option>
                                <option value="Vancouver Coast">
                                  Vancouver Coast
                                </option>
                              </select>
                              <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                {editErrorsMessages['editTourismRegion']}
                              </span>
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[2]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Main Phone #
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                ref={clubMainPhoneRef}
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Main Phone',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[3]}
                              />
                              <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                {editErrorsMessages['editMainPhone']}
                              </span>
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[3]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club General Email
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                ref={clubGeneralEmailRef}
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club General Email',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[4]}
                              />
                              <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                {editErrorsMessages['editGeneralEmail']}
                              </span>
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[4]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Website
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                ref={clubWebsiteRef}
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Website',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[5]}
                              />
                              <span className="text-red-600 text-xs self-start ml-1 mt-1">
                                {editErrorsMessages['editWebsite']}
                              </span>
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[5]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club BC Society Number
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                ref={clubBCSNumberRef}
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club BC Society Number',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[6]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[6]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Financial Year End Date
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col">
                              <DatePicker
                                name="Financial Year End Date"
                                type="text"
                                selected={editedDate}
                                onChange={(date) => {
                                  setEditedDate(date);
                                  handleInputChange(
                                    'Financial Year End Date',
                                    formatDate(date)
                                  ); // Set dateModified to true
                                }}
                                className="border text-sm rounded-md px-2 py-1 w-full"
                                ref={clubFEYDRef}
                                placeholderText="Insert effective date"
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[7] ? formatDate(club[7]) : ''}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club GST Number
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club GST Number',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[8]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[8]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club PST Number
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club PST Number',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[9]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[9]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Facebook
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Facebook',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[10]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[10]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Instagram
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Instagram',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[11]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[11]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club Tik Tok
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club Tik Tok',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[12]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[12]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-3 gap-x-2">
                          <dt className="basis-1/2 text-gray-500">
                            Club YouTube Channel
                          </dt>
                          {editingClub === club[0] ? (
                            <div className="basis-1/2 flex flex-col items-end">
                              <input
                                className="border text-sm rounded-md w-full px-2 py-1"
                                onChange={(e) =>
                                  handleInputChange(
                                    'Club YouTube Channel',
                                    e.target.value
                                  )
                                }
                                defaultValue={club[13]}
                              />
                            </div>
                          ) : (
                            <dd className="flex items-center justify-end basis-1/2">
                              <div className="text-right font-medium text-gray-900 max-w-[159px] sm:max-w-[188px] text-wrap truncate">
                                {club[13]}
                              </div>
                            </dd>
                          )}
                        </div>
                        {editingClub === club[0] && (
                          <div className="flex flex-col justify-between gap-x-4 py-3">
                            {allFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex flex-col border shadow-md rounded mt-2 p-1 sm:p-2 mx-1"
                              >
                                <div className="flex flex-col w-full px-1 outline-none">
                                  <label className="ml-2 text-left montserrat font-semibold">
                                    File
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      ref={(el) =>
                                        (fileInputRefs.current[index] = el)
                                      }
                                      type="file"
                                      className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                                      onChange={(e) =>
                                        handleFilesChange(
                                          index,
                                          'file',
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                    <button
                                      onClick={() => clearFileInput(index)}
                                      className="px-4 mt-1 py-1.5 border border-gray-400 rounded-md"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>

                                <div className="flex sm:gap-2">
                                  <div className="flex flex-col w-full py-1 px-1 outline-none">
                                    <label className="mt-2 ml-2 text-left montserrat font-semibold">
                                      Type
                                    </label>
                                    <select
                                      className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                                      value={file.type}
                                      onChange={(e) =>
                                        handleFilesChange(
                                          index,
                                          'type',
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="" selected>
                                        Select type
                                      </option>
                                      <option value="Land Agreement">
                                        Land Agreement
                                      </option>
                                      <option value="Insurance Document">
                                        Insurance Document
                                      </option>
                                      <option value="Annual Society Report">
                                        Annual Society Report
                                      </option>
                                      <option value="Other">Other</option>
                                    </select>
                                    <span className="text-red-600 text-xs mt-1 ml-2">
                                      {editErrorsMessages[`fileType_${index}`]}
                                    </span>
                                  </div>

                                  <div className="flex flex-col w-full py-1 px-1 outline-none">
                                    <label className="mt-2 ml-2 text-left montserrat font-semibold">
                                      Expiry date
                                    </label>
                                    <input
                                      type="date"
                                      className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                                      value={file.expiry}
                                      onChange={(e) =>
                                        handleFilesChange(
                                          index,
                                          'expiry',
                                          e.target.value
                                        )
                                      }
                                    />
                                    <span className="text-red-600 text-xs mt-1 ml-2">
                                      {
                                        editErrorsMessages[
                                          `fileExpiry_${index}`
                                        ]
                                      }
                                    </span>
                                  </div>
                                </div>
                                {allFiles.length > 1 && (
                                  <div className="flex justify-end p-2">
                                    <button onClick={() => removeFile(index)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-5 mt-1 text-red-600"
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
                            ))}
                            <div className="flex items-center justify-center gap-10 mt-4 mb-8">
                              <button type="button" onClick={addFile}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </dl>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubProfile;
