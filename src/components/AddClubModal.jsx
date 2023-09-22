import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClubData } from "../../redux/slice";

const AddClubModal = ({ setOpenAddClubModal }) => {
  const newClubNameRef = useRef();
  const newClubMailingAddressRef = useRef();
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

  const [errorMessages, setErrorMessages] = useState({});
  const [addClubData, setAddClubData] = useState([]);
  const [shouldPostAdd, setShouldPostAdd] = useState(false);
  const [isLoadingAddPost, setIsLoadingAddPost] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    let errors = {};
    const newClubName = newClubNameRef.current.value;
    const newClubMailingAddress = newClubMailingAddressRef.current.value;
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

    // Validation logic
    if (!newClubName) {
      errors["newClubName"] = "Club Name is required";
    }
    if (!newClubMailingAddress) {
      errors["newClubMailingAddress"] = "Club Mailing Address is required";
    }
    if (!newClubTourismRegion) {
      errors["newClubTourismRegion"] = "Club Tourism Region is required";
    }
    if (!newClubMainPhone) {
      errors["newClubMainPhone"] = "Club Main Phone is required";
    }
    if (!newClubGeneralEmail) {
      errors["newClubGeneralEmail"] = "Club General Email is required";
    }
    if (!newClubWebsite) {
      errors["newClubWebsite"] = "Club Website is required";
    }
    if (!newClubBCSocietyNumber) {
      errors["newClubBCSocietyNumber"] = "Club BC Society Number is required";
    }
    if (!newClubFinancialYearEndDate) {
      errors["newClubFinancialYearEndDate"] =
        "Club Financial Year End Date is required";
    }
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(newClubMailingAddress)) {
      errors["newClubMailingAddress"] = "Please enter a valid email";
    }
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(newClubGeneralEmail)) {
      errors["newClubGeneralEmail"] = "Please enter a valid email";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    } else {
      setErrorMessages({});
      setAddClubData([
        newClubName,
        newClubMailingAddress,
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
        "Active"
      ]);
    }

    // If all validations pass, proceed with form submission...
    console.log(addClubData);
    if (isLoadingAddPost) return;
    setShouldPostAdd(true);
  };

  const postAddClub = async (data) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec";

    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        action: "addClub",
        data: data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options);
  };

  useEffect(() => {
    if (shouldPostAdd && !isLoadingAddPost) {
      const addClub = async () => {
        setIsLoadingAddPost(true);
        await postAddClub(addClubData);
        dispatch(fetchClubData());
        setShouldPostAdd(false);
        setIsLoadingAddPost(false);
        setOpenAddClubModal(false);
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

  return (
    <div
      id="addClubModal"
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center ml-[40px] p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[900px] sm:my-8 sm:p-6">
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              <h3
                className=" font-semibold lg:text-sm leading-6 text-gray-900"
                id="modal-title"
              >
                Add Club
              </h3>
              <p>Complete this fields to add new Club.</p>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Name{" "}
              </label>
              <input
                ref={newClubNameRef}
                name="newClubName"
                id="newClubName"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club name"
              />
              <span className="text-red-500">
                {errorMessages["newClubName"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Mailing Address{" "}
              </label>
              <input
                ref={newClubMailingAddressRef}
                name="newClubMailingAddress"
                id="newClubMailingAddress"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club mailing address"
              />
              <span className="text-red-500">
                {errorMessages["newClubMailingAddress"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Tourism Region
              </label>
              <select
                ref={newClubTourismRegionRef}
                name="newClubTourismRegion"
                id="newClubTourismRegion"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-700 px-4 py-2 outline-none cursor-pointer sm:h-[60px] lg:h-[40px]"
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
              <span className="text-red-500">
                {errorMessages["newClubTourismRegion"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Main Phone #{" "}
              </label>
              <input
                ref={newClubMainPhoneRef}
                name="newClubMainPhone"
                id="newClubMainPhone"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club main phone"
              />
              <span className="text-red-500">
                {errorMessages["newClubMainPhone"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club General Email
              </label>
              <input
                ref={newClubGeneralEmailRef}
                name="newClubGeneralEmail"
                id="newClubGeneralEmail"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club general email"
              />
              <span className="text-red-500">
                {errorMessages["newClubGeneralEmail"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club Website{" "}
              </label>
              <input
                ref={newClubWebsiteRef}
                name="newClubWebsite"
                id="newClubWebsite"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club website"
              />
              <span className="text-red-500">
                {errorMessages["newClubWebsite"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Club BC Society Number{" "}
              </label>
              <input
                ref={newClubBCSocietyNumberRef}
                name="newClubBCSocietyNumber"
                id="newClubBCSocietyNumber"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club BC society number"
              />
              <span className="text-red-500">
                {errorMessages["newClubBCSocietyNumber"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                Financial Year End Date{" "}
              </label>
              <input
                ref={newClubFinancialYearEndDateRef}
                name="newClubFinancialYearEndDate"
                id="newClubFinancialYearEndDate"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club financial year end date"
              />
              <span className="text-red-500">
                {errorMessages["newClubFinancialYearEndDate"]}
              </span>
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Club GST Number{" "}
              </label>
              <input
                ref={newClubGSTNumberRef}
                name="newClubGSTNumber"
                id="newClubGSTNumber"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club GST number"
              />
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Club PST Number{" "}
              </label>
              <input
                ref={newClubPSTNumberRef}
                name="newPSTNumber"
                id="newPSTNumber"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert club PST number"
              />
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Club Facebook{" "}
              </label>
              <input
                ref={newClubFacebookRef}
                name="newClubFacebook"
                id="newClubFacebook"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert url"
              />
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Club Instagram{" "}
              </label>
              <input
                ref={newClubInstragramRef}
                name="newClubInstagram"
                id="newClubInstagram"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert url"
              />
            </div>

            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
              <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm">
                Club Tik Tok{" "}
              </label>
              <input
                ref={newClubTikTokRef}
                name="newClubTikTok"
                id="newClubTikTok"
                type="text"
                className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                placeholder="Insert url"
              />
            </div>

            <div
              id="submitButtonsContainer"
              className="mt-5  flex justify-center"
            >
              <button
                id="submitAddClub"
                onClick={handleSubmit}
                type="button"
                className="w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
              >
                {isLoadingAddPost ? (
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
                id="closeAddClubModal"
                type="button"
                onClick={() => setOpenAddClubModal(false)}
                className="w-[120px] mr-2 rounded-lg bg-[#243570] px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-[#535787]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubModal;
