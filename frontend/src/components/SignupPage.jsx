import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserRole } from "../redux/userAction";
import bg from "../assets/Background.png";
import cctvimg from "../assets/cctv.png";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell } from "react-icons/fa"; // Importing additional icons

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Since Servilancepartner is always false, it's not included in the form state
  const handleSubmit = async (role) => {
    // Preventing the default form submission logic
    const userData = {
      Username: username,
      Useremail: email,
      Password: password,
      Servilancepartner: false, // Always false, regardless of the role
    };

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const result = await response.json();
      console.log(result);
      // Using the role to decide navigation
      dispatch(setUserRole(role));
      if (role === "surveillancePartner") {
        navigate("/details");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSubmitSurvillance = (role) => {
    if (role === "surveillancePartner") {
      navigate("/details");
    }
  };
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <img
        src={cctvimg}
        alt="CCTV Camera"
        className="absolute left-0 top-0 w-64 animate-moveCCTV"
      />
      <div className="absolute top-0 right-0 mt-2 mr-4 text-xs">
        <select className="bg-transparent w-full backdrop-blur-2xl text-white rounded p-2 ">
          <option value="en" className="text-black">
            English (UK)
          </option>
        </select>
      </div>
      <div
        className="max-w-lg w-full p-16 flex flex-col gap-2 mt-1 rounded-xl shadow-md relative ml-16"
        style={{
          borderTop: "2px solid #4881C8",
          borderLeft: "2px solid #4881C8",
          borderBottom: "6px solid #4881C8",
          borderRight: "2px solid #4881C8",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(2px)",
        }}
      >
        <h2 className="text-white text-xl font-medium mb-2">Create Account</h2>
        <div className="flex justify-between mb-4">
          <button className="flex items-center justify-center px-4 py-2 text-xs border-2 border-blue-500 text-white rounded shadow-sm hover:bg-blue-600 duration-700">
            <SiGoogle className="mr-2" size={20} /> Sign up with Google
          </button>
          <button className="flex items-center justify-center px-3 py-2 text-xs border-2 border-blue-500 text-white rounded shadow-sm hover:bg-blue-600 duration-700">
            <SiFacebook className="mr-2" size={20} /> Sign up with Facebook
          </button>
        </div>
        <div className="text-center my-2 text-white">-OR-</div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-transparent text-white outline-none border-b-2 border-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-2 bg-transparent text-white outline-none border-b-2 border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 bg-transparent text-white outline-none border-b-2 border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-0 mt-3 mr-2 cursor-pointer"
            >
              {showPassword ? (
                <HiEye size={20} color="white" />
              ) : (
                <HiEyeOff size={20} color="white" />
              )}
            </span>
          </div>
        </div>
        <div className="py-4 mt-4 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => handleSubmitSurvillance("surveillancePartner")}
            className="w-full p-2 text-center bg-gradient-to-r text-sm from-blue-700 to-sky-400 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-sky-500 duration-1000"
          >
            Register as Surveillance Partner
          </button>
          <h6 className="text-center text-white text-xs">-OR-</h6>
          <button
            type="button"
            onClick={() => handleSubmit("safetyAlertsUser")}
            className="w-full p-2 text-center bg-gradient-to-r text-sm from-blue-700 to-sky-400 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-sky-500 duration-1000"
          >
            Sign Up for Safety Alerts
          </button>
        </div>
        <div className="text-center text-white text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 w-72 right-0 mb-2 mr-4">
        <img src="reverselogo.png" alt="" />
      </div>
      <div className="absolute left-0 bottom-0 lg:left-10 lg:bottom-10 p-6 space-y-6 bg-opacity-90 backdrop-filter backdrop-blur-md rounded-lg shadow-2xl text-white max-w-md">
        <h2 className="text-1xl font-bold mb-4 flex items-center text-yellow-400">
          <FaShieldAlt className="mr-3" size={20} />
          Join Our Community
        </h2>
        <p className="text-sm leading-relaxed">
          <FaShieldAlt className="mr-2 text-yellow-400" size={16} />
          As a <strong className="text-yellow-300">Surveillance Partner</strong>
          , you play a vital role in enhancing public safety. Share your camera
          feeds and alert the community to real-time incidents.
        </p>
        <p className="text-sm leading-relaxed">
          <FaBell className="mr-2 text-yellow-400" size={16} />
          By signing up for{" "}
          <strong className="text-yellow-300">Safety Alerts</strong>, you'll
          receive timely updates about incidents in your area. Stay informed,
          stay safe.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
