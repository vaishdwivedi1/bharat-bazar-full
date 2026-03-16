// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { POSTMethod } from "../utils/service";
import { StaticAPI } from "../utils/StaticApi";
import { ROUTES } from "../utils/StaticRoutes";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setOtp("");

    if (!identifier) {
      setError("Please enter email or mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await POSTMethod(StaticAPI.sendOTP, {
        email: identifier,
      });

      setOtpSent(true);
      toast.success(`OTP sent to ${identifier}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter email/mobile and password");
      return;
    }

    setLoading(true);
    try {
      // Determine if identifier is email or mobile
      const isEmail = identifier.includes("@");

      const loginData = isEmail
        ? { email: identifier, password }
        : { mobile: identifier, password };

      const response = await POSTMethod(StaticAPI.login, loginData);
      console.log({ response });

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect based on user role
      const userRole = response.data.role;
      if (userRole === "seller") {
        navigate(ROUTES.SELLER_DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const isEmail = identifier.includes("@");

      const loginData = isEmail
        ? { email: identifier, otp, purpose: "login" }
        : { mobile: identifier, otp, purpose: "login" };

      const response = await POSTMethod(StaticAPI.verifyOTP, loginData);

      if (response.data._id) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));

        // Redirect based on user role
        const userRole = response.data.role;
        if (userRole === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-gray-900">bharat</span>
            <span className="text-[hsl(24,100%,50%)]">B</span>
            <span className="text-gray-900">azar</span>
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Login to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

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
              setError("");
              setShowPassword(false);
            }}
            disabled={loading}
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
              setError("");
              setShowPassword(false);
            }}
            disabled={loading}
          >
            OTP
          </button>
        </div>

        {/* Login Form */}
        <form
          onSubmit={
            loginMethod === "password" ? handlePasswordLogin : handleOtpLogin
          }
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
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input with Eye Icon */}
          {loginMethod === "password" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* OTP Section */}
          {loginMethod === "otp" && !otpSent && (
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Sending..." : "Send OTP"}
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? "Verifying..." : "Verify & Login →"}
              </button>
            </>
          )}

          {/* Password Login Button */}
          {loginMethod === "password" && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          )}
        </form>

        {/* Forgot Password Link */}
        {loginMethod === "password" && (
          <div className="text-right mt-2">
            <button
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              className="text-sm text-[hsl(24,100%,50%)] hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Resend OTP for OTP method */}
        {loginMethod === "otp" && otpSent && (
          <div className="text-center mt-2">
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-sm text-[hsl(24,100%,50%)] hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        )}

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
