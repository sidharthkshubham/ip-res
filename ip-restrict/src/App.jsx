import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState({
    allowed: false,
    message: "",
    loading: true,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        const validateResponse = await fetch(
          `http://localhost:3000/api/v1/validate?ip=${userIp}`
        );
        const validateData = await validateResponse.json();

        setStatus({
          allowed: validateData.allowed,
          message: validateData.message,
          loading: false,
        });
      } catch (error) {
        setStatus({
          allowed: false,
          message: "Error checking access. Please try again later.",
          loading: false,
        });
      }
    };

    checkAccess();
  }, []);

  if (status.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-5 text-lg">Checking your access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      status.allowed 
        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
        : 'bg-gradient-to-br from-pink-400 to-red-500'
    }`}>
      <div className="max-w-lg w-full mx-5">
        <div className={`rounded-2xl shadow-2xl p-10 text-center text-white ${
          status.allowed ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-5xl">
              {status.allowed ? '✓' : '✗'}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-5">
            {status.allowed ? "Access Granted! ✓" : "Access Denied ✗"}
          </h1>

          <p className="text-xl mb-5 font-medium">
            {status.allowed
              ? "You are allowed to access this service"
              : status.message.includes("blocked")
              ? "User IP is banned"
              : "Area restricted"}
          </p>

          <div className="mt-8 p-5 bg-white/90 rounded-lg text-gray-800">
            <p className="text-base">{status.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
