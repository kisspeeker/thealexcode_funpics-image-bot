import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import { Telegraf } from 'telegraf';

import {
  BOT_TOKEN,
  IMAGE_GENERATOR_URL,
  IMAGE_GENERATOR_URL_PREFIX,
  MESSAGES,
  LOGS_PATH,
  ADMIN_CHAT_ID,
} from './constants.js';

const bot = new Telegraf(BOT_TOKEN);

bot.catch(async (err, ctx) => {
  try {
    console.error(`${ctx.updateType}`, err);
    await pushLogMessage(`ERROR: ${ctx.updateType}. ${err}`)
  } catch(e) {
    console.error(e);
  }
});

bot.start(async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;
    ctx.reply(MESSAGES.start);

    await pushLogMessage(`=== START ===\nchatId: ${id};\nusername: ${username};`);
  } catch(e) {
    console.error(e);
    throw new Error(`${MESSAGES.errorStart}: ${e}`);
  }
});

bot.command('logs', (ctx) => {
  try {
    const { id } = ctx?.message?.from;
    const logsDocument = fs.createReadStream(LOGS_PATH, 'utf8');

    if (ADMIN_CHAT_ID && String(id) === ADMIN_CHAT_ID) {
      ctx.replyWithDocument({
        source: logsDocument,
        filename: 'logs.txt',
      })
    }
  } catch(e) {
    console.error(e);
    throw new Error(`${MESSAGES.errorLogsSend}: ${e}`);
  }
})


bot.on('text', async (ctx) => {
  try {
    const message = ctx?.message?.text?.replace('/', '');
    const { id, username } = ctx?.message?.from;
    // const imagePath = await requestImage(message).then(path => `${IMAGE_GENERATOR_URL_PREFIX}/${path}`) || 'undefined image';
    const imagePath = await requestImage(message).then((res) => res?.output_url || 'undefined image');

    ctx.replyWithPhoto(imagePath);

    await pushLogMessage(`chatId: ${id};\nusername: ${username};\nmessage: ${message};\nimagePath: ${imagePath};`);
  } catch(e) {
    console.error(MESSAGES.errorMessageHandler);
    throw new Error(`${MESSAGES.errorMessageHandler}: ${e}`);
  }
});

bot.launch().then(() => {
  console.warn('BOT STARTED');
});

async function pushLogMessage(message = '') {
  await fs.appendFile(LOGS_PATH, `=== ${new Date()} ===\n${message}\n\n`, (e) => console.error(e));
}

async function requestImage(text) {
  try {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(IMAGE_GENERATOR_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
      }
    });
    return await response.json();
  } catch(e) {
    console.error(e);
    return Promise.reject(`${MESSAGES.errorRequestImage}: ${e}`)
  }
};
