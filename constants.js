import dotenv from 'dotenv-flow';
import { resolve } from 'path';
dotenv.config();

export const BOT_TOKEN = process.env.TG_BOT_TOKEN;

export const IMAGE_GENERATOR_URL_PREFIX = 'https://stardisk.xyz/projects/funpics';
export const IMAGE_GENERATOR_URL = `${IMAGE_GENERATOR_URL_PREFIX}/funpics.php`;

export const LOGS_PATH = resolve('./data/logs.txt');

export const MESSAGES = {
  start: 'Privet! Text me something to see a picture with your message',
  errorMessageHandler: 'Error message handler',
  errorStart: 'Error start',
  errorPostData: 'Error post data',
}
