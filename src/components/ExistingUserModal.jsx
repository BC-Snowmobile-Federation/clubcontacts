const ExistingUserModal = ({
  statusUserFound,
  setShowExistingUser,
  setExistingInactiveUser,
  inactiveCheckedRole,
  setIsLoadingInactive,
  isLoadingInactive,
  setActiveSaveButton
}) => {
  function handleYes() {
    setIsLoadingInactive(true);
  }

  function handleExistingClose() {
    setActiveSaveButton(false);
    setShowExistingUser(false)
  }
  return (
    <div
      id="editMemberModal"
      className="relative z-20 ml-[60px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              {statusUserFound == "Active" ? (
                <>
                  <h3
                    className="font-semibold lg:text-base leading-6 text-gray-900"
                    id="modal-title"
                  >
                    This user was found active
                  </h3>

                  <p className="text-base">
                    Please, try editing instead of adding it as new member.
                  </p>
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={handleExistingClose}
                      className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    className="font-semibold lg:text-base leading-6 text-gray-900"
                    id="modal-title"
                  >
                    This user was found inactive.
                  </h3>

                  <p className="text-base">
                    {"Would you like to set it to active with  " +
                      inactiveCheckedRole +
                      " " +
                      "role?"}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isLoadingInactive}
                      onClick={() => setExistingInactiveUser(true)}
                      className="w-[120px] rounded-lg bg-transparent px-3 py-2 border-2 border-[#243570] text-base font-semibold text-[#243570] shadow-sm hover:text-[#535787]"
                    >
                      {isLoadingInactive ? (
                        <div
                          className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-white border-solid rounded-full animate-spin"
                          style={{
                            borderColor: "#535787",
                            borderRightColor: "transparent",
                            width: "1.2rem",
                            height: "1.2rem",
                          }}
                        ></div>
                      ) : (
                        "Yes"
                      )}
                    </button>
                    <button
                      onClick={() => setShowExistingUser(false)}
                      className="w-[120px] ml-2 rounded-lg bg-[#243570] px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-[#535787]"
                    >
                      No
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingUserModal;
