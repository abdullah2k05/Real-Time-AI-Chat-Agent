import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const MAXMESSAGES = 30;

const redisClient = createClient();

// forgot this
// await redisClient.connect();
// Redis connection logs
await redisClient.connect();
redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

// Connect Redis (call this once in server.js at startup)

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

//Build consistent Redis key for each user

function getChatKey(userID) {
  return `chat_history:${userID}`;
}

//Get chat history from Redis

export async function getChatHistory(userID) {
  try {
    const key = getChatKey(userID);

    const history = await redisClient.get(key);

    if (!history) {
      return [];
    }

    return JSON.parse(history);
  } catch (err) {
    console.error("Error getting chat history:", err);
    return [];
  }
}

// Save a new user + assistant message pair

export async function saveChatMessage(userID, userMessage, aiResponse) {
  try {
    const key = getChatKey(userID);

    const history = await getChatHistory(userID);

    // 1. Add new messages first
    history.push({
      role: "user",
      content: userMessage,
    });

    history.push({
      role: "assistant",
      content: aiResponse,
    });

    // 2. Trim AFTER pushing (important)
    if (history.length > MAXMESSAGES) {
      history.splice(0, history.length - MAXMESSAGES);
    }

    // 3. Save back to Redis
    await redisClient.set(key, JSON.stringify(history));

    // 4. Set expiry (30 minutes inactivity)
    await redisClient.expire(key, 30 * 60);
  } catch (err) {
    console.error("Error saving chat message:", err);
  }
}

// Clear chat history (reset conversation)

export async function clearChatHistory(userID) {
  try {
    const key = getChatKey(userID);
    await redisClient.del(key);
  } catch (err) {
    console.error("Error clearing chat history:", err);
  }
}
