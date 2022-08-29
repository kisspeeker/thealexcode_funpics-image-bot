import fetch from 'node-fetch';
import FormData from 'form-data';
import { MESSAGES, CURRENT_IMAGE_GENERATOR } from './constants.js';

export const IMAGE_GENERATORS = {
  funpics: {
    url: 'https://stardisk.xyz/projects/funpics/funpics.php',
    prefix: 'https://stardisk.xyz/projects/funpics',
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
