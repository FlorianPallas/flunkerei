import { FibbageState } from "./fibbage";

export interface OutgoingEvents {
  join: (name: string) => void;
  leave: (name: string) => void;
  "host-switch": () => void;
  hello: (code: string) => void;
  state: (value: FibbageState) => void;
  submit: (name: string, value: string) => void;
}

export interface IncomingEvents {
  state: (value: FibbageState) => void;
  submit: (value: string) => void;
}

export interface InterServerEvents {}

export type SocketData = { name: string; code?: string };
