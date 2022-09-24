import { resolve } from 'path';
import dotenv from 'dotenv-flow';
dotenv.config();

export const BOT_TOKEN = process.env.TG_BOT_TOKEN;
export const ADMIN_CHAT_ID = process.env.TG_ADMIN_CHAT_ID;
export const LOGS_PATH = resolve('./data/logs.json');
export const CURRENT_IMAGE_GENERATOR = 'funpics';

export const API_KEY = process.env.API_KEY
export const API_ROUTE_LOGS = process.env.API_ROOT + '/api/funpics-bot-logs?sort[0]=id:DESC'

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
  error: 'error',
  logsDownload: 'logsDownload',
  successStart: 'startBot',
  successRequestImage: 'imagePath',
}
