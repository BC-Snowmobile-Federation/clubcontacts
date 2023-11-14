import axios from "axios";
import { useRef, useState } from "react";
import Spinner from "./Spinner";

const RequestAccessForm = ({ setRequestModal }) => {
  const emailRequestRef = useRef(null);
  const [requestSent, setRequestSent] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  function handleSendRequest() {
    setIsLoadingRequest(true);
    let email = emailRequestRef.current.value;
    console.log(email);
    return axios
      .get(
        `https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=requestAccess&email=${email}`
      )
      .then((response) => {
        setIsLoadingRequest(false);
        setRequestSent(true);
      });
  }

  function handleCloseRequest() {
    setRequestModal(false);
  }

  return (
    <div
      id="editMemberModal"
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              {isLoadingRequest ? (
                <div className="p-12">
                <Spinner />
                </div>
              ) : requestSent ? (
                <h3
                  className="font-semibold lg:text-base leading-6 text-gray-900"
                  id="modal-title"
                >
                  Success!
                </h3>
              ) : (
                <>
                  <h3
                    className="font-semibold lg:text-base leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Request access
                  </h3>

                  <p className="text-base">
                    Please, provide the email you would like to login with.
                  </p>
                  <div className="justify-start mt-4">
                    <div className="mt-2">
                      <input
                        type="email"
                        ref={emailRequestRef}
                        name="email"
                        id="email"
                        className="w-64 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
                onClick={handleCloseRequest}
              >
                Close
              </button>
              {!requestSent && (
                <button
                  className="w-[120px] ml-2 rounded-lg bg-[#243570] px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-[#535787]"
                  onClick={handleSendRequest}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccessForm;
