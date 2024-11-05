import { useDispatch } from 'react-redux';
import { APPS_SCRIPT_URL } from '../constants';
import { fetchData } from '../../redux/slice';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'

export default function DeleteDirectorModal({ member, setOpenDeleteModal }) {
  const username = member[0] + ' ' + member[1];
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteDirector = async () => {
    setIsLoading(true);
    const memberData = {
      username,
      email: member[2],
    };
    const data = {
      action: 'deleteMember',
      memberData,
    };

    const options = {
      redirect: 'follow',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    };

    try {
      toast.promise(
        (async () => {
          const response = await fetch(APPS_SCRIPT_URL, options);
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const result = await response.json();

          toast.promise(
            dispatch(fetchData()),
            {
              loading: 'Refreshing view...',
              success: 'Refresh successfully!',
              error: 'Failed to update data. Please try again.',
            }
          );
          return result.message; // Puedes devolver un mensaje específico del resultado
        })(),
        {
          loading: 'Processing deletion...',
          success: 'Deletion completed successfully!',
          error: 'An error occurred while deleting. Please try again.',
        }
      );
      setIsLoading(false);
      setOpenDeleteModal(false);
    } catch (e) {
      console.error('Error during fetch:', e);
      setIsLoading(false);
      setOpenDeleteModal(false);
    }
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
    <div id="popup-modal" className="relative z-10 ml-[40px]">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="flex bg-white ml-0 md:ml-72 rounded-xl">
            <div className="p-4 md:p-5 text-center w-[350px]">
              <div className="text-red-600 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-normal text-gray-900">
                Are you sure you want to delete
              </h3>
              <h3 className="mb-5 text-lg font-normal text-gray-900">
                <span className="font-medium">{username}</span>?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleDeleteDirector}
                  className="w-[140px] rounded-lg bg-transparent px-3 py-2 border-2 border-red-600 text-base font-semibold text-gray-900 shadow-sm hover:bg-red-600 hover:text-white transition-all group"
                >
                  {isLoading ? (
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] group-hover:text-white text-red-600"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleCloseModal}
                  className="w-[140px] rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
