// import { Eye, EyeOff } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ROUTES } from "../utils/StaticRoutes";
// import { StaticAPI } from "../utils/StaticApi";
// import { POSTMethod } from "../utils/service";
// import StateCity from "../utils/StateCity.json";

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Registration type state
//   const [userType, setUserType] = useState("buyer"); // "buyer" or "seller"

//   // Step state
//   const [currentStep, setCurrentStep] = useState(1);

//   // Error message state
//   const [error, setError] = useState("");

//   // Common form data (for both buyer and seller)
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Seller-specific data
//   const [sellerData, setSellerData] = useState({
//     // Company Details (Step 2)
//     companyName: "",
//     companyType: "", // Proprietorship, Partnership, Pvt Ltd, LLP, etc.
//     gstNumber: "",
//     gstCertificate: null,
//     panNumber: "",
//     panCard: null,
//     addhaarNumber: "",
//     addhaarCard: null,
//     businessWebsite: "",
//     businessDescription: "",

//     // Address Details (Step 3)
//     personalAddress: {
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       pincode: "",
//       country: "India",
//     },
//     companyAddress: {
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       pincode: "",
//       country: "India",
//     },
//     sameAsPersonalAddress: false,

//     // Bank Details (Step 4)
//     accountHolderName: "",
//     accountNumber: "",
//     confirmAccountNumber: "",
//     ifscCode: "",
//     bankName: "",
//     branchName: "",
//     accountType: "current", // savings, current
//     upiId: "",
//     cancelledCheque: null,
//   });

//   // State for dynamic city dropdowns
//   const [personalCities, setPersonalCities] = useState([]);
//   const [companyCities, setCompanyCities] = useState([]);

//   // File preview states
//   const [filePreviews, setFilePreviews] = useState({
//     gstCertificate: null,
//     panCard: null,
//     addhaarCard: null,
//     cancelledCheque: null,
//   });

//   const [fileNames, setFileNames] = useState({
//     gstCertificate: "",
//     panCard: "",
//     addhaarCard: "",
//     cancelledCheque: "",
//   });

//   // Clear error when changing steps or user type
//   useEffect(() => {
//     setError("");
//   }, [currentStep, userType]);

//   // Cleanup previews on unmount
//   useEffect(() => {
//     return () => {
//       Object.values(filePreviews).forEach((preview) => {
//         if (preview) URL.revokeObjectURL(preview);
//       });
//     };
//   }, []);

//   // Update cities when personal state changes
//   useEffect(() => {
//     if (sellerData.personalAddress.state) {
//       const cities = StateCity[sellerData.personalAddress.state] || [];
//       setPersonalCities(cities);
//       // Reset city if current city not in new state's cities
//       if (!cities.includes(sellerData.personalAddress.city)) {
//         handleAddressChange("personalAddress", "city", "");
//       }
//     } else {
//       setPersonalCities([]);
//     }
//   }, [sellerData.personalAddress.state]);

//   // Update cities when company state changes
//   useEffect(() => {
//     if (sellerData.companyAddress.state) {
//       const cities = StateCity[sellerData.companyAddress.state] || [];
//       setCompanyCities(cities);
//       // Reset city if current city not in new state's cities
//       if (!cities.includes(sellerData.companyAddress.city)) {
//         handleAddressChange("companyAddress", "city", "");
//       }
//     } else {
//       setCompanyCities([]);
//     }
//   }, [sellerData.companyAddress.state]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError(""); // Clear error on input change
//   };

//   const handleSellerInputChange = (e) => {
//     const { name, value } = e.target;

//     // Auto-capitalize PAN number and IFSC
//     if (name === "panNumber" || name === "ifscCode") {
//       setSellerData((prev) => ({
//         ...prev,
//         [name]: value.toUpperCase(),
//       }));
//     }
//     // Allow only numbers for Aadhaar
//     else if (name === "addhaarNumber") {
//       const numericValue = value.replace(/\D/g, "").slice(0, 12);
//       setSellerData((prev) => ({
//         ...prev,
//         [name]: numericValue,
//       }));
//     }
//     // Auto-capitalize GST
//     else if (name === "gstNumber") {
//       setSellerData((prev) => ({
//         ...prev,
//         [name]: value.toUpperCase(),
//       }));
//     } else {
//       setSellerData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//     setError(""); // Clear error on input change
//   };

//   const handleAddressChange = (type, field, value) => {
//     setSellerData((prev) => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [field]: value,
//       },
//     }));
//     setError(""); // Clear error on input change
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Revoke previous preview URL if exists
//       if (filePreviews[field]) {
//         URL.revokeObjectURL(filePreviews[field]);
//       }

//       setSellerData((prev) => ({
//         ...prev,
//         [field]: file,
//       }));

//       setFileNames((prev) => ({
//         ...prev,
//         [field]: file.name,
//       }));

//       // Create preview URL for images
//       if (file.type.startsWith("image/")) {
//         const previewUrl = URL.createObjectURL(file);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [field]: previewUrl,
//         }));
//       } else {
//         setFilePreviews((prev) => ({
//           ...prev,
//           [field]: null,
//         }));
//       }
//     }
//     setError(""); // Clear error on file change
//   };

