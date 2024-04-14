import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackCircle, IoNotifications, IoWarning } from "react-icons/io5";
import axios from "axios";
import moment from "moment-timezone";
import CameraLogs from "./CameraLogs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addCrimeReport } from "../../redux/userAction";

const LiveVideoFeed = ({ setActiveComponent, reportLocation }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const [notification, setNotification] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kolkata"));
  const [newReports, setNewReports] = useState([]);
  const [location, setLocation] = useState({ latitude: 21.1458, longitude: 79.0882 });


  const personalDetails = useSelector(state => state.user.personalDetails);

  

  useEffect(() => {
    console.log("Personal Details updated:", personalDetails);
  }, [personalDetails]);
  

  useEffect(() => {
    if (personalDetails && personalDetails.latitude && personalDetails.longitude) {
      setLocation({
        latitude: personalDetails.latitude,
        longitude: personalDetails.longitude,
      });
    }
  }, [personalDetails]);

  

      

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check for the supported MIME type
      const options = { mimeType: "video/webm; codecs=vp9" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn(
          `${options.mimeType} is not supported, trying different codec.`
        );
        options.mimeType = "video/webm; codecs=vp8";
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} is not supported either.`);
          options.mimeType = ""; // Let the browser choose the codec
        }
      }


      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          sendVideoToServer(event.data);
        }
      };

      const startRecording = () => {
        setIsRecording(true);
        mediaRecorderRef.current.start();
        setNotification("Recording...");

        setTimeout(() => {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          setNotification("Processing...");
        }, 50000); // Stop recording after 20 seconds
      };

      // Start recording immediately and then every 30 seconds
      startRecording();
      const recordingInterval = setInterval(startRecording, 60000);

      return () => {
        clearInterval(recordingInterval);
        stream.getTracks().forEach((track) => track.stop());
      };
    });

    const clockInterval = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Kolkata"));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const sendInformation = async (prediction, location, currentTime) => {
    const formData = new FormData();
    formData.append('prediction', prediction);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    formData.append('timestamp', currentTime.format('YYYY-MM-DD HH:mm:ss'));
  
    try {
      const response = await axios.post('https://getform.io/f/paygypja', formData);
      console.log('Information sent successfully:', response.data);
    } catch (error) {
      console.error('Failed to send information:', error);
    }
  };

  const sendVideoToServer = async (videoBlob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", videoBlob);

    try {
      const response = await axios.post(
        "http://localhost:5000/classify-video",
        formData
      );
      const prediction = response.data.predicted_category;
      console.log("Prediction:", prediction);
      const message =
        prediction === "NormalVideos"
          ? "Normal activity detected."
          : `Alert: ${prediction} detected!`;

          sendInformation(prediction, location, currentTime);

         

          
      setNotification(message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();

  const handleNewReport = (crimeType) => {
      const newReport = {
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm:ss"),
        type: crimeType,
        reported: true,
      };
  
      // Dispatch the action with the new report
      dispatch(addCrimeReport(newReport));
  };
  const reportCrimeAndLocation = async () => {
    console.log("Attempting to report crime at location:", location);
  
    if (location.latitude && location.longitude) {
      reportLocation(location);
      handleNewReport("Robbery"); // Assuming "Robbery" is a placeholder
    } else {
      console.error("Location data is not available.");
    }
  };

 
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-4">
      <h1 className="text-2xl font-bold mb-2">Live Video Feed</h1>
      {/* Video Feed and Controls Container */}
      <div className="flex flex-col w-full max-w-5xl px-8 lg:flex-row">
        {/* Video Feed */}
        <div className="flex-1 mb-4 lg:mb-0 lg:mr-4">
          <div className="bg-black relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full"
              style={{ maxHeight: "600px" }}
            ></video>
            <div className="absolute top-0 left-0 m-4">
              <button
                onClick={() => setActiveComponent("")}
                className="text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-full flex items-center"
              >
                <IoArrowBackCircle className="mr-2" />
                Back
              </button>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center bg-sky-200 p-4 rounded shadow-md">
            <span className="font-bold">{notification}</span>
            <button
              onClick={reportCrimeAndLocation}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <IoWarning className="mr-2" />
              Report
            </button>
          </div>
        </div>

        {/* Camera Logs */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow-md overflow-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            Garud Patrol Logs
          </h2>
          <CameraLogs newReports={newReports} />
        </div>
      </div>

      {/* Status Indicator */}
      {isRecording || isLoading ? (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-full shadow-md">
          <span className="font-bold">
            {isRecording ? "Recording..." : "Analyzing..."}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default LiveVideoFeed;
