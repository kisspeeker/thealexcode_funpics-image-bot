import dotenv from 'dotenv-flow';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { resolve } from 'path';
dotenv.config();

export const BOT_TOKEN = process.env.TG_BOT_TOKEN;
export const ADMIN_CHAT_ID = process.env.TG_ADMIN_CHAT_ID;

export const CURRENT_IMAGE_GENERATOR = 'funpics';

export const IMAGE_GENERATOR_URL_PREFIX = 'https://stardisk.xyz/projects/funpics';
// export const IMAGE_GENERATOR_URL = `${IMAGE_GENERATOR_URL_PREFIX}/funpics.php`;
export const IMAGE_GENERATOR_URL = 'https://api.deepai.org/api/text2img';

export const LOGS_PATH = resolve('./data/logs.txt');

export const IMAGE_GENERATORS = {
  funpics: {
    url: 'https://stardisk.xyz/projects/funpics/funpics.php',
    prefix: 'https://stardisk.xyz/projects/funpics',
    headers: {},
    async requestImage(message) {
      try {
        const formData = new FormData();
        formData.append('word', message);

        const response = await fetch(this.url, {
          method: 'POST',
          body: formData
        });
        return await response.text().then(path => `${this.prefix}/${path}`) || 'undefined image';
      } catch(e) {
        console.error(e);
        return Promise.reject(`${MESSAGES.errorRequestImage}. IMAGE_GENERATOR = ${CURRENT_IMAGE_GENERATOR}: ${e}`)
      }
    }
  },
  deepai: {
    url: 'https://api.deepai.org/api/text2img',
    prefix: '',
    async requestImage(message) {
      try {
        const formData = new FormData();
        formData.append('text', message);

        const response = await fetch(this.url, {
          method: 'POST',
          body: formData,
          headers: {
            'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
          },
        });
        return await response.json().then((res) => res?.output_url || 'undefined image');
      } catch(e) {
        console.error(e);
        return Promise.reject(`${MESSAGES.errorRequestImage}. IMAGE_GENERATOR = ${CURRENT_IMAGE_GENERATOR}: ${e}`)
      }
    }
  },
}

export const MESSAGES = {
  start: 'Privet! Text me something to see a picture with your message',
  errorMessageHandler: 'Error message handler',
  errorStart: 'Error start',
  errorRequestImage: 'Error request image',
  errorLogsSend: 'Error logs send',
}