//   const handleSameAsPersonalChange = (e) => {
//     const checked = e.target.checked;
//     setSellerData((prev) => ({
//       ...prev,
//       sameAsPersonalAddress: checked,
//       companyAddress: checked
//         ? { ...prev.personalAddress }
//         : prev.companyAddress,
//     }));

//     // Update company cities when copying personal address
//     if (checked && sellerData.personalAddress.state) {
//       setCompanyCities(StateCity[sellerData.personalAddress.state] || []);
//     }
//   };

//   const validateStep1 = () => {
//     if (
//       !formData.fullName ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.password ||
//       !formData.confirmPassword
//     ) {
//       setError("Please fill all required fields!");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords don't match!");
//       return false;
//     }
//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters!");
//       return false;
//     }
//     const hasLetter = /[a-zA-Z]/.test(formData.password);
//     const hasNumber = /\d/.test(formData.password);
//     if (!hasLetter || !hasNumber) {
//       setError("Password must contain at least one letter and one number!");
//       return false;
//     }
//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Please enter a valid email address!");
//       return false;
//     }
//     // Phone validation (10 digits)
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(formData.phone)) {
//       setError("Please enter a valid 10-digit phone number!");
//       return false;
//     }
//     return true;
//   };

//   const validateStep2 = () => {
//     if (
//       !sellerData.companyName ||
//       !sellerData.companyType ||
//       !sellerData.gstNumber ||
//       !sellerData.panNumber ||
//       !sellerData.addhaarNumber
//     ) {
//       setError("Please fill all required company details!");
//       return false;
//     }
//     if (!sellerData.gstCertificate) {
//       setError("Please upload GST certificate!");
//       return false;
//     }
//     if (!sellerData.panCard) {
//       setError("Please upload PAN card!");
//       return false;
//     }
//     if (!sellerData.addhaarCard) {
//       setError("Please upload Aadhaar card!");
//       return false;
//     }
//     // GST validation (15 characters)
//     if (sellerData.gstNumber.length !== 15) {
//       setError("GST number should be 15 characters!");
//       return false;
//     }
//     // PAN validation (10 characters)
//     if (sellerData.panNumber.length !== 10) {
//       setError("PAN number should be 10 characters!");
//       return false;
//     }
//     // PAN format validation (first 5 letters, then 4 numbers, last letter)
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     if (!panRegex.test(sellerData.panNumber)) {
//       setError(
//         "Invalid PAN format! It should be 5 letters, 4 numbers, and 1 letter (e.g., ABCDE1234F)",
//       );
//       return false;
//     }
//     // Aadhaar validation (12 digits)
//     if (sellerData.addhaarNumber.length !== 12) {
//       setError("Aadhaar number should be 12 digits!");
//       return false;
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     const { personalAddress, companyAddress } = sellerData;

//     if (
//       !personalAddress.addressLine1 ||
//       !personalAddress.city ||
//       !personalAddress.state ||
//       !personalAddress.pincode
//     ) {
//       setError("Please fill all personal address fields!");
//       return false;
//     }

//     // Pincode validation (6 digits)
//     const pincodeRegex = /^\d{6}$/;
//     if (!pincodeRegex.test(personalAddress.pincode)) {
//       setError("Please enter a valid 6-digit pincode!");
//       return false;
//     }

//     if (!sellerData.sameAsPersonalAddress) {
//       if (
//         !companyAddress.addressLine1 ||
//         !companyAddress.city ||
//         !companyAddress.state ||
//         !companyAddress.pincode
//       ) {
//         setError("Please fill all company address fields!");
//         return false;
//       }
//       if (!pincodeRegex.test(companyAddress.pincode)) {
//         setError("Please enter a valid 6-digit pincode for company address!");
//         return false;
//       }
//     }
//     return true;
//   };

//   const validateStep4 = () => {
//     if (
//       !sellerData.accountHolderName ||
//       !sellerData.accountNumber ||
//       !sellerData.confirmAccountNumber ||
//       !sellerData.ifscCode ||
//       !sellerData.bankName
//     ) {
//       setError("Please fill all bank details!");
//       return false;
//     }

//     if (sellerData.accountNumber !== sellerData.confirmAccountNumber) {
//       setError("Account numbers don't match!");
//       return false;
//     }

//     // IFSC validation
//     const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//     if (!ifscRegex.test(sellerData.ifscCode)) {
//       setError("Please enter a valid IFSC code!");
//       return false;
//     }

//     if (!sellerData.cancelledCheque) {
//       setError("Please upload cancelled cheque!");
//       return false;
//     }

//     // Account number validation (at least 9 digits, max 18)
//     if (
//       sellerData.accountNumber.length < 9 ||
//       sellerData.accountNumber.length > 18
//     ) {
//       setError("Account number should be between 9 and 18 digits!");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (userType === "buyer") {
//       if (validateStep1()) {
//         try {
//           const payload = {
//             name: formData.fullName,
//             email: formData.email,
//             mobile: formData.phone,
//             password: formData.password,
//           };
//           const response = await POSTMethod(StaticAPI.registerBuyer, payload);
//           if (response?.data?._id) {
//             navigate(ROUTES.HOME);
//           }
//         } catch (error) {
//           setError(error.response?.data?.message || "Registration failed");
//         }
//       }
//     } else {
//       // Seller registration steps
//       if (currentStep === 1 && validateStep1()) {
//         setCurrentStep(2);
//       } else if (currentStep === 2 && validateStep2()) {
//         setCurrentStep(3);
//       } else if (currentStep === 3 && validateStep3()) {
//         setCurrentStep(4);
//       } else if (currentStep === 4 && validateStep4()) {
//         try {
//           // Create FormData for file uploads
//           const formDataToSend = new FormData();

//           // Add basic fields
//           formDataToSend.append("name", formData.fullName);
//           formDataToSend.append("email", formData.email);
//           formDataToSend.append("mobile", formData.phone);
//           formDataToSend.append("password", formData.password);

//           // Add GST, PAN, Aadhaar
//           formDataToSend.append("gst", sellerData.gstNumber);
//           formDataToSend.append("pan", sellerData.panNumber);
//           formDataToSend.append("addhaar", sellerData.addhaarNumber);

//           // Add files
//           if (sellerData.panCard) {
//             formDataToSend.append("panDoc", sellerData.panCard);
//           }
//           if (sellerData.addhaarCard) {
//             formDataToSend.append("addhaarDoc", sellerData.addhaarCard);
//           }

//           // Prepare addresses array
//           const addresses = [
//             {
//               line1: sellerData.personalAddress.addressLine1,
//               line2: sellerData.personalAddress.addressLine2 || "",
//               city: sellerData.personalAddress.city,
//               state: sellerData.personalAddress.state,
//               pincode: sellerData.personalAddress.pincode,
//               country: sellerData.personalAddress.country,
//               type: "home",
//               isDefault: true,
//             },
//           ];

//           // Stringify addresses for FormData
//           formDataToSend.append("addresses", JSON.stringify(addresses));

//           // Handle company address
//           formDataToSend.append(
//             "sameAsPersonalAddress",
//             sellerData.sameAsPersonalAddress ? "true" : "false",
//           );

//           if (!sellerData.sameAsPersonalAddress) {
//             const companyAddressObj = {
//               line1: sellerData.companyAddress.addressLine1,
//               line2: sellerData.companyAddress.addressLine2 || "",
//               city: sellerData.companyAddress.city,
//               state: sellerData.companyAddress.state,
//               pincode: sellerData.companyAddress.pincode,
//               country: sellerData.companyAddress.country,
//             };
//             formDataToSend.append(
//               "companyAddress",
//               JSON.stringify(companyAddressObj),
//             );
//           }

//           // Prepare banks array
//           const banks = [
//             {
//               accountHolderName: sellerData.accountHolderName,
//               accountNumber: sellerData.accountNumber,
//               confirmAccountNumber: sellerData.confirmAccountNumber,
//               ifsc: sellerData.ifscCode,
//               bankName: sellerData.bankName,
//               branchName: sellerData.branchName || "",
//               accountType: sellerData.accountType,
//               upiId: sellerData.upiId || "",
//               isDefault: true,
//             },
//           ];

//           // Stringify banks for FormData
//           formDataToSend.append("banks", JSON.stringify(banks));

//           // Send the request
//           const response = await POSTMethod(
//             StaticAPI.registerSeller,
//             formDataToSend,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             },
//           );

//           if (response?.data?._id) {
//             navigate(ROUTES.HOME);
//           }
//         } catch (error) {
//           console.error("Registration error:", error);
//           setError(error.response?.data?.message || "Registration failed");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (location.state) {
//       if (typeof location.state === "string") {
//         setUserType(location.state);
//       } else if (
//         typeof location.state === "object" &&
//         location.state.userType
//       ) {
//         setUserType(location.state.userType);
//       }
//     }
//   }, [location.state]);

//   const companyTypes = [
//     "Proprietorship",
//     "Partnership",
//     "Private Limited",
//     "Public Limited",
//     "LLP",
//     "One Person Company",
//     "Section 8 Company",
//     "Other",
//   ];

//   const accountTypes = ["Current", "Savings", "Cash Credit", "Overdraft"];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
//       <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl">
//         {/* Logo */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-[hsl(24,100%,50%)]">
//             bharatBazar
//           </h1>
//         </div>

//         {/* Progress Steps - Only for Seller */}
//         {userType === "seller" && (
//           <div className="flex justify-between mb-8">
//             {[1, 2, 3, 4].map((step) => (
//               <div key={step} className="flex flex-col items-center">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
//                     currentStep >= step
//                       ? "bg-[hsl(24,100%,50%)] text-white"
//                       : "bg-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {step}
//                 </div>
//                 <span className="text-xs mt-1 text-gray-600">
//                   {step === 1
//                     ? "Account"
//                     : step === 2
//                       ? "Company"
//                       : step === 3
//                         ? "Address"
//                         : "Bank"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error Message Display */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Registration Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Step 1: Common for both Buyer and Seller */}
//           {currentStep === 1 && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   placeholder="Enter your full name"
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="your@email.com"
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="10-digit mobile number"
//                     maxLength="10"
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       placeholder="Min 8 chars with letter & number"
//                       required
//                       minLength="8"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       placeholder="Confirm your password"
//                       required
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff size={20} />
//                       ) : (
//                         <Eye size={20} />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Step 2: Company Details (Seller only) */}
//           {userType === "seller" && currentStep === 2 && (
//             <>
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Company Details
//               </h2>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={sellerData.companyName}
//                   onChange={handleSellerInputChange}
//                   placeholder="Enter company name"
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="companyType"
//                   value={sellerData.companyType}
//                   onChange={handleSellerInputChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 >
//                   <option value="">Select Company Type</option>
//                   {companyTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GST Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="gstNumber"
//                     value={sellerData.gstNumber}
//                     onChange={handleSellerInputChange}
//                     placeholder="15-digit GST number"
//                     required
//                     maxLength="15"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PAN Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="panNumber"
//                     value={sellerData.panNumber}
//                     onChange={handleSellerInputChange}
//                     placeholder="10-digit PAN number"
//                     required
//                     maxLength="10"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="addhaarNumber"
//                     value={sellerData.addhaarNumber}
//                     onChange={handleSellerInputChange}
//                     placeholder="12-digit Aadhaar number"
//                     required
//                     maxLength="12"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GST Certificate <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     onChange={(e) => handleFileChange(e, "gstCertificate")}
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                   {fileNames.gstCertificate && (
//                     <div className="mt-2">
//                       {filePreviews.gstCertificate ? (
//                         <div className="relative">
//                           <img
//                             src={filePreviews.gstCertificate}
//                             alt="GST Certificate Preview"
//                             className="max-h-32 rounded-lg border-2 border-gray-200"
//                           />
//                           <p className="text-xs text-green-600 mt-1">
//                             ✓ {fileNames.gstCertificate}
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ {fileNames.gstCertificate}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PAN Card <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     onChange={(e) => handleFileChange(e, "panCard")}
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                   {fileNames.panCard && (
//                     <div className="mt-2">
//                       {filePreviews.panCard ? (
//                         <div className="relative">
//                           <img
//                             src={filePreviews.panCard}
//                             alt="PAN Card Preview"
//                             className="max-h-32 rounded-lg border-2 border-gray-200"
//                           />
//                           <p className="text-xs text-green-600 mt-1">
//                             ✓ {fileNames.panCard}
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ {fileNames.panCard}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Card <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     onChange={(e) => handleFileChange(e, "addhaarCard")}
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                   {fileNames.addhaarCard && (
//                     <div className="mt-2">
//                       {filePreviews.addhaarCard ? (
//                         <div className="relative">
//                           <img
//                             src={filePreviews.addhaarCard}
//                             alt="Aadhaar Card Preview"
//                             className="max-h-32 rounded-lg border-2 border-gray-200"
//                           />
//                           <p className="text-xs text-green-600 mt-1">
//                             ✓ {fileNames.addhaarCard}
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ {fileNames.addhaarCard}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Business Website (Optional)
//                 </label>
//                 <input
//                   type="url"
//                   name="businessWebsite"
//                   value={sellerData.businessWebsite}
//                   onChange={handleSellerInputChange}
//                   placeholder="https://example.com"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Business Description (Optional)
//                 </label>
//                 <textarea
//                   name="businessDescription"
//                   value={sellerData.businessDescription}
//                   onChange={handleSellerInputChange}
//                   placeholder="Tell us about your business"
//                   rows="3"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 />
//               </div>
//             </>
//           )}

//           {/* Step 3: Address Details (Seller only) */}
//           {userType === "seller" && currentStep === 3 && (
//             <>
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Address Details
//               </h2>

//               <div className="space-y-6">
//                 {/* Personal Address */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700 mb-3">
//                     Personal Address
//                   </h3>
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       placeholder="Address Line 1 *"
//                       value={sellerData.personalAddress.addressLine1}
//                       onChange={(e) =>
//                         handleAddressChange(
//                           "personalAddress",
//                           "addressLine1",
//                           e.target.value,
//                         )
//                       }
//                       required
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Address Line 2"
//                       value={sellerData.personalAddress.addressLine2}
//                       onChange={(e) =>
//                         handleAddressChange(
//                           "personalAddress",
//                           "addressLine2",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                     />
//                     <div className="grid grid-cols-2 gap-3">
//                       <select
//                         value={sellerData.personalAddress.state}
//                         onChange={(e) =>
//                           handleAddressChange(
//                             "personalAddress",
//                             "state",
//                             e.target.value,
//                           )
//                         }
//                         required
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                       >
//                         <option value="">Select State *</option>
//                         {Object.keys(StateCity).map((state) => (
//                           <option key={state} value={state}>
//                             {state}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         value={sellerData.personalAddress.city}
//                         onChange={(e) =>
//                           handleAddressChange(
//                             "personalAddress",
//                             "city",
//                             e.target.value,
//                           )
//                         }
//                         required
//                         disabled={!sellerData.personalAddress.state}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                       >
//                         <option value="">Select City *</option>
//                         {personalCities.map((city) => (
//                           <option key={city} value={city}>
//                             {city}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="text"
//                         placeholder="Pincode *"
//                         value={sellerData.personalAddress.pincode}
//                         onChange={(e) =>
//                           handleAddressChange(
//                             "personalAddress",
//                             "pincode",
//                             e.target.value,
//                           )
//                         }
//                         required
//                         maxLength="6"
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                       />
//                       <input
//                         type="text"
//                         placeholder="Country"
//                         value={sellerData.personalAddress.country}
//                         disabled
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Company Address */}
//                 <div>
//                   <div className="flex items-center mb-3">
//                     <h3 className="text-lg font-medium text-gray-700">
//                       Company Address
//                     </h3>
//                     <label className="ml-4 flex items-center space-x-2">
//                       <input
//                         type="checkbox"
//                         checked={sellerData.sameAsPersonalAddress}
//                         onChange={handleSameAsPersonalChange}
//                         className="w-4 h-4 text-[hsl(24,100%,50%)]"
//                       />
//                       <span className="text-sm text-gray-600">
//                         Same as personal address
//                       </span>
//                     </label>
//                   </div>

//                   {!sellerData.sameAsPersonalAddress && (
//                     <div className="space-y-3">
//                       <input
//                         type="text"
//                         placeholder="Address Line 1 *"
//                         value={sellerData.companyAddress.addressLine1}
//                         onChange={(e) =>
//                           handleAddressChange(
//                             "companyAddress",
//                             "addressLine1",
//                             e.target.value,
//                           )
//                         }
//                         required
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                       />
//                       <input
//                         type="text"
//                         placeholder="Address Line 2"
//                         value={sellerData.companyAddress.addressLine2}
//                         onChange={(e) =>
//                           handleAddressChange(
//                             "companyAddress",
//                             "addressLine2",
//                             e.target.value,
//                           )
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                       />
//                       <div className="grid grid-cols-2 gap-3">
//                         <select
//                           value={sellerData.companyAddress.state}
//                           onChange={(e) =>
//                             handleAddressChange(
//                               "companyAddress",
//                               "state",
//                               e.target.value,
//                             )
//                           }
//                           required
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                         >
//                           <option value="">Select State *</option>
//                           {Object.keys(StateCity).map((state) => (
//                             <option key={state} value={state}>
//                               {state}
//                             </option>
//                           ))}
//                         </select>

//                         <select
//                           value={sellerData.companyAddress.city}
//                           onChange={(e) =>
//                             handleAddressChange(
//                               "companyAddress",
//                               "city",
//                               e.target.value,
//                             )
//                           }
//                           required
//                           disabled={!sellerData.companyAddress.state}
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         >
//                           <option value="">Select City *</option>
//                           {companyCities.map((city) => (
//                             <option key={city} value={city}>
//                               {city}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="Pincode *"
//                           value={sellerData.companyAddress.pincode}
//                           onChange={(e) =>
//                             handleAddressChange(
//                               "companyAddress",
//                               "pincode",
//                               e.target.value,
//                             )
//                           }
//                           required
//                           maxLength="6"
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Country"
//                           value={sellerData.companyAddress.country}
//                           disabled
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Step 4: Bank Details (Seller only) */}
//           {userType === "seller" && currentStep === 4 && (
//             <>
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Bank Details
//               </h2>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="accountHolderName"
//                     value={sellerData.accountHolderName}
//                     onChange={handleSellerInputChange}
//                     placeholder="As per bank records"
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="accountNumber"
//                     value={sellerData.accountNumber}
//                     onChange={handleSellerInputChange}
//                     placeholder="Enter account number"
//                     required
//                     maxLength="18"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Account Number{" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="confirmAccountNumber"
//                     value={sellerData.confirmAccountNumber}
//                     onChange={handleSellerInputChange}
//                     placeholder="Re-enter account number"
//                     required
//                     maxLength="18"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="ifscCode"
//                     value={sellerData.ifscCode}
//                     onChange={handleSellerInputChange}
//                     placeholder="IFSC code"
//                     required
//                     maxLength="11"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="bankName"
//                     value={sellerData.bankName}
//                     onChange={handleSellerInputChange}
//                     placeholder="Bank name"
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Branch Name
//                   </label>
//                   <input
//                     type="text"
//                     name="branchName"
//                     value={sellerData.branchName}
//                     onChange={handleSellerInputChange}
//                     placeholder="Branch name"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="accountType"
//                     value={sellerData.accountType}
//                     onChange={handleSellerInputChange}
//                     required
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   >
//                     {accountTypes.map((type) => (
//                       <option key={type} value={type.toLowerCase()}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     UPI ID (Optional)
//                   </label>
//                   <input
//                     type="text"
//                     name="upiId"
//                     value={sellerData.upiId}
//                     onChange={handleSellerInputChange}
//                     placeholder="example@okhdfcbank"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cancelled Cheque <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={(e) => handleFileChange(e, "cancelledCheque")}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
//                 />
//                 {fileNames.cancelledCheque && (
//                   <div className="mt-2">
//                     {filePreviews.cancelledCheque ? (
//                       <div className="relative">
//                         <img
//                           src={filePreviews.cancelledCheque}
//                           alt="Cancelled Cheque Preview"
//                           className="max-h-32 rounded-lg border-2 border-gray-200"
//                         />
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ {fileNames.cancelledCheque}
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-xs text-green-600 mt-1">
//                         ✓ {fileNames.cancelledCheque}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex gap-4">
//             {/* Back Button for Seller */}
//             {userType === "seller" && currentStep > 1 && (
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(currentStep - 1)}
//                 className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
//               >
//                 ← Back
//               </button>
//             )}

//             {/* Submit/Next Button */}
//             <button
//               type="submit"
//               className={`${
//                 userType === "seller" && currentStep > 1 ? "w-2/3" : "w-full"
//               } bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg`}
//             >
//               {userType === "buyer"
//                 ? "Sign Up"
//                 : currentStep === 4
//                   ? "Submit Registration"
//                   : "Next →"}
//             </button>
//           </div>
//         </form>

//         {/* Login Links */}
//         <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center space-y-3">
//           <p className="text-gray-600">
//             Already have an account?{" "}
//             <span
//               onClick={() => navigate(ROUTES.LOGIN)}
//               className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
//             >
//               Login
//             </span>
//           </p>
//           {userType === "buyer" && (
//             <p className="text-gray-600">
//               Want to sell?{" "}
//               <span
//                 onClick={() => {
//                   setUserType("seller");
//                   setCurrentStep(1);
//                 }}
//                 className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
//               >
//                 Register as Seller
//               </span>
//             </p>
//           )}
//           {userType === "seller" && (
//             <p className="text-gray-600">
//               Want to buy?{" "}
//               <span
//                 onClick={() => {
//                   setUserType("buyer");
//                   setCurrentStep(1);
//                 }}
//                 className="text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] hover:underline cursor-pointer transition-all duration-300"
//               >
//                 Register as Buyer
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";
import { StaticAPI } from "../utils/StaticApi";
import { POSTMethod } from "../utils/service";
import StateCity from "../utils/StateCity.json";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Registration type state
  const [userType, setUserType] = useState("buyer"); // "buyer" or "seller"

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Error message state
  const [error, setError] = useState("");

  // Common form data (for both buyer and seller)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Seller-specific data
  const [sellerData, setSellerData] = useState({
    // Company Details (Step 2)
    companyName: "",
    companyType: "", // Proprietorship, Partnership, Pvt Ltd, LLP, etc.
    gstNumber: "",
    gstCertificate: null,
    panNumber: "",
    panCard: null,
    addhaarNumber: "",
    addhaarCard: null,
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
    bankCity: "",
    bankState: "",
    bankPincode: "",
    accountType: "current",
    upiId: "",
    cancelledCheque: null,
  });

  // State for dynamic city dropdowns
  const [personalCities, setPersonalCities] = useState([]);
  const [companyCities, setCompanyCities] = useState([]);

  // File preview states
  const [filePreviews, setFilePreviews] = useState({
    gstCertificate: null,
    panCard: null,
    addhaarCard: null,
    cancelledCheque: null,
  });

  const [fileNames, setFileNames] = useState({
    gstCertificate: "",
    panCard: "",
    addhaarCard: "",
    cancelledCheque: "",
  });

  // Clear error when changing steps or user type
  useEffect(() => {
    setError("");
  }, [currentStep, userType]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  // Update cities when personal state changes
  useEffect(() => {
    if (sellerData.personalAddress.state) {
      const cities = StateCity[sellerData.personalAddress.state] || [];
      setPersonalCities(cities);
      // Reset city if current city not in new state's cities
      if (!cities.includes(sellerData.personalAddress.city)) {
        handleAddressChange("personalAddress", "city", "");
      }
    } else {
      setPersonalCities([]);
    }
  }, [sellerData.personalAddress.state]);

  // Update cities when company state changes
  useEffect(() => {
    if (sellerData.companyAddress.state) {
      const cities = StateCity[sellerData.companyAddress.state] || [];
      setCompanyCities(cities);
      // Reset city if current city not in new state's cities
      if (!cities.includes(sellerData.companyAddress.city)) {
        handleAddressChange("companyAddress", "city", "");
      }
    } else {
      setCompanyCities([]);
    }
  }, [sellerData.companyAddress.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;

    // Auto-capitalize PAN number and IFSC
    if (name === "panNumber" || name === "ifscCode") {
      setSellerData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
    // Allow only numbers for Aadhaar and pincodes
    else if (name === "addhaarNumber" || name === "bankPincode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 12);
      setSellerData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    // Auto-capitalize GST
    else if (name === "gstNumber") {
      setSellerData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else {
      setSellerData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError(""); // Clear error on input change
  };

  const handleAddressChange = (type, field, value) => {
    setSellerData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
    setError(""); // Clear error on input change
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous preview URL if exists
      if (filePreviews[field]) {
        URL.revokeObjectURL(filePreviews[field]);
      }

      setSellerData((prev) => ({
        ...prev,
        [field]: file,
      }));

      setFileNames((prev) => ({
        ...prev,
        [field]: file.name,
      }));

      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreviews((prev) => ({
          ...prev,
          [field]: previewUrl,
        }));
      } else {
        setFilePreviews((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    }
    setError(""); // Clear error on file change
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

    // Update company cities when copying personal address
    if (checked && sellerData.personalAddress.state) {
      setCompanyCities(StateCity[sellerData.personalAddress.state] || []);
    }
  };

  const validateStep1 = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all required fields!");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters!");
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      setError("Password must contain at least one letter and one number!");
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      return false;
    }
    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !sellerData.companyName ||
      !sellerData.companyType ||
      !sellerData.gstNumber ||
      !sellerData.panNumber ||
      !sellerData.addhaarNumber
    ) {
      setError("Please fill all required company details!");
      return false;
    }
    if (!sellerData.gstCertificate) {
      setError("Please upload GST certificate!");
      return false;
    }
    if (!sellerData.panCard) {
      setError("Please upload PAN card!");
      return false;
    }
    if (!sellerData.addhaarCard) {
      setError("Please upload Aadhaar card!");
      return false;
    }
    // GST validation (15 characters)
    if (sellerData.gstNumber.length !== 15) {
      setError("GST number should be 15 characters!");
      return false;
    }
    // PAN validation (10 characters)
    if (sellerData.panNumber.length !== 10) {
      setError("PAN number should be 10 characters!");
      return false;
    }
    // PAN format validation (first 5 letters, then 4 numbers, last letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(sellerData.panNumber)) {
      setError(
        "Invalid PAN format! It should be 5 letters, 4 numbers, and 1 letter (e.g., ABCDE1234F)",
      );
      return false;
    }
    // Aadhaar validation (12 digits)
    if (sellerData.addhaarNumber.length !== 12) {
      setError("Aadhaar number should be 12 digits!");
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
      setError("Please fill all personal address fields!");
      return false;
    }

    // Pincode validation (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(personalAddress.pincode)) {
      setError("Please enter a valid 6-digit pincode!");
      return false;
    }

    if (!sellerData.sameAsPersonalAddress) {
      if (
        !companyAddress.addressLine1 ||
        !companyAddress.city ||
        !companyAddress.state ||
        !companyAddress.pincode
      ) {
        setError("Please fill all company address fields!");
        return false;
      }
      if (!pincodeRegex.test(companyAddress.pincode)) {
        setError("Please enter a valid 6-digit pincode for company address!");
        return false;
      }
    }
    return true;
  };

  const validateStep4 = () => {
    if (
      !sellerData.accountHolderName ||
      !sellerData.accountNumber ||
      !sellerData.confirmAccountNumber ||
      !sellerData.ifscCode ||
      !sellerData.bankName ||
      !sellerData.bankCity ||
      !sellerData.bankState ||
      !sellerData.bankPincode
    ) {
      setError("Please fill all bank details including branch address!");
      return false;
    }

    if (sellerData.accountNumber !== sellerData.confirmAccountNumber) {
      setError("Account numbers don't match!");
      return false;
    }

    // IFSC validation
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(sellerData.ifscCode)) {
      setError("Please enter a valid IFSC code!");
      return false;
    }

    // Bank pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(sellerData.bankPincode)) {
      setError("Please enter a valid 6-digit bank branch pincode!");
      return false;
    }

    if (!sellerData.cancelledCheque) {
      setError("Please upload cancelled cheque!");
      return false;
    }

    // Account number validation (at least 9 digits, max 18)
    if (
      sellerData.accountNumber.length < 9 ||
      sellerData.accountNumber.length > 18
    ) {
      setError("Account number should be between 9 and 18 digits!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userType === "buyer") {
      if (validateStep1()) {
        try {
          const payload = {
            name: formData.fullName,
            email: formData.email,
            mobile: formData.phone,
            password: formData.password,
          };
          const response = await POSTMethod(StaticAPI.registerBuyer, payload);
          if (response?.data?._id) {
            navigate(ROUTES.HOME);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        } catch (error) {
          setError(error.response?.data?.message || "Registration failed");
        }
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
        try {
          // Create FormData for file uploads
          const formDataToSend = new FormData();

          // Add basic fields
          formDataToSend.append("name", formData.fullName);
          formDataToSend.append("email", formData.email);
          formDataToSend.append("mobile", formData.phone);
          formDataToSend.append("password", formData.password);

          // Add GST, PAN, Aadhaar
          formDataToSend.append("gst", sellerData.gstNumber);
          formDataToSend.append("pan", sellerData.panNumber);
          formDataToSend.append("addhaar", sellerData.addhaarNumber);

          // Add files
          if (sellerData.panCard) {
            formDataToSend.append("panDoc", sellerData.panCard);
          }
          if (sellerData.addhaarCard) {
            formDataToSend.append("addhaarDoc", sellerData.addhaarCard);
          }

          // Prepare addresses array - MATCHING ADDRESS SCHEMA
          const addresses = [
            {
              line1: sellerData.personalAddress.addressLine1,
              line2: sellerData.personalAddress.addressLine2 || "",
              city: sellerData.personalAddress.city,
              state: sellerData.personalAddress.state,
              addressPincode: sellerData.personalAddress.pincode, // Changed from pincode to addressPincode
              type: "home",
              isDefault: true,
            },
          ];

          // Stringify addresses for FormData
          formDataToSend.append("addresses", JSON.stringify(addresses));

          // Handle company address
          formDataToSend.append(
            "sameAsPersonalAddress",
            sellerData.sameAsPersonalAddress ? "true" : "false",
          );

          if (!sellerData.sameAsPersonalAddress) {
            const companyAddressObj = {
              line1: sellerData.companyAddress.addressLine1,
              line2: sellerData.companyAddress.addressLine2 || "",
              city: sellerData.companyAddress.city,
              state: sellerData.companyAddress.state,
              addressPincode: sellerData.companyAddress.pincode, // Changed from pincode to addressPincode
            };
            formDataToSend.append(
              "companyAddress",
              JSON.stringify(companyAddressObj),
            );
          }

          // Prepare banks array - MATCHING BANK SCHEMA
          const banks = [
            {
              accountHolderName: sellerData.accountHolderName,
              accountNumber: sellerData.accountNumber,
              confirmAccountNumber: sellerData.confirmAccountNumber,
              ifsc: sellerData.ifscCode,
              bankName: sellerData.bankName,
              // Bank address object
              bankAddress: {
                city: sellerData.bankCity || "",
                state: sellerData.bankState || "",
                pincode: sellerData.bankPincode || "",
              },
              // Card schema (optional)
              card: null,
              // UPI schema
              upi: sellerData.upiId
                ? {
                    upiId: sellerData.upiId,
                    verified: false,
                  }
                : null,
              isPrimary: true,
            },
          ];

          // Stringify banks for FormData
          formDataToSend.append("banks", JSON.stringify(banks));

          // Send the request
          const response = await POSTMethod(
            StaticAPI.registerSeller,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          if (response?.user?._id) {
            navigate(ROUTES.HOME);
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error) {
          console.error("Registration error:", error);
          setError(error.response?.data?.message || "Registration failed");
        }
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

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
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
                    placeholder="10-digit mobile number"
                    maxLength="10"
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 8 chars with letter & number"
                      required
                      minLength="8"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addhaarNumber"
                    value={sellerData.addhaarNumber}
                    onChange={handleSellerInputChange}
                    placeholder="12-digit Aadhaar number"
                    required
                    maxLength="12"
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
                    <div className="mt-2">
                      {filePreviews.gstCertificate ? (
                        <div className="relative">
                          <img
                            src={filePreviews.gstCertificate}
                            alt="GST Certificate Preview"
                            className="max-h-32 rounded-lg border-2 border-gray-200"
                          />
                          <p className="text-xs text-green-600 mt-1">
                            ✓ {fileNames.gstCertificate}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {fileNames.gstCertificate}
                        </p>
                      )}
                    </div>
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
                    <div className="mt-2">
                      {filePreviews.panCard ? (
                        <div className="relative">
                          <img
                            src={filePreviews.panCard}
                            alt="PAN Card Preview"
                            className="max-h-32 rounded-lg border-2 border-gray-200"
                          />
                          <p className="text-xs text-green-600 mt-1">
                            ✓ {fileNames.panCard}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {fileNames.panCard}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "addhaarCard")}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                  {fileNames.addhaarCard && (
                    <div className="mt-2">
                      {filePreviews.addhaarCard ? (
                        <div className="relative">
                          <img
                            src={filePreviews.addhaarCard}
                            alt="Aadhaar Card Preview"
                            className="max-h-32 rounded-lg border-2 border-gray-200"
                          />
                          <p className="text-xs text-green-600 mt-1">
                            ✓ {fileNames.addhaarCard}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {fileNames.addhaarCard}
                        </p>
                      )}
                    </div>
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
                      <select
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
                      >
                        <option value="">Select State *</option>
                        {Object.keys(StateCity).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>

                      <select
                        value={sellerData.personalAddress.city}
                        onChange={(e) =>
                          handleAddressChange(
                            "personalAddress",
                            "city",
                            e.target.value,
                          )
                        }
                        required
                        disabled={!sellerData.personalAddress.state}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select City *</option>
                        {personalCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
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
                        maxLength="6"
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
                        <select
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
                        >
                          <option value="">Select State *</option>
                          {Object.keys(StateCity).map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>

                        <select
                          value={sellerData.companyAddress.city}
                          onChange={(e) =>
                            handleAddressChange(
                              "companyAddress",
                              "city",
                              e.target.value,
                            )
                          }
                          required
                          disabled={!sellerData.companyAddress.state}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select City *</option>
                          {companyCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
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
                          maxLength="6"
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
                    maxLength="18"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Account Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="confirmAccountNumber"
                    value={sellerData.confirmAccountNumber}
                    onChange={handleSellerInputChange}
                    placeholder="Re-enter account number"
                    required
                    maxLength="18"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
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
                    maxLength="11"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Bank Address Fields */}
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Bank Branch Address
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankCity"
                    value={sellerData.bankCity || ""}
                    onChange={handleSellerInputChange}
                    placeholder="Bank branch city"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankState"
                    value={sellerData.bankState || ""}
                    onChange={handleSellerInputChange}
                    placeholder="Bank branch state"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankPincode"
                    value={sellerData.bankPincode || ""}
                    onChange={handleSellerInputChange}
                    placeholder="6-digit pincode"
                    required
                    maxLength="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <div className="mt-2">
                    {filePreviews.cancelledCheque ? (
                      <div className="relative">
                        <img
                          src={filePreviews.cancelledCheque}
                          alt="Cancelled Cheque Preview"
                          className="max-h-32 rounded-lg border-2 border-gray-200"
                        />
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {fileNames.cancelledCheque}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {fileNames.cancelledCheque}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {/* Back Button for Seller */}
            {userType === "seller" && currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
              >
                ← Back
              </button>
            )}

            {/* Submit/Next Button */}
            <button
              type="submit"
              className={`${
                userType === "seller" && currentStep > 1 ? "w-2/3" : "w-full"
              } bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              {userType === "buyer"
                ? "Sign Up"
                : currentStep === 4
                  ? "Submit Registration"
                  : "Next →"}
            </button>
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
              Want to buy?{" "}
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
