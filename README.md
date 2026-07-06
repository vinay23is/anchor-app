# Anchor

An anonymous check-in and peer-support app for people quietly grinding through the hard parts — job searches, visa stress, the "everyone on LinkedIn looks fine but I'm not" feeling.

**Live Demo:** [anchor-app-hazel.vercel.app](https://anchor-app-hazel.vercel.app)

## What problem does this solve?

Most mental-health-adjacent apps either want you to journal into a void or perform wellness for an audience. Anchor is built around one specific moment: you type what's actually going on, get an immediate supportive response, and see that a handful of other anonymous people felt something similar today. If someone's post resonates, you can send an anonymous connect request — if they accept within 24 hours, a private chat opens between two people who never learn each other's names. I built this after a long stretch of post-grad unemployment, so the target user is deliberately narrow: high-effort, low-luck people who need to feel less alone without adding another social feed to perform on.

## Tech Stack
- **Frontend:** React 19 + React Router, Tailwind CSS
- **Backend/Database:** Firebase Auth (Google sign-in) + Firestore (check-ins, connect requests, chats, user streaks) — no custom server, the client talks to Firestore directly
- **AI layer:** `@google/generative-ai` (Gemini) dependency wired in for the companion response; the current deployed build (`src/utils/gemini.js`) returns from a small set of canned supportive responses rather than calling the live API — a placeholder that keeps the UX flow real while the API-key wiring gets finished
- **Infra/Deployment:** Vercel (free tier)

## Architecture

Everything lives in the browser — this is a Firebase-backed SPA, not a Node backend:

- `AuthContext` wraps the app and listens to Firebase Auth state; on first login it calls `getOrCreateUser` to create a Firestore user doc.
- Identity is stripped at the source: `generateUsername.js` hashes the user's email into a stable pseudonym (`Anchor#7361`) — the real email is never stored on the user-facing profile.
- A check-in write (`checkInService.js`) does two things in the same call: saves the entry to the `checkins` collection and updates a daily streak counter (compares `lastCheckIn` against today/yesterday to decide whether to increment, reset, or hold the streak).
- The feed (`feedService.js`) pulls the 20 most recent check-ins, filters out the current user's own posts, and shows 4.
- `connectService.js` implements the anonymous-connection flow as its own Firestore collection (`connect_requests`) with a `pending → accepted/declined` status and a 24-hour `expiresAt`; on acceptance it creates a `chats` document with both UIDs and their pseudonyms.
- Routing (`App.js`) protects every page except `/login` behind a `ProtectedRoute` that checks Firebase auth state.

## Key Features
- One-tap Google sign-in with an auto-generated, anonymous username — no profile setup
- Instant AI companion reply to whatever you type, with mood tracking that feeds a running streak
- Anonymous social feed of other users' recent check-ins (yours excluded)
- "I've been there too" connect requests with a 24-hour accept window, escalating to a private two-person chat with no real names attached
- Daily check-in streaks stored per user in Firestore

## Interesting Engineering Decisions
- Identity is derived, not stored: usernames are a deterministic hash of the user's email (`generateUsername.js`), so there's no separate "display name" field that could leak who someone is — regenerate the hash and you get the same pseudonym every time.
- Connect requests expire by design (24-hour `expiresAt` field) so an unanswered "I've been there too" doesn't sit there forever as social pressure.
- The AI reply and the anonymous feed are fetched in parallel (`Promise.all`) after the check-in write, so the user isn't waiting on two sequential round trips for one action.
- No custom backend at all — auth, database, and real-time chat all run through Firebase/Firestore directly from the client, which is what keeps the whole thing running at $0/month on Vercel's free tier.

## Running Locally
```bash
git clone https://github.com/vinay23is/anchor-app.git
cd anchor-app
npm install
npm start
```
You'll need your own Firebase project (Auth + Firestore enabled) and a Gemini API key. Drop the Firebase config into `src/firebase/config.js` and wire your Gemini key into `src/utils/gemini.js` to replace the mock responses.
