# 🎯 Retro Roulette

> An engaging, animated roulette picker designed for engineering teams to decide who speaks next in retrospectives.

---

## 🚀 Quick Start (Docker)

Run the entire full-stack application with a single command:

```bash
docker compose up --build
```

Once started:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
  - Standalone multi-stage Docker build
  - Custom SVG roulette wheel with exact target angle deceleration (`cubic-bezier(0.12, 0.85, 0.18, 1.0)`)
  - Web Audio API procedural ratchet ticks and victory chime (no external audio assets required)
  - Confetti burst effects via `canvas-confetti`
  - Real-time "Today's Turns" dot scoreboard (`●●●` / `—`)
- **Backend**: NestJS 10 + TypeScript
  - Clean modular architecture (`ParticipantsController`, `ParticipantsService`, `selection.util.ts`)
  - In-memory participant and turn management (no external database required)
  - Full CORS enabled for browser communication
- **Containerization**: Docker Compose
  - Multi-stage Node 20 Alpine containers for fast, minimal production images
  - Network bridging between frontend and backend services

---

## 🎲 Selection Logic

The selection algorithm is designed for retrospective fairness and engagement:

1. **Anti-Repeat Protection**: If there are 2 or more participants, the most recent speaker is excluded from the current roll to prevent back-to-back repeats.
2. **Weighted Probability by Turns**:
   - Each participant's turn count (`spokenCount`) is tracked in memory.
   - Candidates who have spoken fewer times receive a proportionally higher weight:
     $$\text{weight}_i = (\max(\text{spokenCounts}) - \text{spokenCount}_i + 1)$$
   - For example, if Alex has 2 turns, Sam has 1, Maya has 0, and Priya has 0:
     - Maya (0 turns) $\rightarrow$ weight 3 (33.3%)
     - Priya (0 turns) $\rightarrow$ weight 3 (33.3%)
     - Sam (1 turn) $\rightarrow$ weight 2 (22.2%)
     - Alex (2 turns) $\rightarrow$ weight 1 (11.1%)
3. **Decided by Backend**: The backend computes and stores the winner on `POST /spin`. The frontend receives the winner and animates the wheel so it lands directly on that participant.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/participants` | Returns all participants and their current `spokenCount` |
| `POST` | `/spin` | Selects next participant via weighted algorithm, increments their turn count, and returns `{ winner }` |
| `POST` | `/reset` | Resets all turn counts to 0 and clears the previous winner |

---

## 💻 Local Development (without Docker)

If you prefer running directly on your host machine:

### 1. Start Backend
```bash
cd backend
npm install
npm run start:dev
# Running on http://localhost:4000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### 3. Run Backend Selection Algorithm Tests
```bash
cd backend
node test-selection.js
```
