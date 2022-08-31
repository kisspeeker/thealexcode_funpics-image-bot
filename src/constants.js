import { resolve } from 'path';
import dotenv from 'dotenv-flow';
dotenv.config();

export const BOT_TOKEN = process.env.TG_BOT_TOKEN;
export const ADMIN_CHAT_ID = process.env.TG_ADMIN_CHAT_ID;
export const LOGS_PATH = resolve('./data/logs.txt');
export const CURRENT_IMAGE_GENERATOR = 'funpics';

export const MESSAGES = {
  start: 'Privet! Text me something to see a picture with your message',
}

export const ERRORS = {
  messageHandler: 'Error message handler',
  start: 'Error start',
  requestImage: 'Error request image',
  logsSend: 'Error logs send',
}

export const LOGS_TYPES = {
  error: 'Error',
  logsDownload: 'Logs download',
  successStart: 'Success start',
  successRequestImage: 'Success request image',
}
