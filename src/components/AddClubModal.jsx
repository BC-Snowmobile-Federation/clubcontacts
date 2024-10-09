import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubData, fetchData } from '../../redux/slice';
import AddGWSGroup from './AddGWSGroup';
import ModalAllowPostComponent from './ModalAllowPost';
import { APPS_SCRIPT_URL } from '../constants';

const AddClubModal = ({ setOpenAddClubModal }) => {
  const newClubNameRef = useRef();
  // const newClubMailingAddressRef = useRef();
  const newClubMailingAddressRef = useRef();
  const newClubMailingTownRef = useRef();
  const newClubMailingProvinceRef = useRef();
  const newClubTourismRegionRef = useRef();
  const newClubMainPhoneRef = useRef();
  const newClubGeneralEmailRef = useRef();
  const newClubWebsiteRef = useRef();
  const newClubBCSocietyNumberRef = useRef();
  const newClubFinancialYearEndDateRef = useRef();
  const newClubGSTNumberRef = useRef();
  const newClubPSTNumberRef = useRef();
  const newClubFacebookRef = useRef();
  const newClubInstragramRef = useRef();
  const newClubTikTokRef = useRef();
  const newClubYouTubeRef = useRef();
  const newClubLandAgreementFileRef = useRef();
  const newClubLandAgreementTypeRef = useRef();
  const newClubLandAgreementExpiryDateRef = useRef();
  const fileInputRefs = useRef([]);
  const [allFiles, setAllFiles] = useState([
    { file: '', type: '', expiry: '' },
  ]);

  const [errorMessages, setErrorMessages] = useState({});
  const [addClubData, setAddClubData] = useState([]);
  const [shouldPostAdd, setShouldPostAdd] = useState(false);
  const [isLoadingAddPost, setIsLoadingAddPost] = useState(false);
  const [addGwsGroup, setAddGwsGroup] = useState(false);
  const [modalAllowPost, setModalAllowPost] = useState(false);

  let { clubData } = useSelector((state) => state.reducer);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    let errors = {};
    const newClubName = newClubNameRef.current.value;
    let clubExists = clubData.some(
      (subarray) => subarray[0].toLowerCase() === newClubName.toLowerCase()
    );
    if (clubExists) {
      setModalAllowPost(true);
      return;
    }
    // const newClubMailingAddress = newClubMailingAddressRef.current.value;
    const newClubTourismRegion = newClubTourismRegionRef.current.value;
    const newClubMainPhone = newClubMainPhoneRef.current.value;
    const newClubGeneralEmail = newClubGeneralEmailRef.current.value;
    const newClubWebsite = newClubWebsiteRef.current.value;
    const newClubBCSocietyNumber = newClubBCSocietyNumberRef.current.value;
    const newClubFinancialYearEndDate =
      newClubFinancialYearEndDateRef.current.value;
    const newClubGSTNumber = newClubGSTNumberRef.current.value;
    const newClubPSTNumber = newClubPSTNumberRef.current.value;
    const newClubFacebook = newClubFacebookRef.current.value;
    const newClubInstragram = newClubInstragramRef.current.value;
    const newClubTikTok = newClubTikTokRef.current.value;
    const newClubYouTube = newClubYouTubeRef.current.value;
    const newClubMailingAddress = newClubMailingAddressRef.current.value;
    const newClubMailingTown = newClubMailingTownRef.current.value;
    const newClubMailingProvince = newClubMailingProvinceRef.current.value;
    // const newClubLandAgreementFile =
    //   newClubLandAgreementFileRef.current.files[0];
    // const newClubLandAgreementType = newClubLandAgreementTypeRef.current.value;
    // const newClubLandAgreementExpiryDate =
    //   newClubLandAgreementExpiryDateRef.current.value;

    // // format files to base64
    // let newClubLandAgreementBase64 = '';
    // if (newClubLandAgreementFile) {
    //   newClubLandAgreementBase64 = await convertFileToBase64(
    //     newClubLandAgreementFile
    //   );
    // }

    // Concatenate address, town, and province
    const fullMailingAddress = `${newClubMailingAddress}; ${newClubMailingTown}; ${newClubMailingProvince}`;

    if (!newClubName) {
      errors['newClubName'] = 'Club Name is required';
    }
    if (!newClubMailingAddress) {
      errors['newClubMailingAddress'] = 'Club Mailing Address is required';
    }
    if (!newClubMailingTown) {
      errors['newClubMailingTown'] = 'Club Mailing Town is required';
    }
    if (!newClubMailingProvince) {
      errors['newClubMailingProvince'] = 'Club Mailing Province is required';
    }
    if (!newClubTourismRegion) {
      errors['newClubTourismRegion'] = 'Club Tourism Region is required';
    }
    if (!newClubMainPhone) {
      errors['newClubMainPhone'] = 'Club Main Phone is required';
    }
    if (!newClubGeneralEmail) {
      errors['newClubGeneralEmail'] = 'Club General Email is required';
    }
    if (!newClubWebsite) {
      errors['newClubWebsite'] = 'Club Website is required';
    }
    // if (!newClubBCSocietyNumber) {
    //   errors['newClubBCSocietyNumber'] = 'Club BC Society Number is required';
    // }
    // if (!newClubFinancialYearEndDate) {
    //   errors['newClubFinancialYearEndDate'] =
    //     'Club Financial Year End Date is required';
    // }
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(newClubGeneralEmail)) {
      errors['newClubGeneralEmail'] = 'Please enter a valid email';
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
      setErrorMessages(errors);
      return;
    } else {
      setErrorMessages({});
      setAddClubData([
        newClubName,
        fullMailingAddress,
        newClubTourismRegion,
        newClubMainPhone,
        newClubGeneralEmail,
        newClubWebsite,
        newClubBCSocietyNumber,
        newClubFinancialYearEndDate,
        newClubGSTNumber,
        newClubPSTNumber,
        newClubFacebook,
        newClubInstragram,
        newClubTikTok,
        newClubYouTube,
        'Active',
        processedFiles,
        // newClubLandAgreementBase64,
        // newClubLandAgreementType,
        // newClubLandAgreementExpiryDate,
      ]);
    }

    if (isLoadingAddPost) return;
    setShouldPostAdd(true);
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

  // funcion que manda la data
  const postAddClub = async (data) => {
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: JSON.stringify({
        action: 'addClub',
        data: data,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await fetch(APPS_SCRIPT_URL, options);
  };

  const handleCheckGroups = () => {
    checkGWSGroup().then((resp) => {
      if (!resp.includes('No GWS Group')) {
        setOpenAddClubModal(false);
      } else {
        setAddGwsGroup(true);
      }
    });
  };

  async function checkGWSGroup() {
    let url =
      'https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=getGwsGroups&clubName=' +
      encodeURIComponent(newClubNameRef.current.value);

    let response = await fetch(url);
    let json = await response.json();
    return json.response;
  }

  useEffect(() => {
    if (shouldPostAdd && !isLoadingAddPost) {
      const addClub = async () => {
        setIsLoadingAddPost(true);
        await postAddClub(addClubData);
        dispatch(fetchClubData());
        localStorage.setItem(
          addClubData[0],
          JSON.stringify({ isManager: true })
        );
        setShouldPostAdd(false);
        setIsLoadingAddPost(false);
        handleCheckGroups();
        dispatch(fetchData());
      };
      addClub();
    }
  }, [
    shouldPostAdd,
    addClubData,
    isLoadingAddPost,
    setOpenAddClubModal,
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
      id="addClubModal"
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {addGwsGroup && (
        <AddGWSGroup
          setAddGwsGroup={setAddGwsGroup}
          clubName={newClubNameRef.current.value}
          setOpenAddClubModal={setOpenAddClubModal}
        />
      )}
      {modalAllowPost && (
        <ModalAllowPostComponent setModalAllowPost={setModalAllowPost} />
      )}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center lg:ml-72 p-4 text-center sm:items-center sm:p-0 mb-20">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[500px] sm:my-8 sm:p-6">
            <div className=" text-center text-sm montserrat">
              <h3
                className="font-medium text-lg md:text-2xl leading-6"
                id="modal-title"
              >
                Add Club
              </h3>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Name{' '}
              </label>
              <input
                ref={newClubNameRef}
                name="newClubName"
                id="newClubName"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club name"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubName']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Mailing Address{' '}
              </label>
              <input
                ref={newClubMailingAddressRef}
                name="newClubMailingAddress"
                id="newClubMailingAddress"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club mailing address"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubMailingAddress']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Mailing Town{' '}
              </label>
              <input
                ref={newClubMailingTownRef}
                name="newClubMailingTown"
                id="newClubMailingTown"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club mailing town"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubMailingTown']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Mailing Province{' '}
              </label>
              <input
                ref={newClubMailingProvinceRef}
                name="newClubMailingProvince"
                id="newClubMailingProvince"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club mailing province"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubMailingProvince']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Tourism Region
              </label>
              <select
                ref={newClubTourismRegionRef}
                name="newClubTourismRegion"
                id="newClubTourismRegion"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
              >
                <option selected disabled value="">
                  Select club tourism region
                </option>
                <option>Cariboo Chilcotin Coast</option>
                <option>Northern</option>
                <option>Kootenay Rockies</option>
                <option>Thompson Okanagan</option>
                <option>Vancouver Island</option>
                <option>Vancouver Coast</option>
              </select>
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubTourismRegion']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Main Phone #{' '}
              </label>
              <input
                ref={newClubMainPhoneRef}
                name="newClubMainPhone"
                id="newClubMainPhone"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club main phone"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubMainPhone']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club General Email
              </label>
              <input
                ref={newClubGeneralEmailRef}
                name="newClubGeneralEmail"
                id="newClubGeneralEmail"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club general email"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubGeneralEmail']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Website{' '}
              </label>
              <input
                ref={newClubWebsiteRef}
                name="newClubWebsite"
                id="newClubWebsite"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club website"
              />
              <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubWebsite']}
              </span>
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club BC Society Number{' '}
              </label>
              <input
                ref={newClubBCSocietyNumberRef}
                name="newClubBCSocietyNumber"
                id="newClubBCSocietyNumber"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club BC society number"
              />
              {/* <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubBCSocietyNumber']}
              </span> */}
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Financial Year End Date{' '}
              </label>
              <input
                ref={newClubFinancialYearEndDateRef}
                name="newClubFinancialYearEndDate"
                id="newClubFinancialYearEndDate"
                type="date"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club financial year end date"
              />
              {/* <span className="text-red-600 text-xs mt-1 ml-2">
                {errorMessages['newClubFinancialYearEndDate']}
              </span> */}
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club GST Number{' '}
              </label>
              <input
                ref={newClubGSTNumberRef}
                name="newClubGSTNumber"
                id="newClubGSTNumber"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club GST number"
              />
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club PST Number{' '}
              </label>
              <input
                ref={newClubPSTNumberRef}
                name="newPSTNumber"
                id="newPSTNumber"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert club PST number"
              />
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club Facebook{' '}
              </label>
              <input
                ref={newClubFacebookRef}
                name="newClubFacebook"
                id="newClubFacebook"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert url"
              />
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club Instagram{' '}
              </label>
              <input
                ref={newClubInstragramRef}
                name="newClubInstagram"
                id="newClubInstagram"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert url"
              />
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club Tik Tok{' '}
              </label>
              <input
                ref={newClubTikTokRef}
                name="newClubTikTok"
                id="newClubTikTok"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert url"
              />
            </div>

            <div className="flex flex-col w-full py-1 px-1 outline-none">
              <label className="mt-2 ml-2 text-left montserrat font-semibold">
                Club YouTube{' '}
              </label>
              <input
                ref={newClubYouTubeRef}
                name="newClubYoutube"
                id="newClubYoutube"
                type="text"
                className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                placeholder="Insert url"
              />
            </div>

            {allFiles.map((file, index) => (
              <div
                key={index}
                className="flex flex-col border shadow-md rounded mt-2 p-2 mx-1"
              >
                <div className="flex flex-col w-full px-1 outline-none">
                  <label className="ml-2 text-left montserrat font-semibold">
                    File
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      type="file"
                      className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                      onChange={(e) =>
                        handleFilesChange(index, 'file', e.target.files[0])
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

                <div className="flex gap-2">
                  <div className="flex flex-col w-full py-1 px-1 outline-none">
                    <label className="mt-2 ml-2 text-left montserrat font-semibold">
                      Type
                    </label>
                    <select
                      className="bg-white w-full rounded-md border border-gray-400 px-2 py-1.5 mt-1"
                      value={file.type}
                      onChange={(e) =>
                        handleFilesChange(index, 'type', e.target.value)
                      }
                    >
                      <option value="" selected>
                        Select type
                      </option>
                      <option value="Land Agreement">Land Agreement</option>
                      <option value="Insurance Document">
                        Insurance Document
                      </option>
                      <option value="Annual Society Report">
                        Annual Society Report
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>
                    <span className="text-red-600 text-xs mt-1 ml-2">
                      {errorMessages[`fileType_${index}`]}
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
                        handleFilesChange(index, 'expiry', e.target.value)
                      }
                    />
                    <span className="text-red-600 text-xs mt-1 ml-2">
                      {errorMessages[`fileExpiry_${index}`]}
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

            <div
              id="submitButtonsContainer"
              className="mt-5  flex justify-center"
            >
              <button
                id="closeAddClubModal"
                type="button"
                onClick={() => setOpenAddClubModal(false)}
                className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-red-600 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all mr-4"
              >
                Cancel
              </button>
              <button
                id="submitAddClub"
                onClick={handleSubmit}
                type="button"
                className={
                  isLoadingAddPost
                    ? 'w-[120px] mr-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] hover:text-[#535787] transition-all'
                    : 'w-[120px] mr-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all'
                }
              >
                {isLoadingAddPost ? (
                  <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                ) : (
                  'Add Club'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubModal;
