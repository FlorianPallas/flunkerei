import { FibbageState } from "./fibbage";

interface ServerToClientEvents {
  state: (newState: FibbageState) => void;
}

interface ClientToServerEvents {
  join: () => void;
  submit: (submission: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

type SocketData =
  | {
      type: "player";
      name: string;
    }
  | { type: "spectator" };
