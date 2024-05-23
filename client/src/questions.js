/**
 * @type {string[]}
 */
export const questions = ["TODO"];

export const getRandomQuestion = () => {
  return questions[Math.floor(Math.random() * questions.length)];
};
