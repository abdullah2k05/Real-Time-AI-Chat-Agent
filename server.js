import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import session from "express-session";

import { handleUserInput } from "./brain.js";
import { getChatHistory, saveChatMessage, clearChatHistory } from "./redis.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
  }),
);

const port = process.env.PORT || 3000;
const storeName = process.env.SHOP_NAME || "Your Store Name";

const activeSessions = {};
// --------------Middleware to verify session token ----------------
const verifySessionToken = (req, res, next) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userID = decoded.userID;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
};

// ---------------GET USER ID ------------------
function getUserID(req) {
  return req.userID || req.session?.id || "guest";
}

// 1: Session verification
app.post("/api/auth/start", (req, res) => {
  const userID = req.body.userID;
  if (!userID) {
    return res.status(400).json({ error: "userID is required" });
  }
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.json({ success: true, token });
});

// 2: Start of the session
app.post("/chat", verifySessionToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const userID = req.userID;
    // load the memory of the chat from redis
    const history = await getChatHistory(userID);

    //  call the brain
    const response = await handleUserInput(message, history);

    // save the chat again in redis
    await saveChatMessage(userID, message, response);

    //time to return the response to the frontend
    res.json({ reply: response, userID });
  } catch (err) {
    console.error("Error handling chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/auth/refresh", (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign(
      { userID: decoded.userID },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );
    res.cookie("auth_token", newToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});
// Start Server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
