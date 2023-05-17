/* eslint-disable require-jsdoc */
const {Telegraf, session} = require("telegraf");
const {message} = require("telegraf/filters");
const {code} = require("telegraf/format");
const dotenv = require("dotenv");
const {INITIAL_SESSION, languages} = require("./src/constants.js");
const {synthesizeSpeech} = require("./src/speech.js");
const {ogg} = require("./src/ogg.js");
const {openai} = require("./src/openai.js");

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.use(session());

Object.entries(languages).forEach(([command, {code, message}]) => {
  bot.command(command, async (ctx) => {
    if (typeof ctx.session === "undefined") {
      ctx.session = INITIAL_SESSION;
    }
    ctx.session.languageCode = code;
    await ctx.reply(message);
  });
});

bot.on(message("voice"), async (ctx) => {
  if (typeof ctx.session === "undefined") {
    ctx.session = INITIAL_SESSION;
  }
  try {
    await ctx.reply(
        code("Message received! Waiting for reply from server...."),
    );
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);
    await ctx.reply(code(`Your request: ${text}`));

    ctx.session.messages.push({role: openai.roles.USER, content: text});
    const response = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });
    await ctx.reply("Bot: " + response.content, {
      reply_to_message_id: ctx.message.message_id,
    });
    // eslint-disable-next-line max-len
    const outputFile = await synthesizeSpeech(response.content, ctx.session.languageCode);
    await ctx.replyWithVoice({source: outputFile});
  } catch (e) {
    console.log(`Error while voice message`, e.message);
  }
});
bot.on(message("text"), async (ctx) => {
  if (typeof ctx.session === "undefined") {
    ctx.session = INITIAL_SESSION;
  }
  try {
    await ctx.reply(
        code("Message received! Waiting for reply from server...."),
    );
    ctx.session.messages.push({
      role: openai.roles.USER,
      content: ctx.message.text,
    });
    const response = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });
    await ctx.reply("Bot: " + response.content, {
      reply_to_message_id: ctx.message.message_id,
    });
  } catch (e) {
    console.log(`Error while voice message`, e.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
