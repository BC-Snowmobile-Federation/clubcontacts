// RequestForm.jsx
import { useState, useRef } from 'react';
import { APPS_SCRIPT_URL } from '../constants';

const RequestForm = ({ setRequestSent, setIsLoadingRequest, clubs }) => {
  const emailRequestRef = useRef(null);
  const [role, setRole] = useState('manager'); // Default to 'manager'
  const [selectedClub, setSelectedClub] = useState(''); // Store selected club
  const [errors, setErrors] = useState({ email: '', club: '' });

  const clubsList = role === 'manager' ? ['All Clubs', ...clubs] : clubs;

  function validateFields() {
    let valid = true;
    const newErrors = { email: '', club: '' };

    if (!emailRequestRef.current.value) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailRequestRef.current.value)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }

    if (!selectedClub) {
      newErrors.club = 'Club selection is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSendRequest() {
    if (!validateFields()) {
      return;
    }

    setIsLoadingRequest(true);
    const email = emailRequestRef.current.value;
    const requestData = {
      email,
      role,
      club: selectedClub,
      action: 'requestingAccess'
    };
    console.log(requestData);

    try {
      const response = await fetch(`${APPS_SCRIPT_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestData),
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsLoadingRequest(false);
      setRequestSent(true);
    } catch (error) {
      setIsLoadingRequest(false);
      console.error('Error sending request:', error);
    }
  }

  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <div className="flex flex-col items-start">
        <input
          type="email"
          ref={emailRequestRef}
          name="email"
          id="email"
          className={`w-64 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            errors.email ? 'ring-red-600' : ''
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1 ml-2">{errors.email}</p>
        )}
      </div>
      <div className="flex flex-col items-start">
        <select
          className={`w-64 mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            errors.club ? 'ring-red-600' : ''
          }`}
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
        >
          <option value="">Select a club</option>
          {clubsList.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>
        {errors.club && (
          <p className="text-red-600 text-xs mt-1 ml-2">{errors.club}</p>
        )}
      </div>
      <div className="flex flex-col items-start">
        <select
          className="w-64 mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            if (e.target.value === 'member' && selectedClub === 'All Clubs') {
              setSelectedClub('');
            }
          }}
        >
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>
      </div>
      <button
        id="send-request-btn"
        className="hidden"
        onClick={handleSendRequest}
      >
        Send Request
      </button>
    </div>
  );
};

export default RequestForm;
