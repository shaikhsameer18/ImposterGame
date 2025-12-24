import { WebSocketServer } from "ws";
import { createServer } from "http";
import { wordCategories } from "./words.js";

const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Imposter Game - Backend Server</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #1a1525 0%, #2d2438 50%, #1a1525 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          color: white;
          height: 100vh;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Floating orbs */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(251, 146, 60, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .container {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
        }
        
        .glass-card {
          background: rgba(74, 63, 92, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 0 50px rgba(168, 85, 247, 0.2);
        }
        
        .icon-container {
          display: inline-flex;
          padding: 1rem;
          border-radius: 20px;
          background: rgba(168, 85, 247, 0.2);
          border: 1px solid rgba(168, 85, 247, 0.3);
          margin-bottom: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
        }
        
        .icon {
          width: 48px;
          height: 48px;
          stroke: #c084fc;
          stroke-width: 2;
          fill: none;
        }
        
        h1 {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #d8b4fe 0%, #93c5fd 50%, #fdba74 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #86efac;
          margin-bottom: 1.25rem;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
        
        .info-card {
          background: rgba(74, 63, 92, 0.3);
          border: 1px solid rgba(125, 109, 150, 0.3);
          border-radius: 12px;
          padding: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          background: rgba(74, 63, 92, 0.5);
          border-color: rgba(168, 85, 247, 0.5);
          transform: translateY(-2px);
        }
        
        .info-label {
          font-size: 0.75rem;
          color: #d4cde0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        
        .info-value {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #c084fc 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .description {
          color: #d4cde0;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-top: 1rem;
        }
        
        .footer {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(125, 109, 150, 0.2);
          font-size: 0.7rem;
          color: #9b8db0;
        }
        
        .heart {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.1); }
          20%, 40% { transform: scale(1); }
        }
        
        @media (max-width: 640px) {
          h1 { font-size: 2rem; }
          .info-grid { grid-template-columns: 1fr; }
          .glass-card { padding: 2rem 1.5rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="glass-card">
          <div class="icon-container">
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <h1>Imposter Game</h1>
          
          <div class="status">
            <span class="status-dot"></span>
            Backend Server Running
          </div>
          
          <p class="description">
            WebSocket server is active and ready to handle game connections. 
            Players can now join rooms and start playing!
          </p>
          
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">Port</div>
              <div class="info-value">${PORT}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Protocol</div>
              <div class="info-value">WS</div>
            </div>
            <div class="info-card">
              <div class="info-label">Status</div>
              <div class="info-value">✓ Online</div>
            </div>
            <div class="info-card">
              <div class="info-label">Active Rooms</div>
              <div class="info-value">${Object.keys(rooms).length}</div>
            </div>
          </div>
          
          <div class="footer">
            Made with <span class="heart">♥</span> | Imposter Game Backend
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

const wss = new WebSocketServer({ server });

const rooms = {};

wss.on("connection", (ws) => {
  let userName = "Unknown";

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "join") {
        userName = data.playerName;
        console.log(`User connected: ${userName}`);
      }

      switch (data.type) {
        case "join":
          handleJoin(ws, data);
          break;
        case "start":
          handleGameStart(ws, data);
          break;
        case "nextGame":
          handleNextGame(ws, data);
          break;
        case "kickPlayer":
          handleKickPlayer(ws, data);
          break;
        case "updateImposterCount":
          handleUpdateImposterCount(ws, data);
          break;
        case "adminUpdate":
          handleAdminUpdate(ws, data);
          break;
        case "emote":
          handleEmote(ws, data);
          break;
        default:
          ws.send(
            JSON.stringify({ type: "error", message: "Unknown message type" })
          );
          break;
      }
    } catch (error) {
      console.error(`Error handling message from ${userName}:`, error);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => {
    console.log(`User disconnected: ${userName}`);
    handleDisconnect(ws);
  });
  ws.on("error", (error) =>
    console.error(`WebSocket error for ${userName}:`, error)
  );
});

const updatePlayerCount = (roomId) => {
  const room = rooms[roomId];
  if (!room) return;

  const playerNames = room.players.map((player) => ({
    name: player.name,
    id: player.id,
  }));

  const message = JSON.stringify({
    type: "playerCount",
    count: room.players.length,
    players: playerNames,
  });

  room.players.forEach((player) => {
    if (player.ws.readyState === 1) {
      player.ws.send(message);
    }
  });
};

function handleJoin(ws, data) {
  const { roomId, playerName, password } = data;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      admin: null,
      currentImposterCount: 1,
      randomImposter: false,
      showCategories: true,
      gameStarted: false,
      password: password,
    };
  }

  const room = rooms[roomId];

  if (room.password && room.password !== password) {
    ws.send(JSON.stringify({ type: "error", message: "Incorrect password" }));
    return;
  }

  const playerId = Math.random().toString(36).substr(2, 9);
  const player = { ws, name: playerName, id: playerId, isAdmin: false };

  room.players.push(player);

  if (room.players.length === 1) {
    player.isAdmin = true;
    room.admin = player;
    ws.send(
      JSON.stringify({
        type: "joined",
        isAdmin: true,
        playerId,
        showCategories: room.showCategories,
        gameStarted: room.gameStarted,
        imposterCount: room.currentImposterCount,
        randomImposter: room.randomImposter,
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: "joined",
        isAdmin: false,
        playerId,
        showCategories: room.showCategories,
      })
    );
  }

  updatePlayerCount(roomId);
}

