import { Server } from "socket.io";
import { createServer } from "http";

const server = createServer();

/**
 * @type {import('socket.io').Server<import("shared/socket").ClientToServerEvents, import("shared/socket").ServerToClientEvents, import("shared/socket").InterServerEvents, import("shared/socket").SocketData>}
 */
const io = new Server(server, { cors: { origin: "*" } });

/** @type {import('shared/fibbage').FibbageState} */
let state = { type: "lobby", players: {}, submissions: {} };

io.use((socket, next) => {
  const auth = socket.handshake.auth;
  switch (auth.type) {
    case "player":
      socket.data = {
        type: "player",
        name: auth.name,
      };
      break;
    case "spectator":
      socket.data = {
        type: "spectator",
      };
      break;
    default:
      return next(new Error("invalid-type"));
  }
  next();
});

io.on("connection", (socket) => {
  console.log("got connection from", socket.data);

  if (socket.data.type !== "player") {
    return;
  }

  // if the player is not in the game, add them
  if (state.players[socket.data.name] === undefined) {
    state.players[socket.data.name] = 0;
  }

  sync();

  socket.on("submit", (submission) => {
    // ignore submissions from spectators
    if (socket.data.type !== "player") {
      return;
    }

    switch (state.type) {
      case "lobby": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length
        ) {
          state = {
            type: "ask",
            players: state.players,
            submissions: {}, // reset submissions
          };
        }

        break;
      }
      case "ask": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length
        ) {
          state = {
            type: "answer",
            players: state.players,
            questions: state.submissions,
            mappings: generateQuestionMappings(state.submissions),
            submissions: {}, // reset submissions
          };
        }
        break;
      }
      case "answer": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length
        ) {
          state = {
            type: "fibbage.lie",
            round: 0,

            players: state.players,
            questions: state.questions,
            mappings: state.mappings,
            answers: state.submissions,

            submissions: {}, // reset submissions
          };
        }
        break;
      }
      case "fibbage.lie": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length - 1 // one less because the victim can't submit a lie
        ) {
          state = {
            type: "fibbage.vote",
            round: state.round,

            players: state.players,
            questions: state.questions,
            mappings: state.mappings,
            answers: state.answers,
            lies: state.submissions,

            submissions: {}, // reset submissions
          };
        }
        break;
      }
      case "fibbage.vote": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length - 1 // one less because the victim can't cast a vote
        ) {
          state = {
            type: "fibbage.reveal",
            round: state.round,

            players: state.players,
            questions: state.questions,
            mappings: state.mappings,
            answers: state.answers,
            lies: state.lies,
            votes: state.submissions,

            submissions: {}, // reset submissions
          };
        }
        break;
      }
      case "fibbage.reveal": {
        state.submissions[socket.data.name] = submission;

        if (
          Object.keys(state.submissions).length ===
          Object.keys(state.players).length
        ) {
          state.round++;

          // end of the game
          if (state.round === Object.keys(state.players).length) {
            state = {
              type: "lobby",
              players: state.players,
              submissions: {},
            };
            break;
          }

          state = {
            type: "fibbage.lie",
            round: state.round,

            players: state.players,
            questions: state.questions,
            mappings: state.mappings,
            answers: state.answers,

            submissions: {}, // reset submissions
          };
        }

        break;
      }
      default:
        break;
    }

    console.log("Flushing new state to players", state);

    sync();
  });
});

function sync() {
  io.emit("state", state);
}

server.listen(3000, "192.168.92.173", () => {
  console.log("server running at http://localhost:3000");
});

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @param {number} min
 * @param {number} max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Record<string,string>} questions
 * @returns
 */
function generateQuestionMappings(questions) {
  const authors = Object.keys(questions);
  const victims = Object.keys(questions);

  /** @type {Record<string,string>} */
  const mappings = {};

  // pick random author
  while (authors.length > 0) {
    let i = getRandomInt(0, authors.length - 1);
    let j = getRandomInt(0, victims.length - 1);

    // never assign the question to self
    if (authors[i] === victims[j]) {
      continue;
    }

    mappings[authors[i]] = victims[j];
    authors.splice(i, 1);
    victims.splice(j, 1);
  }

  return mappings;
}
