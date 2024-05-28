export type FibbageState =
  | LobbyPhase
  | AskPhase
  | AnswerPhase
  | FibbageLiePhase
  | FibbageVotePhase
  | FibbageRevealPhase;

export type Player = {
  state: "active" | "inactive";
};

export type LobbyPhase = {
  type: "lobby";
  code: string;
  host: string;
  players: Record<string, Player>;
  scores: Record<string, number>;

  /** Contains the ready status the player selected */
  submissions: Record<string, string>;
};

export type AskPhase = {
  type: "ask";
  code: string;
  host: string;
  players: Record<string, Player>;
  scores: Record<string, number>;

  /** Contains the text of the question the player submitted */
  submissions: Record<string, string>;
};

export type AnswerPhase = {
  type: "answer";
  code: string;
  host: string;

  players: Record<string, Player>;
  scores: Record<string, number>;
  questions: Record<string, string>;
  mappings: Record<string, string>;

  /** Contains the text of the answer the player submitted to their question */
  submissions: Record<string, string>;
};

export type FibbageLiePhase = {
  type: "fibbage.lie";
  code: string;
  host: string;
  round: number;

  players: Record<string, Player>;
  scores: Record<string, number>;
  questions: Record<string, string>;
  mappings: Record<string, string>;
  answers: Record<string, string>;

  /** Contains the text of the lie the player submitted */
  submissions: Record<string, string>;
};

export type FibbageVotePhase = {
  type: "fibbage.vote";
  code: string;
  host: string;
  round: number;

  players: Record<string, Player>;
  scores: Record<string, number>;
  questions: Record<string, string>;
  mappings: Record<string, string>;
  answers: Record<string, string>;
  lies: Record<string, string>;

  /** Contains the author of the lie the player voted for */
  submissions: Record<string, string>;
};

export type FibbageRevealPhase = {
  type: "fibbage.reveal";
  code: string;
  host: string;
  round: number;

  players: Record<string, Player>;
  scores: Record<string, number>;
  questions: Record<string, string>;
  mappings: Record<string, string>;
  answers: Record<string, string>;
  lies: Record<string, string>;
  votes: Record<string, string>;

  /** Contains the ready status the player selected */
  submissions: Record<string, string>;
};
