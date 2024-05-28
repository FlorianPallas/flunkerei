import { Server } from "socket.io";
import { createServer } from "http";
import { getRandomInt } from "shared";

const server = createServer();

/**
 * @typedef {import('socket.io').Socket<import("shared/socket").IncomingEvents, import("shared/socket").OutgoingEvents, import("shared/socket").InterServerEvents, import("shared/socket").SocketData>} Socket
 */

/**
 * @type {Server<import("shared/socket").IncomingEvents, import("shared/socket").OutgoingEvents, import("shared/socket").InterServerEvents, import("shared/socket").SocketData>}
 */
const io = new Server(server, { cors: { origin: "*" } });

/**
 * @typedef {{ host: { name: string; socket: Socket }; clients: Map<string, Socket>; }} Room
 */

/** @type {Map<string, Room>} */
const rooms = new Map();

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 4;

io.use((socket, next) => {
  const auth = socket.handshake.auth;

  if (!auth.name) {
    return next(new Error("Name is required"));
  }

  if (auth.code && !rooms.has(auth.code)) {
    return next(new Error("Room not found"));
  }

  socket.data = { name: auth.name, code: auth.code };

  next();
});

io.on("connection", (socket) => {
  let room = socket.data.code ? rooms.get(socket.data.code) : undefined;

  if (!room) {
    console.log("Creating new room");

    /** @type {Room} */
    room = {
      host: { name: socket.data.name, socket },
      clients: new Map([[socket.data.name, socket]]),
    };

    /** @type {string} */
    let code;
    do {
      code = "";
      for (let i = 0; i < CODE_LENGTH; i++) {
        code += CODE_ALPHABET[getRandomInt(0, CODE_ALPHABET.length - 1)];
      }
    } while (rooms.has(code));

    rooms.set(code, room);
    socket.data.code = code;
    room.host.socket.emit("hello", code);
  } else {
    console.log("Joining existing room");
    room.clients.set(socket.data.name, socket);
  }

  // notify server about new client
  room.host.socket.emit("join", socket.data.name);

  socket.on("disconnect", () => {
    if (!room) {
      return;
    }
    room.clients.delete(socket.data.name);

    // delete room if no clients are left
    if (room.clients.size === 0) {
      console.log("Deleting room");
      if (socket.data.code) {
        rooms.delete(socket.data.code);
      }
      console.log(rooms.size);
      return;
    }

    // switch host if the current host disconnected
    if (room.host.name === socket.data.name) {
      console.log("switching host");
      const newHost = Array.from(room.clients.entries())[0];
      room.host = {
        name: newHost[0],
        socket: newHost[1],
      };
    }

    room.host.socket.emit("host-switch");
    room.host.socket.emit("leave", socket.data.name);
  });

  socket.on("state", (value) => {
    // broadcast state to all clients
    room.clients.forEach((client) => {
      client.emit("state", value);
    });
  });

  socket.on("submit", (value) => {
    // redirect submit to host
    room.host.socket.emit("submit", socket.data.name, value);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
