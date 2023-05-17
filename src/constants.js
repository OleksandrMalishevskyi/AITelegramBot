/* eslint-disable max-len */
const INITIAL_SESSION = {
  messages: [],
  languageCode: "ru-RU",
};

const languages = {
  ukr: {code: "uk-UA", message: "Switched to Ukrainian language"},
  rus: {code: "ru-RU", message: "Switched to Russian language"},
  pln: {code: "pl-PL", message: "Switched to Polish language"},
  deu: {code: "de-DE", message: "Switched to German language"},
  eng: {code: "en-US", message: "Switched to English language"},
  start: {message: "Hello, I'm an AI, you can ask me questions via voice messages and I'll answer you like this"},
  new: {message: "Waiting for your text or voice message"},
};

const roles = {
  ASSISTANT: "assistant",
  USER: "user",
  SYSTEM: "system",
};
module.exports = {INITIAL_SESSION, languages, roles};
