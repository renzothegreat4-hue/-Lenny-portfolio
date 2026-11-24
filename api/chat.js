import chatHandler from "../backend/chat.js";

export default function handleChatRequest(req, res) {
  return chatHandler(req, res);
}
