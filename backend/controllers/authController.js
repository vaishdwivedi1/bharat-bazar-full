import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Address } from "../models/Address.js";
import { Bank } from "../models/Bank.js";
import { OTP } from "../models/OTP.js";
import { User } from "../models/User.js";
import {
  addhaarValidationRegex,
  gstValidationRegex,
  ifscValidationRegex,
  panValidationRegex,
} from "../utils/Constants.js";

export const userLogin = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!password || (!email && !mobile))
      return res.status(400).json({ message: "Invalid data" });

    let user;
    if (email) {
      user = await User.findOne({ email: email });
    } else {
      user = await User.findOne({ mobile: mobile });
    }
    if (!user) return res.status(400).json({ message: "Invalid data" });

    const isPasswordMatched = bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return res.status(400).json({ message: "Invalid data" });

    // if (user.role !== "admin")
    // return res.status(400).json({ message: "Invalid user" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET, // secret key
      { expiresIn: "7d" }, // options
    );

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      message: "Logged in",
      data: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier) return res.status(400).send({ message: "Invalid user" });

    let user;
    user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    const { password: _, ...userData } = user._doc;

    if (!user) return res.status(400).json({ message: "Invalid data" });
    return res.status(200).json({
      message: "User verified",
      data: userData,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let user;
    user = await User.findOne({
      $or: [{ email: email }, { mobile: email }],
    });
    if (!user) return res.status(400).json({ message: "Invalid data" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    // Send OTP via email (replace with your email sending logic)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    });

    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one letter and one number",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  const { email, otp, purpose } = req.body; // Add 'purpose' parameter

  try {
    const otpRecord = await OTP.findOne({ email, otp }).exec();

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiry
    const otpAge = (Date.now() - otpRecord.createdAt) / (1000 * 60);
    if (otpAge > 10) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // If purpose is 'login', generate token
    if (purpose === "login") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      const { password, ...userData } = user._doc;

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token,
        data: userData,
      });
    }

    // For other purposes, just return success
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, mobile, password, name } = req.body;
    if (!email || !mobile || !password || !name)
      return res.status(400).json({ message: "Invalid data" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exist" });

    const hashedpass = await bcrypt.hash(password, 10);
    await User.create({
      email,
      mobile,
      name,
      password: hashedpass,
      role: "admin",
    });
    return res.status(200).json({
      message: "User created",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const registerBuyer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
    });

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Buyer registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerSeller = async (req, res) => {
  try {
    // Get form-data fields
    const {
      name,
      email,
      mobile,
      password,
      gst,
      pan,
      addhaar,
      addresses,
      banks,
      sameAsPersonalAddress,
      companyAddress,
    } = req.body;

    // Get uploaded files
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const panDoc = req.files?.panDoc?.[0];
    const addhaarDoc = req.files?.addhaarDoc?.[0];

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "Basic fields are required" });
    }

    if (!gst || !pan || !addhaar) {
      return res
        .status(400)
        .json({ message: "GST, PAN and Aadhaar are required" });
    }

    if (!panDoc || !addhaarDoc) {
      return res
        .status(400)
        .json({ message: "PAN and Aadhaar documents are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        message: "Password must contain at least one letter and one number",
      });
    }

    // Validate GST
    if (!gstValidationRegex.test(gst.toUpperCase())) {
      return res.status(400).json({ message: "Invalid GST format" });
    }

    // Validate PAN
    if (!panValidationRegex.test(pan.toUpperCase())) {
      return res.status(400).json({ message: "Invalid PAN format" });
    }

    // Validate Aadhaar
    if (!addhaarValidationRegex.test(addhaar)) {
      return res.status(400).json({ message: "Invalid Aadhaar format" });
    }

    // Parse addresses
    let parsedAddresses = [];
    try {
      parsedAddresses =
        typeof addresses === "string" ? JSON.parse(addresses) : addresses;

      // Add company address if different
      if (
        sameAsPersonalAddress === "false" ||
        sameAsPersonalAddress === false
      ) {
        const parsedCompanyAddress =
          typeof companyAddress === "string"
            ? JSON.parse(companyAddress)
            : companyAddress;

        if (parsedCompanyAddress && parsedCompanyAddress.line1) {
          parsedAddresses.push({
            ...parsedCompanyAddress,
            type: "warehouse",
            isDefault: false,
          });
        }
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid address format" });
    }

    if (!Array.isArray(parsedAddresses) || parsedAddresses.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one address is required" });
    }

    // Parse banks
    let parsedBanks = [];
    try {
      parsedBanks = typeof banks === "string" ? JSON.parse(banks) : banks;
    } catch (err) {
      return res.status(400).json({ message: "Invalid bank format" });
    }

    if (!Array.isArray(parsedBanks) || parsedBanks.length === 0) {
      return res.status(400).json({ message: "At least one bank is required" });
    }

    // Validate bank IFSC
    for (let bank of parsedBanks) {
      if (!ifscValidationRegex.test(bank.ifsc?.toUpperCase())) {
        return res
          .status(400)
          .json({ message: "Invalid IFSC code in bank details" });
      }

      if (bank.accountNumber !== bank.confirmAccountNumber) {
        return res.status(400).json({ message: "Account numbers don't match" });
      }

      // Remove confirmAccountNumber before saving
      delete bank.confirmAccountNumber;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "seller",
      gst: gst.toUpperCase(),
      pan: pan.toUpperCase(),
      addhaar,
      panDoc: `${baseUrl}/uploads/${panDoc.filename}`,
      addhaarDoc: `${baseUrl}/uploads/${addhaarDoc.filename}`,
      addresses: [],
      banks: [],
    });

    // Create address documents
    const addressPromises = parsedAddresses.map(async (addr) => {
      const address = await Address.create({
        ...addr,
        userId: user._id,
      });
      return address._id;
    });

    const addressIds = await Promise.all(addressPromises);

    // Create bank documents
    const bankPromises = parsedBanks.map(async (bank) => {
      const bankDoc = await Bank.create({
        ...bank,
        userId: user._id,
      });
      return bankDoc._id;
    });

    const bankIds = await Promise.all(bankPromises);

    // Update user with references
    user.addresses = addressIds;
    user.banks = bankIds;
    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Get populated user data
    const populatedUser = await User.findById(user._id)
      .populate("addresses")
      .populate("banks")
      .select("-password");

    return res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      token,
      user: populatedUser,
    });
  } catch (error) {
    console.error("Seller registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
