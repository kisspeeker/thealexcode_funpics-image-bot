import fs from 'fs';
import { Telegraf } from 'telegraf';

import { IMAGE_GENERATORS } from './src/imageGenerators.js';

import {
  BOT_TOKEN,
  CURRENT_IMAGE_GENERATOR,
  MESSAGES,
  LOGS_PATH,
  ADMIN_CHAT_ID,
  LOGS_TYPES,
  ERRORS,
} from './src/constants.js';

const bot = new Telegraf(BOT_TOKEN);

bot.catch(async (err, ctx) => {
  try {
    console.error(`${ctx.updateType}`, err);
    await logMessage(LOGS_TYPES.error, `type: ${ctx.updateType}. ${err}`)
  } catch(e) {
    console.error(e);
  }
});

bot.start(async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;
    ctx.reply(MESSAGES.start);

    await logMessage(LOGS_TYPES.successStart, `chatId: ${id};\nusername: ${username};`);
  } catch(e) {
    console.error(e);
    throw new Error(`${ERRORS.start}: ${e}`);
  }
});

bot.command('logs', async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;

    if (ADMIN_CHAT_ID && String(id) === ADMIN_CHAT_ID) {
      const logsDocument = fs.createReadStream(LOGS_PATH, 'utf8');
      await logMessage(LOGS_TYPES.logsDownload, `chatId: ${id};\nusername: ${username};`);

      ctx.replyWithDocument({
        source: logsDocument,
        filename: 'logs.txt',
      })
    }
  } catch(e) {
    console.error(e);
    throw new Error(`${ERRORS.logsSend}: ${e}`);
  }
})


bot.on('text', async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;
    const message = ctx?.message?.text?.replace('/', '');
    const imagePath = await requestImageFromGenerator(message);

    ctx.replyWithPhoto(imagePath);

    await logMessage(LOGS_TYPES.successRequestImage, `chatId: ${id};\nusername: ${username};\nmessage: ${message};\nimageGenerator: ${CURRENT_IMAGE_GENERATOR};\nimagePath: ${imagePath};`);
  } catch(e) {
    console.error(ERRORS.messageHandler);
    throw new Error(`${ERRORS.messageHandler}: ${e}`);
  }
});

bot.launch().then(() => {
  console.warn('BOT STARTED');
});

function requestImageFromGenerator(message = '') {
  return IMAGE_GENERATORS[CURRENT_IMAGE_GENERATOR].requestImage(message);
}

async function logMessage(type = '', message = '') {
  await fs.appendFile(LOGS_PATH, `=== ${type.toUpperCase()} ===\n=== ${new Date()} ===\n${message}\n\n`, (e) => console.error(e));
}
