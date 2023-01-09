import './css/styles.css';
import { Notify } from 'notiflix';
import PicturesAPI from './js/picturesAPI';
import LoadMoreBtn from './js/loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '32700360-715d6045c0392da5b083a02ff';
const picturesAPI = new PicturesAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.search-button'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  photoEl: document.querySelector('a'),
};
refs.formEl.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  picturesAPI.query = e.currentTarget.elements.searchQuery.value.trim();

  if (picturesAPI.query === '') {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  picturesAPI.resetPage();

  try {
    const { hits, totalHits } = await picturesAPI.fetchAPI();

    if (totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.galleryContainer.innerHTML = '';
      loadMoreBtn.hide();
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    onMarkupPhotos(hits);
    simpleLightBox.refresh();
    loadMoreBtn.show();
  } catch (error) {
    Notify.failure('Something is wrong');
  }

  function onMarkupPhotos(hits) {
    const markupPhotos = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
        <a href ="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${downloads}
      </p>
    </div>
  </div>`;
        }
      )
      .join('');

    refs.galleryContainer.insertAdjacentHTML('beforeend', markupPhotos);
  }
}

async function onLoadMoreBtn() {
  picturesAPI.incrementPages();
  loadMoreBtn.loading();

  try {
    const { hits } = await picturesAPI.fetchAPI();

    onMarkupPhotos(hits);
    simpleLightBox.refresh();
    loadMoreBtn.endLoading();

    if (hits.length < 40) {
      loadMoreBtn.hide();
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    Notify.failure('Something is wrong');
  }
}
