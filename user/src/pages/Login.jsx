import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (identifier) {
      console.log("Sending OTP to:", identifier);
      setOtpSent(true);
      alert(`OTP sent to ${identifier}`);
    } else {
      alert("Please enter email or mobile number");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginMethod === "password") {
      console.log("Password login:", { identifier, password });
      alert(`Logging in with password using: ${identifier}`);
    } else {
      console.log("OTP login:", { identifier, otp });
      alert(`Logging in with OTP using: ${identifier}`);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp) {
      console.log("Verifying OTP:", { identifier, otp });
      alert(`Logging in with OTP using: ${identifier}`);
    } else {
      alert("Please enter OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[hsl(24,100%,50%)]">
            bharatBazar
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Login to access your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-2 bg-[hsl(24,100%,90%)] p-1 rounded-lg mb-8">
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
              loginMethod === "password"
                ? "bg-white shadow-md text-[hsl(24,100%,50%)]"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setLoginMethod("password");
              setOtpSent(false);
            }}
          >
            Password
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
              loginMethod === "otp"
                ? "bg-white shadow-md text-[hsl(24,100%,50%)]"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setLoginMethod("otp");
              setOtpSent(false);
            }}
          >
            OTP
          </button>
        </div>

        {/* Login Form */}
        <form
          onSubmit={loginMethod === "password" ? handleLogin : handleVerifyOtp}
          className="space-y-5"
        >
          {/* Email/Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Mobile Number
            </label>
            <input
              type="text"
              placeholder="your@email.com or +1234567890"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          {loginMethod === "password" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
              />
            </div>
          )}

          {/* OTP Section */}
          {loginMethod === "otp" && !otpSent && (
            <button
              onClick={handleSendOtp}
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Send OTP
            </button>
          )}

          {loginMethod === "otp" && otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Verify & Login →
              </button>
            </>
          )}

          {/* Password Login Button */}
          {loginMethod === "password" && (
            <button
              type="submit"
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg mt-6"
            >
              Login →
            </button>
          )}
        </form>

        {/* Register Links */}
        <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center space-y-3">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() =>
                navigate(ROUTES.REGISTER, { state: { userType: "buyer" } })
              }
              className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline transition-all duration-300 cursor-pointer"
            >
              Register as Buyer
            </span>
          </p>
          <p className="text-gray-600">
            Want to sell?{" "}
            <span
              onClick={() =>
                navigate(ROUTES.REGISTER, { state: { userType: "seller" } })
              }
              className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline transition-all duration-300 cursor-pointer"
            >
              Register as Seller
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
