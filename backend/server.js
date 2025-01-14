import { WebSocketServer } from "ws";
import { createServer } from "http";
import { wordCategories } from "./words.js";

const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running");
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
