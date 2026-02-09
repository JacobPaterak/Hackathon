Varuna is a two‑part web app that tracks the environmental impact of AI prompts. 
The frontend is a React + Vite single‑page app with routes for landing, login/registration, and chat (logged in and guest). 
It shows a live leaderboard, user rank, and impact gauges (CO₂, water, energy) while you chat, with a clean dashboard-style UI.

The backend is a FastAPI service that powers authentication, sessions, and chat. 
It integrates with Google Gemini to generate responses, calculates token‑based impact metrics, stores users/sessions/leaderboard data in MongoDB, and exposes API endpoints for auth, chat, leaderboard, and rank. 
In production it also serves the built frontend from Frontend/dist so the UI and API can ship together.
