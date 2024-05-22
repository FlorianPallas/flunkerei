export type Prompt = TextPrompt | SelectPrompt | NonePrompt;

/**
 * A text prompt is a message that requires the user to input text.
 */
export type TextPrompt = {
  type: "text";
  message: string;
};

/**
 * A select prompt is a message that requires the user to select one of the options.
 */
export type SelectPrompt = {
  type: "select";
  message: string;
  options: { value: string; text: string }[];
};

/**
 * A none prompt is a message that does not require any user input.
 */
export type NonePrompt = {
  type: "none";
};

/**
 * A message that is sent from the client to the server.
 */
export type ClientMessage = ClientJoinMessage | ClientSubmitMessage;

/**
 * When the client connects to the server, it sends a join message, telling the server the client's name.
 */
export type ClientJoinMessage = {
  type: "join";
  name: string;
};

/**
 * When the client submits a prompt, it tells the server the value of the prompt.
 */
export type ClientSubmitMessage = {
  type: "submit";
  value: string;
};
