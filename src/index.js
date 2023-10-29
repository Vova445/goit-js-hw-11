import Notiflix from 'notiflix';
import { fetchData } from './api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.classList.add('is-hidden');

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreResults);

let currentPage = 1;
let searchQuery = '';

async function clearGallery() {
  refs.galleryContainer.innerHTML = '';
}

async function fetchAndDisplayData(query, page) {
  try {
    const data = await fetchData(query, page);

    if (!data.hits.length) {
      showErrorMessage();
      return;
    }

    showImages(data.hits);
    updateLoadMoreButton(data.hits, data.totalHits);
    showTotalHitsMessage(data.total);
  } catch (error) {
    console.error('Error while fetching data:', error);
  }
}

function showErrorMessage() {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your search query. Please try again.`
  );
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

async function showImages(cards) {
  const markup = createMarkup(cards);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function updateLoadMoreButton(cards, totalHits) {
  if (cards.length < totalHits) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

async function scrollToNextPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function onSubmit(evt) {
  evt.preventDefault();
  clearGallery();
  searchQuery = evt.target.elements.searchQuery.value;
  currentPage = 1;
  await fetchAndDisplayData(searchQuery, currentPage);
}

async function loadMoreResults() {
  currentPage++;
  await fetchAndDisplayData(searchQuery, currentPage);
}

function createMarkup(cards) {
  return cards
    .map((card) => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = card;

      return `
      <div class="photo-card">
        <a class="photo__link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">likes: <b>${likes}</b></p>
          <p class="info-item">views: <b>${views}</b></p>
          <p class="info-item">comments: <b>${comments}</b></p>
          <p class="info-item">downloads: <b>${downloads}</b></p>
        </div>
      </div>
    `;
    })
    .join('');
}

function showTotalHitsMessage(total) {
  Notiflix.Notify.success(`Hooray! We found ${total} images.`);
}

const lightbox = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});