function handleGameStart(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  startNewGame(
    room,
    data.imposterCount,
    data.randomImposter,
    data.showCategories
  );
}

function handleNextGame(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  startNewGame(
    room,
    data.imposterCount,
    data.randomImposter,
    data.showCategories
  );
}

function startNewGame(room, imposterCount, randomImposter, showCategories) {
  const playersCount = room.players.length;
  let finalImposterCount = parseInt(imposterCount, 10);

  if (randomImposter) {
    finalImposterCount = Math.floor(Math.random() * finalImposterCount) + 1;
  }

  if (finalImposterCount >= playersCount) {
    room.admin.ws.send(
      JSON.stringify({
        type: "error",
        message: "Too many imposters for current player count",
      })
    );
    return;
  }

  const categories = Object.keys(wordCategories);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const categoryWords = wordCategories[randomCategory]?.words || [];
  const chosenWord =
    categoryWords[Math.floor(Math.random() * categoryWords.length)];

  const imposters = new Set();
  while (imposters.size < finalImposterCount) {
    const randomIndex = Math.floor(Math.random() * room.players.length);
    imposters.add(room.players[randomIndex]);
  }

  const imposterNames = Array.from(imposters).map((player) => player.name);

  room.showCategories = showCategories;
  room.gameStarted = true;
  room.currentImposterCount = imposterCount;
  room.randomImposter = randomImposter;

  room.players.forEach((player) => {
    const isImposter = imposters.has(player);
    player.ws.send(
      JSON.stringify({
        type: "gameStart",
        word: isImposter ? null : chosenWord,
        category:
          showCategories && !isImposter
            ? wordCategories[randomCategory]?.name
            : null,
        imposters: isImposter ? imposterNames : null,
        showCategories: showCategories,
        isImposter: isImposter,
      })
    );
  });
}

function handleKickPlayer(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  const playerToKick = room.players.find((p) => p.id === data.playerId);
  if (playerToKick) {
    playerToKick.ws.send(JSON.stringify({ type: "kicked" }));
    playerToKick.ws.close();
    room.players = room.players.filter((p) => p.id !== data.playerId);
    updatePlayerCount(data.roomId);
  }
}

function handleUpdateImposterCount(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  const newCount = parseInt(data.imposterCount, 10);
  if (newCount >= room.players.length) {
    room.admin.ws.send(
      JSON.stringify({
        type: "error",
        message: "Too many imposters for current player count",
      })
    );
    return;
  }

  room.currentImposterCount = newCount;
  room.players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: "imposterCountUpdated",
        count: newCount,
      })
    );
  });
}

function handleDisconnect(ws) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    const playerIndex = room.players.findIndex((player) => player.ws === ws);

    if (playerIndex !== -1) {
      const disconnectedPlayer = room.players[playerIndex];
      room.players.splice(playerIndex, 1);

      if (disconnectedPlayer === room.admin && room.players.length > 0) {
        room.admin = room.players[0];
        room.admin.isAdmin = true;

        room.admin.ws.send(
          JSON.stringify({
            type: "adminUpdate",
            isAdmin: true,
            showCategories: room.showCategories || true,
            gameStarted: room.gameStarted || false,
            imposterCount: room.currentImposterCount || 1,
            randomImposter: room.randomImposter || false,
          })
        );
      }

      room.players.forEach((player) => {
        player.ws.send(
          JSON.stringify({
            type: "playerCount",
            count: room.players.length,
            players: room.players.map((p) => ({
              name: p.name,
              id: p.id,
              isAdmin: p === room.admin,
            })),
            showCategories: room.showCategories,
          })
        );
      });

      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  }
}

function handleAdminUpdate(ws, data) {
  const room = rooms[data.roomId];
  if (!room) return;

  const player = room.players.find((p) => p.ws === ws);
  if (player) {
    player.isAdmin = data.isAdmin;
    if (data.isAdmin) {
      room.admin = player;
    }
    updatePlayerCount(data.roomId);
  }
}

function handleEmote(ws, data) {
  const room = rooms[data.roomId];
  if (!room) return;

  const player = room.players.find((p) => p.ws === ws);
  if (player) {
    room.players.forEach((p) => {
      if (p.ws.readyState === 1) {
        p.ws.send(
          JSON.stringify({
            type: "emote",
            playerId: player.id,
            playerName: player.name,
            emoteName: data.emoteName,
          })
        );
      }
    });
  }
}

console.log(`WebSocket server is running on port ${PORT}`);
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
