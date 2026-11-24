# Renzo portfolio

## Project structure

- `frontend/` contains the React website: `frontend/src/` has the app and styles, and `frontend/public/` has static files.
- `backend/chat.js` validates chat requests and calls Gemini without saving conversations on this site. The frontend calls it through `/api/chat`.
- `api/chat.js` is the small Vercel serverless-function entry point; it forwards requests to `backend/chat.js`.
- `shared/personalInfo.js` is the file to edit for portfolio information used by both the website and Renzo AI.
- Root configuration files (`package.json`, `vite.config.js`, and `.env.example`) run and configure the project.

## Edit portfolio information

Update [`shared/personalInfo.js`](./shared/personalInfo.js) to change the name, location, bio, interests, current focus, fun facts, skills, projects, journey, contact details, and social links. Renzo AI uses the personal details in this file when answering questions about Lawrence. Facebook, Instagram, TikTok, X, and Snapchat icons appear beside the copyright in the footer. Add a social `handle` and `url` in the `socials` list to make that icon link to your profile; unconfigured icons remain visible but are not clickable.

Replace `frontend/public/profile.png` with your own portrait to update the hero image.

## Run locally

```powershell
npm install
npm run dev
```

## Configure the AI assistant

The chat uses Google's Gemini 4 Hydrogen through the Gemini Interactions API. It is a general-purpose assistant that can answer everyday questions, explain concepts, brainstorm, and help with writing or code; it also uses the portfolio details in `shared/personalInfo.js` when asked about Lawrence. The model currently has a free tier with usage limits.

To configure the API key locally:

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. In the project root (the same folder as `package.json`), run `Copy-Item .env.example .env.local` in PowerShell.
3. Open the root `.env.local` and set `GEMINI_API_KEY=your_new_key`.
4. Restart `npm run dev` if it was already running.

The key belongs in this root `.env.local` file, which is read by the backend and ignored by Git. Never put it in `frontend/`, browser code, a `VITE_` variable, or a committed file. The `.env.example` contains a blank key placeholder and the tested `gemini-3.5-flash-lite` model default. Change `GEMINI_MODEL` if you want to use another available model. For production on Vercel, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in the project's server-side Environment Variables settings.

If you already pasted a key into chat or another shared location, revoke it in Google AI Studio and use a newly generated key.

The assistant cannot guarantee an answer to every possible message or provide live web results. Conversations are not saved by this site, and requests use `store: false`; messages are still sent to Google to generate replies, and provider policies may apply. Do not send private or sensitive information. The Vite development server exposes the chat endpoint at `/api/chat`. The chat enforces message and length limits; add provider-side usage limits before sharing it publicly.

## Build

```powershell
npm run build
```
