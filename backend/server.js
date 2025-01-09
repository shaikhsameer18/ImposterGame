import { WebSocketServer } from "ws";
import { createServer } from "http";
import { wordCategories } from "./words.js"; // Assuming 'words.js' contains word categories and words
// import { words } from "./words.js"; // If separate word list is used

const PORT = process.env.PORT || 8080;

// Create a basic HTTP server to handle static requests (for testing, or serving status)
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running");
});

// Create a WebSocket server that attaches to the HTTP server
const wss = new WebSocketServer({ server });

// Store rooms and players
const rooms = {};

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

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
        default:
          ws.send(
            JSON.stringify({ type: "error", message: "Unknown message type" })
          );
          break;
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => handleDisconnect(ws));
  ws.on("error", console.error);
});

// Update player count in a room and notify players
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
      player.ws.send(message); // Send message if WebSocket is open
    }
  });
};

// Handle joining a room
function handleJoin(ws, data) {
  const { roomId, playerName } = data;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      admin: null,
      currentImposterCount: 1,
      randomImposter: false,
    };
  }

  const room = rooms[roomId];
  const playerId = Math.random().toString(36).substr(2, 9);
  const player = { ws, name: playerName, id: playerId, isAdmin: false };

  room.players.push(player);

  if (room.players.length === 1) {
    player.isAdmin = true;
    room.admin = player;
    ws.send(JSON.stringify({ type: "joined", isAdmin: true, playerId }));
  } else {
    ws.send(JSON.stringify({ type: "joined", isAdmin: false, playerId }));
  }

  updatePlayerCount(roomId);
}

// Handle kicking a player from the room
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

// Handle updating the imposter count
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

// Handle starting a new game
function handleGameStart(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  startNewGame(room, data.imposterCount, data.randomImposter);
}

// Handle starting the next game
function handleNextGame(ws, data) {
  const room = rooms[data.roomId];
  if (!room || ws !== room.admin?.ws) return;

  startNewGame(room, data.imposterCount, data.randomImposter);
}

// Start a new game with a given imposter count and randomization option
function startNewGame(room, imposterCount, randomImposter) {
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

  // Select random category and word (either from wordCategories or words)
  const categories = Object.keys(wordCategories);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const categoryWords = wordCategories[randomCategory]?.words || words;
  const chosenWord =
    categoryWords[Math.floor(Math.random() * categoryWords.length)];

  const imposters = new Set();
  while (imposters.size < finalImposterCount) {
    const randomIndex = Math.floor(Math.random() * room.players.length);
    imposters.add(room.players[randomIndex]);
  }

  const imposterNames = Array.from(imposters).map((player) => player.name);

  room.players.forEach((player) => {
    if (imposters.has(player)) {
      player.ws.send(
        JSON.stringify({
          type: "gameStart",
          word: null,
          category: wordCategories[randomCategory]?.name || "Unknown",
          imposters: imposterNames,
        })
      );
    } else {
      player.ws.send(
        JSON.stringify({
          type: "gameStart",
          word: chosenWord,
          category: wordCategories[randomCategory]?.name || "Unknown",
        })
      );
    }
  });
}

// Handle player disconnect
function handleDisconnect(ws) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    const playerIndex = room.players.findIndex((player) => player.ws === ws);

    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);

      if (ws === room.admin?.ws && room.players.length > 0) {
        room.admin = room.players[0];
        room.admin.isAdmin = true;
        room.admin.ws.send(JSON.stringify({ type: "joined", isAdmin: true }));
      }

      updatePlayerCount(roomId);

      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  }
}

// Start the HTTP and WebSocket servers
console.log(`WebSocket server is running on port ${PORT}`);
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
