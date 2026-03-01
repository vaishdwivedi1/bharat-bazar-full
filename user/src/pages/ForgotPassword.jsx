import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { POSTMethod } from "../utils/service";
import { StaticAPI } from "../utils/StaticApi";
import { ROUTES } from "../utils/StaticRoutes";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Key,
  Edit2,
  ArrowLeftCircle,
} from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Identify, 2: Verify, 3: Reset, 4: Success

  // Form data
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [maskedContact, setMaskedContact] = useState("");

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of multiple digits
      const pastedValue = value.replace(/\D/g, "").slice(0, 6);
      const newOtp = [...otp];

      for (let i = 0; i < pastedValue.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = pastedValue[i];
        }
      }

      setOtp(newOtp);

      // Focus on the next empty input or last filled
      const nextIndex = Math.min(index + pastedValue.length, 5);
      if (nextIndex < 6) {
        otpRefs.current[nextIndex]?.focus();
      }
    } else {
      // Handle single digit
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, "");
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus on the next empty input
      const nextIndex = Math.min(pastedData.length, 5);
      if (nextIndex < 6) {
        otpRefs.current[nextIndex]?.focus();
      }
    }
  };

  // Function to mask email
  const maskEmail = (email) => {
    const parts = email.split("@");
    if (parts.length !== 2) return email;

    const name = parts[0];
    const domain = parts[1];

    if (name.length <= 3) {
      return name + "***@" + domain;
    } else {
      return name.slice(0, 3) + "***" + name.slice(-2) + "@" + domain;
    }
  };

  // Step 1: Identify account
  const handleIdentifyAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier) {
      setError("Please enter email or mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await POSTMethod(StaticAPI.forgotPassword, {
        identifier: identifier,
      });

      if (response?.data?._id) {
        setEmail(response?.data?.email);

        await POSTMethod(StaticAPI.sendOTP, {
          email: response?.data?.email,
        });

        // Mask email for display
        const masked = maskEmail(response?.data?.email);
        setMaskedContact(masked);

        setCurrentStep(2);
        startResendTimer();
        setSuccess(`OTP sent to ${masked}`);
      } else {
        setError(response.data.message || "Account not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  // Go back to edit email (step 1)
  const handleEditEmail = () => {
    setCurrentStep(1);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await POSTMethod(StaticAPI.verifyOTP, {
        email,
        otp: otpString,
      });

      setCurrentStep(3);
      setSuccess("OTP verified successfully");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      const response = await POSTMethod(StaticAPI.sendOTP, {
        email,
      });

      if (response.data.success) {
        startResendTimer();
        setSuccess(`OTP resent to ${maskedContact}`);
        // Clear OTP fields
        setOtp(["", "", "", "", "", ""]);
        // Focus first OTP field
        otpRefs.current[0]?.focus();
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      setError("Password must contain at least one letter and one number");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await POSTMethod(StaticAPI.resetPassword, {
        email,
        password: newPassword,
      });

      setCurrentStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-[hsl(24,100%,90%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-[hsl(24,100%,50%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Find Your Account
              </h3>
              <p className="text-gray-600 text-sm">
                Enter your email or mobile number to reset your password
              </p>
            </div>

            <form onSubmit={handleIdentifyAccount} className="space-y-4">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Continue"}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-sm text-[hsl(24,100%,50%)] hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-[hsl(24,100%,90%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-[hsl(24,100%,50%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verify Your Identity
              </h3>

              {/* Email display with edit button - NO API CALL, just go back to step 1 */}
              <div className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600 text-sm font-medium">
                  {maskedContact}
                </span>
                <button
                  onClick={handleEditEmail}
                  className="text-[hsl(24,100%,50%)] hover:text-[hsl(24,100%,40%)] flex items-center gap-1 text-xs font-medium"
                  title="Edit email"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
              </div>

              <p className="text-gray-600 text-sm mt-2">
                We sent a verification code to your email
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={loading}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6}
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm text-[hsl(24,100%,50%)] hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-[hsl(24,100%,90%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-10 h-10 text-[hsl(24,100%,50%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create New Password
              </h3>
              <p className="text-gray-600 text-sm">
                Your new password must be different from previous passwords
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars with letter & number"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min 8 characters with at least one letter and one number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Password Updated Successfully
            </h3>

            <p className="text-gray-600 text-sm">
              Your password has been reset. You can now log in with your new
              password.
            </p>

            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(24,100%,50%)] to-[hsl(24,100%,40%)] p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[hsl(24,100%,50%)]">
            bharatBazar
          </h1>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Render current step */}
        {renderStep()}
      </div>
    </div>
  );
};

export default ForgotPassword;
