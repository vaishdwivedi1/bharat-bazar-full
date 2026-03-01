import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Registration type state
  const [userType, setUserType] = useState("buyer"); // "buyer" or "seller"

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Common form data (for both buyer and seller)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Seller-specific data
  const [sellerData, setSellerData] = useState({
    // Company Details (Step 2)
    companyName: "",
    companyType: "", // Proprietorship, Partnership, Pvt Ltd, LLP, etc.
    gstNumber: "",
    gstCertificate: null,
    panNumber: "",
    panCard: null,
    businessWebsite: "",
    businessDescription: "",

    // Address Details (Step 3)
    personalAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    companyAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    sameAsPersonalAddress: false,

    // Bank Details (Step 4)
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "current", // savings, current
    upiId: "",
    cancelledCheque: null,
  });

  const [fileNames, setFileNames] = useState({
    gstCertificate: "",
    panCard: "",
    cancelledCheque: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;
    setSellerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (type, field, value) => {
    setSellerData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSellerData((prev) => ({
        ...prev,
        [field]: file,
      }));
      setFileNames((prev) => ({
        ...prev,
        [field]: file.name,
      }));
    }
  };

  const handleSameAsPersonalChange = (e) => {
    const checked = e.target.checked;
    setSellerData((prev) => ({
      ...prev,
      sameAsPersonalAddress: checked,
      companyAddress: checked
        ? { ...prev.personalAddress }
        : prev.companyAddress,
    }));
  };

  const validateStep1 = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all required fields!");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters!");
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      alert("Password must contain at least one letter and one number!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !sellerData.companyName ||
      !sellerData.companyType ||
      !sellerData.gstNumber ||
      !sellerData.panNumber
    ) {
      alert("Please fill all required company details!");
      return false;
    }
    if (!sellerData.gstCertificate) {
      alert("Please upload GST certificate!");
      return false;
    }
    if (!sellerData.panCard) {
      alert("Please upload PAN card!");
      return false;
    }
    // Basic GST validation (15 characters)
    if (sellerData.gstNumber.length !== 15) {
      alert("GST number should be 15 characters!");
      return false;
    }
    // Basic PAN validation (10 characters)
    if (sellerData.panNumber.length !== 10) {
      alert("PAN number should be 10 characters!");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const { personalAddress, companyAddress } = sellerData;

    if (
      !personalAddress.addressLine1 ||
      !personalAddress.city ||
      !personalAddress.state ||
      !personalAddress.pincode
    ) {
      alert("Please fill all personal address fields!");
      return false;
    }

    if (!sellerData.sameAsPersonalAddress) {
      if (
        !companyAddress.addressLine1 ||
        !companyAddress.city ||
        !companyAddress.state ||
        !companyAddress.pincode
      ) {
        alert("Please fill all company address fields!");
        return false;
      }
    }
    return true;
  };

  const validateStep4 = () => {
    if (
      !sellerData.accountHolderName ||
      !sellerData.accountNumber ||
      !sellerData.ifscCode ||
      !sellerData.bankName
    ) {
      alert("Please fill all bank details!");
      return false;
    }
    if (sellerData.accountNumber !== sellerData.confirmAccountNumber) {
      alert("Account numbers don't match!");
      return false;
    }
    if (!sellerData.cancelledCheque) {
      alert("Please upload cancelled cheque!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === "buyer") {
      if (validateStep1()) {
        console.log("Buyer Registration:", formData);
        alert("Registration successful as Buyer!");
        navigate(ROUTES.LOGIN);
      }
    } else {
      // Seller registration steps
      if (currentStep === 1 && validateStep1()) {
        setCurrentStep(2);
      } else if (currentStep === 2 && validateStep2()) {
        setCurrentStep(3);
      } else if (currentStep === 3 && validateStep3()) {
        setCurrentStep(4);
      } else if (currentStep === 4 && validateStep4()) {
        // Final submission
        const completeData = {
          ...formData,
          sellerData,
        };
        console.log("Seller Registration Complete:", completeData);
        alert(
          "Seller registration successful! Your application will be verified.",
        );
        navigate(ROUTES.LOGIN);
      }
    }
  };

  useEffect(() => {
    if (location.state) {
      if (typeof location.state === "string") {
        setUserType(location.state);
      } else if (
        typeof location.state === "object" &&
        location.state.userType
      ) {
        setUserType(location.state.userType);
      }
    }
  }, [location.state]);

  const companyTypes = [
    "Proprietorship",
    "Partnership",
    "Private Limited",
    "Public Limited",
    "LLP",
    "One Person Company",
    "Section 8 Company",
    "Other",
  ];

  const accountTypes = ["Current", "Savings", "Cash Credit", "Overdraft"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[hsl(24,100%,50%)]">
            bharatBazar
          </h1>
        </div>

        {/* Progress Steps - Only for Seller */}
        {userType === "seller" && (
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-[hsl(24,100%,50%)] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {step === 1
                    ? "Account"
                    : step === 2
                      ? "Company"
                      : step === 3
                        ? "Address"
                        : "Bank"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Common for both Buyer and Seller */}
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 8 chars with letter & number"
                    required
                    minLength="8"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Company Details (Seller only) */}
          {userType === "seller" && currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Company Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={sellerData.companyName}
                  onChange={handleSellerInputChange}
                  placeholder="Enter company name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="companyType"
                  value={sellerData.companyType}
                  onChange={handleSellerInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                >
                  <option value="">Select Company Type</option>
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={sellerData.gstNumber}
                    onChange={handleSellerInputChange}
                    placeholder="15-digit GST number"
                    required
                    maxLength="15"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={sellerData.panNumber}
                    onChange={handleSellerInputChange}
                    placeholder="10-digit PAN number"
                    required
                    maxLength="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "gstCertificate")}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                  {fileNames.gstCertificate && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {fileNames.gstCertificate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "panCard")}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                  {fileNames.panCard && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {fileNames.panCard}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Website (Optional)
                </label>
                <input
                  type="url"
                  name="businessWebsite"
                  value={sellerData.businessWebsite}
                  onChange={handleSellerInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description (Optional)
                </label>
                <textarea
                  name="businessDescription"
                  value={sellerData.businessDescription}
                  onChange={handleSellerInputChange}
                  placeholder="Tell us about your business"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* Step 3: Address Details (Seller only) */}
          {userType === "seller" && currentStep === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Address Details
              </h2>

              <div className="space-y-6">
                {/* Personal Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Personal Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={sellerData.personalAddress.addressLine1}
                      onChange={(e) =>
                        handleAddressChange(
                          "personalAddress",
                          "addressLine1",
                          e.target.value,
                        )
                      }
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={sellerData.personalAddress.addressLine2}
                      onChange={(e) =>
                        handleAddressChange(
                          "personalAddress",
                          "addressLine2",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City *"
                        value={sellerData.personalAddress.city}
                        onChange={(e) =>
                          handleAddressChange(
                            "personalAddress",
                            "city",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={sellerData.personalAddress.state}
                        onChange={(e) =>
                          handleAddressChange(
                            "personalAddress",
                            "state",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Pincode *"
                        value={sellerData.personalAddress.pincode}
                        onChange={(e) =>
                          handleAddressChange(
                            "personalAddress",
                            "pincode",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={sellerData.personalAddress.country}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-700">
                      Company Address
                    </h3>
                    <label className="ml-4 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sellerData.sameAsPersonalAddress}
                        onChange={handleSameAsPersonalChange}
                        className="w-4 h-4 text-[hsl(24,100%,50%)]"
                      />
                      <span className="text-sm text-gray-600">
                        Same as personal address
                      </span>
                    </label>
                  </div>

                  {!sellerData.sameAsPersonalAddress && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Address Line 1 *"
                        value={sellerData.companyAddress.addressLine1}
                        onChange={(e) =>
                          handleAddressChange(
                            "companyAddress",
                            "addressLine1",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        value={sellerData.companyAddress.addressLine2}
                        onChange={(e) =>
                          handleAddressChange(
                            "companyAddress",
                            "addressLine2",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City *"
                          value={sellerData.companyAddress.city}
                          onChange={(e) =>
                            handleAddressChange(
                              "companyAddress",
                              "city",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          placeholder="State *"
                          value={sellerData.companyAddress.state}
                          onChange={(e) =>
                            handleAddressChange(
                              "companyAddress",
                              "state",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Pincode *"
                          value={sellerData.companyAddress.pincode}
                          onChange={(e) =>
                            handleAddressChange(
                              "companyAddress",
                              "pincode",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={sellerData.companyAddress.country}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Bank Details (Seller only) */}
          {userType === "seller" && currentStep === 4 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bank Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={sellerData.accountHolderName}
                    onChange={handleSellerInputChange}
                    placeholder="As per bank records"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={sellerData.accountNumber}
                    onChange={handleSellerInputChange}
                    placeholder="Enter account number"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={sellerData.ifscCode}
                    onChange={handleSellerInputChange}
                    placeholder="IFSC code"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={sellerData.bankName}
                    onChange={handleSellerInputChange}
                    placeholder="Bank name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    value={sellerData.branchName}
                    onChange={handleSellerInputChange}
                    placeholder="Branch name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountType"
                    value={sellerData.accountType}
                    onChange={handleSellerInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  >
                    {accountTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={sellerData.upiId}
                  onChange={handleSellerInputChange}
                  placeholder="example@okhdfcbank"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancelled Cheque <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "cancelledCheque")}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                />
                {fileNames.cancelledCheque && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {fileNames.cancelledCheque}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-5 justify-between items-center">
            {/* Submit/Next Button */}
            <button
              type="submit"
              className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {userType === "buyer"
                ? "Sign Up"
                : currentStep === 4
                  ? "Submit Registration"
                  : "Next →"}
            </button>

            {/* Back Button for Seller */}
            {userType === "seller" && currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300 mt-2"
              >
                ← Back
              </button>
            )}
          </div>
        </form>

        {/* Login Links */}
        <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center space-y-3">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
            >
              Login
            </span>
          </p>
          {userType === "buyer" && (
            <p className="text-gray-600">
              Want to sell?{" "}
              <span
                onClick={() => {
                  setUserType("seller");
                  setCurrentStep(1);
                }}
                className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
              >
                Register as Seller
              </span>
            </p>
          )}
          {userType === "seller" && (
            <p className="text-gray-600">
              Want to sell?{" "}
              <span
                onClick={() => {
                  setUserType("buyer");
                  setCurrentStep(1);
                }}
                className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
              >
                Register as Buyer
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
