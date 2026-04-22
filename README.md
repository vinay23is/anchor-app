# ⚓ Anchor

**A place for people fighting invisible wars.**

---

## The story behind this

There's a specific kind of loneliness that doesn't have a name yet.

It's the one felt by someone who moved countries to build a better life, who has a graduate degree and skills and drive — but still can't catch a break. Who smiles on LinkedIn while quietly panicking about visa deadlines, rent, and what to tell their parents back home. Who is surrounded by people but feels completely unseen.

That's who Anchor is built for.

Not the crisis. The slow grind. The Tuesday at 2pm when you're applying to your 200th job and you just need someone — or something — to remind you that you're not broken. That other people feel this exact thing. That you're going to be okay.

---

## What it actually does

You open the app. You type what's going on for you today — no filters, no polish. Just the real thing.

Anchor's AI responds immediately. Not with "I hear you" filler. Not with a list of breathing exercises. Like a friend who's been through something similar and actually gets it.

Then you see a few anonymous check-ins from other people who felt something similar today. Real words from real people. No usernames, no followers, no algorithms deciding who matters.

If someone's words hit close to home, you can reach out — anonymously. If they accept within 24 hours, a private chat opens. Two people, no names, just honesty.

The AI already responded either way. Nobody's left hanging.

---

## Who it's for

- Immigrant students and grads in the US grinding through unemployment and visa stress
- Anyone who feels the pressure of being high-potential in a world that isn't cooperating
- People who want human connection without the performance of social media
- Anyone who just needs somewhere honest to land

---

## How it works

```
Open app → Type what's real → AI responds instantly
                                      ↓
              See anonymous posts from people who felt similar
                                      ↓
              Send a "I've been there too" connect request
                                      ↓
              If accepted → anonymous real-time chat opens
              If not → AI already had your back
```

---

## Your identity here

When you sign in with Google, your email is converted into a random username like `Anchor#7361`. That's it. That's all anyone ever sees. Your name, your email, your identity — none of it exists inside this app.

---

## Built with

- **React + Tailwind CSS** — frontend
- **Firebase Auth** — Google login
- **Firestore** — real-time database and chat
- **Gemini AI** — the AI companion
- **Vercel** — hosting

Total monthly cost: **$0**. Built this way on purpose — it should be free forever for the people who need it most.

---

## Running it locally

```bash
git clone https://github.com/vinay23is/anchor-app.git
cd anchor-app
npm install
npm start
```

You'll need to set up your own Firebase project and Gemini API key and drop them into `src/firebase/config.js` and `src/utils/gemini.js`.

---

## The person who built this

My name is Vinay. I'm a CS grad who spent nearly a year unemployed after moving to the US. I know what it's like to have all the skills and none of the luck. I built Anchor because I needed it — and I think a lot of other people do too.

This isn't a startup pitch. It's just an app I made from scratch in a day because the problem felt real enough to solve.

---

*If this resonates with you — use it, share it, or just know you're not alone in whatever you're carrying right now.*
