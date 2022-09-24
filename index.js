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
  API_ROUTE_LOGS,
  API_KEY
} from './src/constants.js';
import axios from 'axios';

const bot = new Telegraf(BOT_TOKEN);

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },
});

bot.start(async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;

    await ctx.reply(MESSAGES.start);
    await sendStartMessageToAdmin(ctx);
    await logMessage({
      type: LOGS_TYPES.successStart,
      chatId: id,
      userName: username,
    });
  } catch(e) {
    console.error(e);
    throw new Error(`${ERRORS.start}: ${e}`);
  }
});

bot.command('logs', async (ctx) => {
  try {
    const { id, username } = ctx?.message?.from;

    if (ADMIN_CHAT_ID && String(id) === ADMIN_CHAT_ID) {
      const logsDocument = await requestLogsAndGenerateFile();

      await ctx.replyWithDocument({
        source: logsDocument,
        filename: LOGS_PATH.split('/').pop(),
      })

      fs.access(LOGS_PATH, async (err) => {
        if (err) {
          console.error(err);
          return;
        }
        logsDocument.destroy();
        await fs.unlink(LOGS_PATH, (e) => console.error(e));
      });

      await logMessage({
        type: LOGS_TYPES.logsDownload,
        chatId: id,
        userName: username,
      });
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

    await ctx.replyWithPhoto(imagePath);

    await logMessage({
      type: LOGS_TYPES.successRequestImage,
      chatId: id,
      userName: username,
      message: message,
      imagePath: imagePath,
      imageGenerator: CURRENT_IMAGE_GENERATOR,
    });
  } catch(e) {
    throw new Error(`${ERRORS.messageHandler}: ${e}`);
  }
});

bot.catch(async (err, ctx) => {
  console.error(err);
});

bot.launch().then(() => {
  console.warn('BOT STARTED');
});

async function requestImageFromGenerator(message = '') {
  return await IMAGE_GENERATORS[CURRENT_IMAGE_GENERATOR].requestImage(message);
}

async function logMessage(data = {}) {
  await axiosInstance.post(API_ROUTE_LOGS, {
    data: {
      type: String(data.type || '-'),
      chatId: String(data.chatId || '-'),
      userName: String(data.userName || '-'),
      message: String(data.message || '-'),
      imagePath: String(data.imagePath || '-'),
      imageGenerator: String(data.imageGenerator || '-'),
    }
  })
}

async function requestLogsAndGenerateFile() {
  const res = (await axiosInstance.get(API_ROUTE_LOGS)).data
  
  await fs.writeFile(LOGS_PATH, JSON.stringify(res), 'utf8', (e) => console.error(e));
  
  return await fs.createReadStream(LOGS_PATH, 'utf8');
}

async function sendStartMessageToAdmin(ctx) {
  const { id, username } = ctx?.message?.from;

  await ctx.telegram.sendMessage(ADMIN_CHAT_ID, `🔥 New user! \n\nid: ${id} \nusername: ${username}`)
}