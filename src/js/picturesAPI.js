import axios from 'axios';

const API_KEY = '32700360-715d6045c0392da5b083a02ff';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PicturesAPI {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async fetchAPI() {
    const options = new URLSearchParams({
      key: API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });
    const { data } = await axios(`?${options}`);
    // this.page += 1;
    return data;
  }
  incrementPages() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  get getCurrentQuery() {
    return this.query;
  }

  set setNewQuery(newQuery) {
    this.query = newQuery;
  }
}
