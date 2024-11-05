import { useEffect, useState } from "react";
import axios from "axios";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import ErrorLoginModal from "./ErrorLoginModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClubs, fetchClubData } from "../../redux/slice";
import Spinner from "./Spinner";
import RequestAccess from "./RequestAccess";

function Login({ onUserLogin }) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [makePost, setMakePost] = useState(false);
  const [goToDashboard, setGoToDashboard] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [isUserBcsf, setIsUserBcsf] = useState(null);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.setItem("userInfo", JSON.stringify(response));
      setMakePost(true);
    },
    onError: (error) => console.log(`Login Failed: ${error}`),
  });

  let { clubs } = useSelector((state) => state.reducer);

  const fetchUserData = (userEmail) => {
    return axios
      .get(
        `https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=login&userEmail=${userEmail}`
      )
      .then((response) => {
        const userDataArray = response.data?.response?.userData;
        if (userDataArray && userDataArray.length > 0) {
          setIsLoadingLogin(true);
          localStorage.setItem("activeUser", userEmail);
          const isBcsf = userDataArray.some((data) => data.isBcsf);
          setIsUserBcsf(isBcsf);
          localStorage.setItem("isBcsf", isBcsf);
          let allclubs = [];
          userDataArray.forEach((userData) => {
            if (
              userData.club.includes("British Columbia Snowmobile Federation")
            ) {
              clubs.forEach((el) => {
                localStorage.setItem(
                  el,
                  JSON.stringify({
                    isManager: true,
                  })
                );
                allclubs.push(el);
              });
              localStorage.setItem("clubs", JSON.stringify(allclubs));
            } else {
              localStorage.setItem(
                userData.club,
                JSON.stringify({
                  isManager: userData.isManager,
                })
              );
              allclubs.push(userData.club);
              localStorage.setItem("clubs", JSON.stringify(allclubs));
            }
          });

          onUserLogin(userEmail);
        } else {
          setShowErrorModal(true);
        }
      });
  };

  useEffect(() => {
    if (makePost) {
      setIsLoadingLogin(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          localStorage.setItem("userEmail", JSON.stringify(response.data));
          setUserEmail(response.data);
          return fetchUserData(response.data.email);
        })
        .then(() => {
          if (isUserBcsf !== null) {
            setIsLoadingLogin(false);
            setMakePost(false);
            setGoToDashboard(true);
          }
        })
        .catch((error) => console.log(error))
        .finally(()=>{
          setMakePost(false);
          setIsLoadingLogin(false);
        })
    }
  }, [makePost, isUserBcsf]);

  useEffect(() => {
    const userEmailInStorage = JSON.parse(localStorage.getItem("userEmail"));
    let hasUser = localStorage.getItem("activeUser");
    if (userEmailInStorage && hasUser && goToDashboard) {
      navigate("/dashboard");
    }
  }, [navigate, goToDashboard]);

  useEffect(() => {
    const userEmailInStorage = JSON.parse(localStorage.getItem("userEmail"));
    let hasUser = localStorage.getItem("activeUser");
    if (userEmailInStorage && hasUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const logoStyle = {
    width: "100px",
    height: "auto",
  };

  if (isLoadingLogin) {
    return (
      <div className="flex justify-center m-auto items-center">
        <Spinner />
      </div>
    );
  }

  function handleRequestAccess() {
    setRequestModal(true);
    setShowErrorModal(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white shadow-xl h-[30rem] rounded-lg p-6">
        <div className="flex-grow w-full flex items-center justify-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/628806f87107170399d7b906/daf273e4-d504-4ffd-b5e0-f6c9a9764259/BCSF+Logo+RGB.png?format=1500w"
            alt="BCSF"
            style={logoStyle}
          />
        </div>
        <div className="mt-4 flex justify-center text-center items-center">
          <h2 className="montserrat font-semibold text-[#243746]">
            Login to <br />
            <span className="font-bold">
              British Columbia Snowmobile Federation
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center g-signin2 mt-12">
          <button
            onClick={login}
            className="relative mt-10 flex montserrat items-center w-60 h-[42px] bg-white border border-gray-300 rounded-full shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            <svg
              id="googleIcon"
              className="h-5 w-5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="600px"
              height="600px"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              {" "}
              <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
              <defs> </defs>{" "}
              <g
                id="Icons"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                {" "}
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  {" "}
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </svg>
            <span id="buttonText" className="ml-4">
              Sign in with Google
            </span>
          </button>
        </div>
        {requestModal ? (
          <RequestAccess setRequestModal={setRequestModal} clubs={clubs} userEmail={userEmail}/>
        ) : null}
        {showErrorModal ? (
          <ErrorLoginModal setShowErrorModal={setShowErrorModal}>
            <button
              id="requestAccess"
              onClick={handleRequestAccess}
              className="min-w-[120px] ml-2 rounded-lg bg-[#535787] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#3C3F63] transition-all"
            >
              Request access
            </button>
          </ErrorLoginModal>
        ) : null}
      </div>
    </div>
  );
}

export default Login;
