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

bot.on('text', async (ctx) => {
  try {
    const message = ctx?.message?.text?.replace('/', '');
    const { id, username } = ctx?.message?.from;
    const imagePath = await postData(message).then(path => `${IMAGE_GENERATOR_URL_PREFIX}/${path}`) || 'undefined image';

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
  await fs.appendFile(LOGS_PATH, `=== ${new Date()} ===\n${message}\n\r`, (e) => console.error(e));
}

async function postData(text) {
  try {
    const formData = new FormData();
    formData.append('word', text);

    const response = await fetch(IMAGE_GENERATOR_URL, {
      method: 'POST',
      body: formData,
    });
    return await response.text();
  } catch(e) {
    console.error(e);
    return Promise.reject(`${MESSAGES.errorPostData}: ${e}`)
  }
};
