import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

const AdminAccess = () => {
  const logoStyle = {
    width: "100px",
    height: "auto",
  };

  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showClubs, setShowClubs] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const clubToMakeAdmin = useRef();
  const userRequestAdmin = useRef();
  const userFullName = useRef();

  const navigate = useNavigate();

  let { clubs } = useSelector((state) => state.reducer);
  let userClubs = JSON.parse(localStorage.getItem("clubs"));
  let userData = JSON.parse(localStorage.getItem("userEmail"));

  useEffect(() => {
    if (userClubs && userClubs.length > 0) {
      let clubsToShow = [];
      userClubs.forEach((element) => {
        if (JSON.parse(localStorage.getItem(element)).isManager == false) {
          clubsToShow.push(element);
        }
      });
      setShowClubs(clubsToShow);
      setLoadingClubs(false);
    } else {
      setLoadingClubs(true);
    }
  }, []);

  async function request() {
    let clubToRequest = clubToMakeAdmin.current.value;
    let url = `https://script.google.com/macros/s/AKfycbz0voHFfq9AWnCqtwKKBdHDHFmdGrnbvUAiqdYY6H42T1YP-slsOKT1nzENqCR1dul5/exec`;
    let params;
    let errors = {};
    if (userData) {
      let email = userData.email;
      let user = userData.name;
      params = `action=requestAccess&club=${encodeURI(
        clubToRequest
      )}&user=${encodeURI(user)}&email=${encodeURI(email)}`;
    } else {
      let userRequest = userRequestAdmin.current.value;
      let fullName = userFullName.current.value;
      params = `action=requestAccess&club=${encodeURI(
        clubToRequest
      )}&user=${encodeURI(fullName)}&email=${encodeURI(userRequest)}`;
      if (userRequest === "") {
        errors["userAdmin"] = "Please, insert your email";
      }

      if (fullName === "") {
        errors["username"] = "Please, insert your full name";
      }
    }

    if (clubToRequest === "") {
      errors["clubToRequest"] = "Please, select a club";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    } else {
      setLoading(true);
      setErrorMessages({});
      let response = await fetch(`${url}?${params}`);
      if (response.status == 200) {
        setSuccessMessage(true);
        setLoading(false);
      }
    }
  }

  function goToDashboard() {
    navigate("/dashboard");
  }

  if (loadingClubs && clubs.length < 1) {
    return (
      <div className="flex justify-center m-auto items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
      <div
        className={
          userData
            ? "bg-white shadow-xl h-[24rem] rounded-lg p-6"
            : "bg-white shadow-xl h-[38rem] rounded-lg p-6"
        }
      >
        <div className="flex-grow w-[500px] flex items-center justify-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/628806f87107170399d7b906/daf273e4-d504-4ffd-b5e0-f6c9a9764259/BCSF+Logo+RGB.png?format=1500w"
            alt="BCSF"
            style={logoStyle}
          />
        </div>
        {successMessage ? (
          <div className="flex flex-col items-center justify-center mt-[70px]">
            <p className="font-semibold text-lg text-green-500">Success!</p>
            <p>
              If access is granted, please remember to log in again to the
              application.
            </p>
            <button
              onClick={goToDashboard}
              id="requestAccess"
              className="relative flex mt-6 justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex justify-center text-center items-center">
              <h2 className="montserrat font-semibold text-[#243746]">
                Request
                <span className="font-bold"> Admin Access</span>
              </h2>
            </div>
            {showClubs.length < 1 && userData ? (
              <div className="flex flex-col items-center justify-center mt-4">
                <p>You are already admin of all your Clubs.</p>
                <button
                  onClick={goToDashboard}
                  id="requestAccess"
                  className="relative flex mt-6 justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : showClubs.length >= 1 && userData ? (
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
                  <label className="text-left montserrat text-gray-700">
                    Choose the club you want admin access:
                  </label>
                  <select
                    ref={clubToMakeAdmin}
                    name="newClubTourismRegion"
                    id="newClubTourismRegion"
                    className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-700 px-4 py-2 outline-none cursor-pointer sm:h-[60px] lg:h-[40px]"
                  >
                    <option selected disabled value="">
                      Select club
                    </option>
                    {clubs.map((el) => (
                      <option key={el} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                  <span className="text-red-500 italic -mt-2 ml-1">
                    {errorMessages["clubToRequest"]}
                  </span>
                </div>
                <button
                  onClick={request}
                  id="requestAccess"
                  className="relative flex mt-4 justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {loading ? (
                    <div
                      className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-solid rounded-full animate-spin"
                      style={{
                        borderColor: "#D6D7E1",
                        borderRightColor: "transparent",
                        width: "1.2rem",
                        height: "1.2rem",
                        marginTop: "1px",
                      }}
                    ></div>
                  ) : (
                    "Request access"
                  )}
                </button>
                <button
                  onClick={goToDashboard}
                  id="requestAccess"
                  className="relative flex mt-2 justify-center items-center montserrat w-60 h-[42px] bg-white text-[#243746] border border-[#243746] rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center mt-4">
                  <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
                    <label className="text-left montserrat text-gray-700">
                      Email:
                    </label>
                    <input
                      ref={userRequestAdmin}
                      name="userRequestAdmin"
                      id="userRequestAdmin"
                      type="text"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                      placeholder="Email of the user you want to make admin"
                    />
                    <span className="text-red-500 italic -mt-2 ml-1">
                      {errorMessages["userAdmin"]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
                    <label className="text-left montserrat text-gray-700">
                      Full Name:
                    </label>
                    <input
                      ref={userFullName}
                      name="userFullName"
                      id="userFullName"
                      type="text"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
                      placeholder="Email of the user you want to make admin"
                    />
                    <span className="text-red-500 italic -mt-2 ml-1">
                      {errorMessages["username"]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
                    <label className="text-left montserrat text-gray-700">
                      Choose the club you want admin access:
                    </label>
                    <select
                      ref={clubToMakeAdmin}
                      name="newClubTourismRegion"
                      id="newClubTourismRegion"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-700 px-4 py-2 outline-none cursor-pointer sm:h-[60px] lg:h-[40px]"
                    >
                      <option selected disabled value="">
                        Select club
                      </option>
                      {clubs.map((el) => (
                        <option key={el} value={el}>
                          {el}
                        </option>
                      ))}
                    </select>
                    <span className="text-red-500 italic -mt-2 ml-1">
                      {errorMessages["clubToRequest"]}
                    </span>
                  </div>
                  <button
                    onClick={request}
                    id="requestAccess"
                    className="relative flex mt-4 justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {loading ? (
                      <div
                        className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-solid rounded-full animate-spin"
                        style={{
                          borderColor: "#D6D7E1",
                          borderRightColor: "transparent",
                          width: "1.2rem",
                          height: "1.2rem",
                          marginTop: "1px",
                        }}
                      ></div>
                    ) : (
                      "Request access"
                    )}
                  </button>
                  <button
                    onClick={goToDashboard}
                    id="requestAccess"
                    className="relative flex mt-2 justify-center items-center montserrat w-60 h-[42px] bg-white text-[#243746] border border-[#243746] rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAccess;
