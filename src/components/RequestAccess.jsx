// RequestAccess.jsx
import { useState } from 'react';
import Spinner from './Spinner'; // Ensure this component is available
import RequestForm from './RequestForm'; // Import the form component

const RequestAccess = ({ setRequestModal, clubs, userEmail }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

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
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-[450px] sm:my-8 sm:p-6">
            <div className="text-center text-sm montserrat">
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
                    Request Access
                  </h3>
                  <RequestForm
                    setRequestSent={setRequestSent}
                    setIsLoadingRequest={setIsLoadingRequest}
                    clubs={clubs}
                    userEmail={userEmail}
                  />
                </>
              )}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-red-600 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
                onClick={handleCloseRequest}
              >
                Close
              </button>
              {!requestSent && (
                <button
                  className="w-[120px] ml-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all"
                  onClick={() => document.getElementById('send-request-btn').click()}
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

export default RequestAccess;
