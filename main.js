import debounce from 'lodash.debounce';
import { alert, notice, info, success, error } from '@pnotify/core';

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', debounce(handleInput, 500));

async function handleInput() {
  const query = searchInput.value.trim();

  if (!query) {
    clearResults();
    return;
  }

  try {
    const countries = await fetchCountries(query);
    renderCountries(countries);
  } catch (error) {
    showError(error.message);
  }
}

function clearResults() {
  searchResults.innerHTML = '';
}

function renderCountries(countries) {
  if (countries.length === 0) {
    clearResults();
    alert('No countries found');
    return;
  }

  if (countries.length > 10) {
    clearResults();
    notice('Too many matches found. Please specify your query');
    return;
  }

  clearResults();

  const countriesList = document.createElement('ul');
  countriesList.classList.add('countries-list');

  countries.forEach(country => {
    const countryItem = document.createElement('li');
    countryItem.textContent = country.name;
    countryItem.addEventListener('click', () => renderCountryInfo(country));
    countriesList.appendChild(countryItem);
  });

  searchResults.appendChild(countriesList);
}

async function renderCountryInfo(country) {
  try {
    const countryData = await fetchCountryInfo(country.alpha3Code);
    const countryInfo = `
      <h2>${countryData.name}</h2>
      <p><strong>Capital:</strong> ${countryData.capital}</p>
      <p><strong>Population:</strong> ${countryData.population}</p>
      <p><strong>Languages:</strong> ${countryData.languages.map(lang => lang.name).join(', ')}</p>
      <img src="${countryData.flag}" alt="Flag of ${countryData.name}" width="100">
    `;
    clearResults();
    searchResults.innerHTML = countryInfo;
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  error(message);
}
