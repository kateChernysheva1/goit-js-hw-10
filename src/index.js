import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import lodash from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const text = document.querySelector('.country-list');
const textdiv = document.querySelector('.country-info');

input.addEventListener('input', lodash(inputSearch, DEBOUNCE_DELAY));

function inputSearch(el) {
  const value = el.target.value.trim();
  textdiv.innerHTML = '';
  text.innerHTML = '';

  if (value) {
    fetchCountries(value)
      .then(data => {
        checkData(data);
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function checkData(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 1 && data.length <= 10) {
    text.innerHTML = liDraw(data);
  } else {
    textdiv.innerHTML = itemDraw(data);
  }
}

function liDraw(data) {
  return data
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li><img src="${svg}" alt="${official}"> ${official}</li>`;
    })
    .join('');
}

function itemDraw(data) {
  return data
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      }) => {
        return `<h3><img src="${svg}" alt="${official}"> ${official}</h3>
                <ul> <li><strong>Capital:</strong> ${capital}</li>
                <li><strong>Population:</strong> ${population}</li>
                <li><strong>Languages:</strong> ${Object.values(languages).join(
                  ', '
                )}</li></ul`;
      }
    )
    .join('');
}
