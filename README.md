# Imposter Game

Imposter Game is a multiplayer web-based game where players are divided into regular players and imposters. The goal of the regular players is to identify the imposters, while the imposters try to blend in and avoid detection.

## Features

- Real-time multiplayer gameplay using WebSockets
- Admin panel for game settings
- Emote reactions
- Progressive Web App (PWA) support
- Responsive design

## Project Structure

```
.
├── backend/
│   ├── index.html
│   ├── package.json
│   ├── server.js
│   └── words.js
├── public/
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx
│   │   ├── EmoteReactions.tsx
│   │   ├── GameScreen.tsx
│   │   ├── InstallPWA.tsx
│   │   ├── PlayerList.tsx
│   │   ├── TutorialModal.tsx
│   │   └── WaitingScreen.tsx
│   ├── context/
│   │   ├── GameContext.tsx
│   │   └── WebSocketContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Game.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/shaikhsameer18/ImposterGame.git
cd ImposterGame
```

2. Install dependencies for the frontend:

```sh
npm install
```

3. Install dependencies for the backend:

```sh
cd backend
npm install
cd ..
```

### Running the Application

1. Start the backend server:

```sh
cd backend
npm run dev
```

2. Start the frontend development server:

```sh
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To build the project for production, run:

```sh
npm run build
```

## Linting

To lint the project, run:

```sh
npm run lint
```

## License

This project is licensed under the MIT License.