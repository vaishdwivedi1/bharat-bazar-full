import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  addhaarValidationRegex,
  gstValidationRegex,
  ifscValidationRegex,
  panValidationRegex,
} from "../utils/Constants.js";
import { Address } from "../models/Address.js";
import { Bank } from "../models/Bank.js";

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

export const createSeller = async (req, res) => {
  try {
    //  Form-data se ye sab aayega
    const {
      email,
      mobile,
      password,
      gst,
      pan,
      addhaar,
      name,
      addresses, // Stringified JSON array hoga form-data mein
      banks, // Stringified JSON array hoga form-data mein
    } = req.body;

    //  Files - ye sirf form-data se aayengi
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const panDoc = req.files?.panDoc?.[0]?.filename;
    const addhaarDoc = req.files?.addhaarDoc?.[0]?.filename;

    //  Basic required validation
    if (
      !email ||
      !mobile ||
      !password ||
      !gst ||
      !pan ||
      !addhaar ||
      !name ||
      !panDoc ||
      !addhaarDoc
    ) {
      return res.status(400).json({ message: "Basic fields missing" });
    }

    // Addresses required
    if (!addresses) {
      return res.status(400).json({
        message: "At least one address is required",
      });
    }

    // Banks required
    if (!banks) {
      return res.status(400).json({
        message: "At least one bank detail is required",
      });
    }

    //  Parse karo addresses aur banks (kyunki form-data mein string aata hai)
    let parsedAddresses;
    let parsedBanks;

    try {
      parsedAddresses =
        typeof addresses === "string" ? JSON.parse(addresses) : addresses;

      parsedBanks = typeof banks === "string" ? JSON.parse(banks) : banks;
    } catch (err) {
      return res.status(400).json({
        message: "Invalid address or bank format",
      });
    }

    if (!Array.isArray(parsedAddresses) || parsedAddresses.length === 0) {
      return res.status(400).json({
        message: "At least one address required",
      });
    }

    if (!Array.isArray(parsedBanks) || parsedBanks.length === 0) {
      return res.status(400).json({
        message: "At least one bank required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Validations
    if (!gstValidationRegex.test(gst.toUpperCase())) {
      return res.status(400).json({ message: "Invalid GST" });
    }

    if (!panValidationRegex.test(pan.toUpperCase())) {
      return res.status(400).json({ message: "Invalid PAN" });
    }

    if (!addhaarValidationRegex.test(addhaar)) {
      return res.status(400).json({ message: "Invalid Aadhaar" });
    }

    // Validate each bank IFSC
    for (let bank of parsedBanks) {
      if (!ifscValidationRegex.test(bank.ifsc?.toUpperCase())) {
        return res
          .status(400)
          .json({ message: "Invalid IFSC in bank details" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Pehle User create karo (bina addresses aur banks ke)
    const user = await User.create({
      email,
      mobile,
      name,
      password: hashedPassword,
      role: "seller",
      gst: gst.toUpperCase(),
      pan: pan.toUpperCase(),
      addhaar,
      panDoc: `${baseUrl}/uploads/${panDoc}`,
      addhaarDoc: `${baseUrl}/uploads/${addhaarDoc}`,
      addresses: [], // Empty array abhi
      banks: [], // Empty array abhi
    });

    // Step 2: Address documents create karo aur user ID set karo
    const addressPromises = parsedAddresses.map(async (addr) => {
      const address = await Address.create({
        ...addr,
        userId: user._id, // User ka reference add karo
      });
      return address._id;
    });

    const addressIds = await Promise.all(addressPromises);

    // Step 3: Bank documents create karo aur user ID set karo
    const bankPromises = parsedBanks.map(async (bank) => {
      const bankDoc = await Bank.create({
        ...bank,
        userId: user._id, // User ka reference add karo
      });
      return bankDoc._id;
    });

    const bankIds = await Promise.all(bankPromises);

    // Step 4: User update karo with address and bank references
    user.addresses = addressIds;
    user.banks = bankIds;
    await user.save();

    // Step 5: Token generate karo
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    // Step 6: Populated user data return karo
    const populatedUser = await User.findById(user._id)
      .populate("addresses")
      .populate("banks")
      .select("-password"); // Password mat bhejo

    return res.status(201).json({
      success: true,
      message: "Seller created successfully",
      token,
      user: populatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
