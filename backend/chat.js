import { portfolio } from "../shared/personalInfo.js";

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1_500;

function respond(res, status, payload) {
  if (typeof res.status === "function") {
    return res.status(status).json(payload);
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  let rawBody = "";
  for await (const chunk of req) {
    rawBody += chunk.toString();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }
  return JSON.parse(rawBody);
}

function isValidMessages(messages) {
  return Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every((message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= MAX_MESSAGE_LENGTH
    ) &&
    messages[messages.length - 1].role === "user";
}

export default async function handleChatRequest(req, res) {
  if (req.method !== "POST") {
    return respond(res, 405, { error: "Use POST to send a message." });
  }

  let body;
  try {
    body = await readRequestBody(req);
  } catch (error) {
    const status = error.statusCode || 400;
    return respond(res, status, { error: status === 413 ? error.message : "The message request was not valid JSON." });
  }

  if (!isValidMessages(body?.messages)) {
    return respond(res, 400, { error: "Send up to 10 user or assistant messages, each under 1,500 characters." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return respond(res, 503, { error: "AI chat is not configured yet. Add GEMINI_API_KEY to the server environment." });
  }

  const profileContext = [
    `Name: ${portfolio.fullName} (${portfolio.name}).`,
    `Student status: ${portfolio.studentStatus}.`,
    `Location: ${portfolio.location}.`,
    `Role: ${portfolio.role}.`,
    `Introduction: ${portfolio.intro}`,
    `About: ${portfolio.about}`,
    `Approach: ${portfolio.approach}`,
    `Interests: ${portfolio.interests.join(", ")}.`,
    `Current focus: ${portfolio.currentFocus}`,
    `Fun facts: ${portfolio.funFacts.join(" ")}`,
    `Skills: ${portfolio.skills.map(({ category, items }) => `${category}: ${items.join(", ")}`).join("; ")}.`,
    `Projects: ${portfolio.projects.map(({ title, description, technologies }) => `${title}: ${description} Technologies: ${technologies.join(", ")}.`).join(" ")}`,
    `Journey: ${portfolio.journey.map(({ period, title, detail }) => `${period} — ${title}: ${detail}`).join(" ")}`,
    `Contact email: ${portfolio.email}.`,
  ].join("\n");

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        input: body.messages.map(({ role, content }) => ({
          type: role === "assistant" ? "model_output" : "user_input",
          content: [{ type: "text", text: content }],
        })),
        system_instruction: `You are Renzo's AI assistant, powered by a language model. You are a capable general-purpose assistant, not a scripted FAQ or portfolio-only bot. Answer questions across everyday topics; explain concepts; help with brainstorming, writing, learning, and coding. Respond clearly and warmly, adapt the depth to the request, and ask a brief follow-up only when it would help.

Use your general knowledge for general questions, but be honest about uncertainty. You cannot browse the web or guarantee real-time information, so never imply that you checked current sources. Follow safety boundaries and do not claim to be Lawrence or a human.

When asked about Lawrence or Renzo, use only the portfolio details below. Do not invent personal history, qualifications, completed work, or results. If a detail is missing, say it is not provided.

Portfolio details:
${profileContext}`,
        generation_config: { max_output_tokens: 1200 },
        store: false,
        stream: true,
      }),
    });
  } catch (error) {
    console.error("Could not reach the Gemini API:", error);
    return respond(res, 502, { error: "Could not reach the AI service. Please try again." });
  }

  if (!upstream.ok) {
    let result;
    try {
      result = await upstream.json();
    } catch (error) {
      console.error("Gemini returned a non-JSON error response:", error);
      return respond(res, 502, { error: "The AI service returned an unreadable response. Please try again." });
    }

    const errorCode = result?.error?.status || result?.error?.code || "unknown error";
    console.error("Gemini API request failed:", upstream.status, errorCode);
    let status = 502;
    let message = "The AI service could not answer right now. Please try again.";

    if (upstream.status === 429) {
      status = 429;
      message = "The free AI quota may be temporarily exhausted. Please try again later.";
    } else if (upstream.status === 503) {
      status = 503;
      message = "Gemini is temporarily overloaded. Please try again in a few minutes.";
    } else if (upstream.status === 401 || upstream.status === 403) {
      message = "Gemini rejected the API key or project access. Check the server-side GEMINI_API_KEY and Gemini API access.";
    } else if (upstream.status === 404) {
      message = "The configured Gemini model was not found. Check the server-side GEMINI_MODEL.";
    }

    return respond(res, status, { error: message });
  }

  if (!upstream.body) {
    console.error("Gemini returned an empty response stream.");
    return respond(res, 502, { error: "The AI service returned an empty answer. Please try again." });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") res.flushHeaders();

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const outputSteps = new Set();
  let buffer = "";
  let eventName = "";
  let eventData = [];
  let streamFailed = false;

  const send = (payload) => res.write(`${JSON.stringify(payload)}\n`);
  const processEvent = () => {
    if (eventData.length === 0) {
      eventName = "";
      return;
    }

    const rawData = eventData.join("\n");
    const currentEvent = eventName;
    eventName = "";
    eventData = [];
    if (rawData === "[DONE]") return;

    let data;
    try {
      data = JSON.parse(rawData);
    } catch (error) {
      console.error("Gemini returned an invalid streaming event:", error);
      send({ error: "The AI service returned an unreadable response. Please try again." });
      streamFailed = true;
      return;
    }

    if (currentEvent === "step.start" && data.step?.type === "model_output") {
      outputSteps.add(data.index);
    } else if (
      currentEvent === "step.delta" &&
      outputSteps.has(data.index) &&
      data.delta?.type === "text" &&
      typeof data.delta.text === "string"
    ) {
      send({ text: data.delta.text });
    } else if (currentEvent === "interaction.failed" || currentEvent === "error") {
      const detail = data.interaction?.errors?.[0]?.message || data.error?.message || data.message;
      console.error("Gemini interaction stream failed:", detail || "unknown error");
      send({ error: "The AI service could not finish the response. Please try again." });
      streamFailed = true;
    }
  };

  const processLine = (line) => {
    const normalizedLine = line.endsWith("\r") ? line.slice(0, -1) : line;
    if (!normalizedLine) {
      processEvent();
      return;
    }
    if (normalizedLine.startsWith(":")) return;

    const separator = normalizedLine.indexOf(":");
    const field = separator < 0 ? normalizedLine : normalizedLine.slice(0, separator);
    let value = separator < 0 ? "" : normalizedLine.slice(separator + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") eventName = value;
    if (field === "data") eventData.push(value);
  };

  try {
    while (!streamFailed) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      let newlineIndex = buffer.indexOf("\n");
      while (newlineIndex !== -1) {
        processLine(buffer.slice(0, newlineIndex));
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf("\n");
        if (streamFailed) break;
      }

      if (done || streamFailed) break;
    }

    if (!streamFailed) {
      if (buffer) processLine(buffer);
      processEvent();
    }
  } catch (error) {
    console.error("Gemini response stream failed:", error);
    send({ error: "The AI response was interrupted. Please try again." });
  } finally {
    reader.releaseLock();
    res.end();
  }
}
