import axios from 'axios';
import CustomFormData from 'form-data'

export const IMAGE_GENERATORS = {
  funpics: {
    url: 'https://stardisk.xyz/projects/funpics/funpics.php',
    prefix: 'https://stardisk.xyz/projects/funpics',
    async requestImage(message) {
      const formData = new CustomFormData();
      formData.append('word', message);

      const response = (await axios.post(this.url, formData, {
        headers: formData.getHeaders()
      }))?.data || '';

      return `${this.prefix}/${response}`;
    }
  },
}
