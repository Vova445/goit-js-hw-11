import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40357504-569de062b9af68d468be4e854';

export async function fetchData(searchQuery, page) {
  return axios
    .get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      Notiflix.Notify.failure('Something went wrong in "fetchData"');
      throw error; 
    });
}
