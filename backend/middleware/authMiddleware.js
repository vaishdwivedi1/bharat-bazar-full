import jwt from "jsonwebtoken";

export const isAdmin = async (req, res, next) => {
  try {
    // const { email } = req.body; // not this anyone can send this and hack my middlewrare

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export const isValidToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(400).json({ message: "User not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role != "seller")
      return res.status(403).json({ message: "Access denied" });

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
