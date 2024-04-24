import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

const GrandAdminAccess = () => {
  const logoStyle = {
    width: "100px",
    height: "auto",
  };

  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showClubs, setShowClubs] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const clubToMakeAdmin = useRef();
  const userToMakeAdmin = useRef();

  const navigate = useNavigate();

  let { data } = useSelector((state) => state.reducer);

  useEffect(() => {
    if (data && data.length > 0) {
      let clubsToShow = Array.from(
        new Set(
          data
            .map((item) => item[11])
            .filter((item) => item !== undefined && item !== null)
        )
      );

      setShowClubs(clubsToShow);
      setLoadingClubs(false); 
    } else {
      setLoadingClubs(true);
    }
  }, [data]);

  async function request() {
    let clubToRequest = clubToMakeAdmin.current.value;
    let userAdminRequest = userToMakeAdmin.current.value;
    let url = `https://script.google.com/macros/s/AKfycbz0voHFfq9AWnCqtwKKBdHDHFmdGrnbvUAiqdYY6H42T1YP-slsOKT1nzENqCR1dul5/exec`;
    let params = `action=grantAccess&club=${encodeURI(
      clubToRequest
    )}&email=${encodeURI(userAdminRequest)}`;
    let errors = {};

    if (clubToRequest === "") {
      errors["clubToRequest"] = "Please, select a club";
    }

    if (userAdminRequest === "") {
      errors["userAdmin"] = "Please, enter a user";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    } else {
      setLoading(true);
      setErrorMessages({});
      let response = await fetch(`${url}?${params}`);
      if (response.status == 200) {
        let respJson = await response.json();
        if (respJson.message == "Not found") {
          setErrorMessage(true);
          setLoading(false);
        } else {
          setSuccessMessage(true);
          setLoading(false);
        }
      }
    }
  }

  function goToDashboard() {
    navigate("/dashboard");
  }

  function reset() {
    setErrorMessage(false);
    setSuccessMessage(false);
  }

  if (loadingClubs && showClubs.length == 0) {
    return (
        <Spinner />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white shadow-xl h-[34rem] rounded-lg p-6">
        <div className="flex-grow w-[500px] flex items-center justify-center m-auto">
          <img
            src="https://images.squarespace-cdn.com/content/v1/628806f87107170399d7b906/daf273e4-d504-4ffd-b5e0-f6c9a9764259/BCSF+Logo+RGB.png?format=1500w"
            alt="BCSF"
            style={logoStyle}
          />
        </div>
        { successMessage ? (
          <div className="flex flex-col items-center justify-center mt-[70px]">
            <p className="font-semibold text-lg text-green-500">Success!</p>
            <p className="text-center">
              {userToMakeAdmin.current.value} now has admin access to{" "}
              {clubToMakeAdmin.current.value}.
              <br />
              Remember the user has to log in again to the application to see
              changes.
            </p>
            <button
              onClick={goToDashboard}
              id="requestAccess"
              className="relative flex mt-[100px] justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Go to Dashboard
            </button>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center m-auto mt-[70px]">
            <p className="font-semibold text-lg text-red-500">Error!</p>
            <p className="text-center">
              {userToMakeAdmin.current.value} was not found or doesnt belong to{" "}
              {clubToMakeAdmin.current.value}.
            </p>
            <button
              onClick={reset}
              id="requestAccess"
              className="relative flex mt-[100px] justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Try again
            </button>
            <button
              onClick={goToDashboard}
              id="requestAccess"
              className="relative flex mt-2 justify-center items-center montserrat w-60 h-[42px] bg-white text-[#243746] border border-[#243746] rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex justify-center text-center items-center">
              <h2 className="montserrat font-semibold text-[#243746]">
                Grant
                <span className="font-bold"> Admin Access</span>
              </h2>
            </div>
            {showClubs.length < 1 && loadingClubs == false ? (
              <div className="flex flex-col items-center justify-center mt-4">
                <p>This user is already admin of all its Clubs.</p>
                <button
                  onClick={goToDashboard}
                  id="requestAccess"
                  className="relative flex mt-6 justify-center items-center montserrat w-60 h-[42px] bg-[#243746] text-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-[#4F5664] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  ">
                  <label className="text-left montserrat text-gray-700">
                    User:
                  </label>
                  <input
                    ref={userToMakeAdmin}
                    name="userToMakeAdmin"
                    id="userToMakeAdmin"
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
                    Club:
                  </label>
                  <select
                    ref={clubToMakeAdmin}
                    name="newClubTourismRegion"
                    id="newClubTourismRegion"
                    className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-700 px-4 py-2 outline-none cursor-pointer sm:h-[60px] lg:h-[40px]"
                  >
                    <option selected disabled value="">
                      Club you want to give admin access
                    </option>
                    {showClubs.map((el) => (
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
                    "Submit"
                  )}
                </button>
                <button
                  onClick={goToDashboard}
                  id="requestAccess"
                  className="relative flex mt-2 justify-center items-center montserrat w-60 h-[42px] bg-white text-[#243746] border border-[#243746] rounded-full shadow-md px-6 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GrandAdminAccess;
