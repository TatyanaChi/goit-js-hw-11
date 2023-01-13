import axios from 'axios';

const API_KEY = '32700360-715d6045c0392da5b083a02ff';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PicturesAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchAPI() {
    const options = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });
    const { data } = await axios(`?${options}`);
    this.page += 1;
    return data;
  }
  // incrementPages() {
  //   this.page += 1;
  //   console.log(this);
  // }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
