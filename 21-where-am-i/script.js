"use strict";

// Promisifiying GeoLocation API
const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".btn-country");

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   pos => resolve(pos),
    //   err => reject(err)
    // )
    // same above in a best way!
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition().then(pos => console.log(pos))

const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.subregion}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🌍</span>${data.continents[0]}</p>
        <p class="country__row"><span>🏰</span>${data.capital[0]}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (msg) {
  if (countriesContainer.textContent.length > 0) countriesContainer.textContent = "";
  countriesContainer.insertAdjacentText("beforeend", msg);
};

const getCountryDataDRY = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error("Country not found.");
    const data = await res.json();
    renderCountry(data?.[0]);
    const neighbour = data?.[0]?.borders;
    if (!neighbour) throw new Error("No Neighbour found ☠️ 🔴");
    if (!(typeof neighbour === "object")) throw new Error("🔴 Invalid data type 🔴");
    const neighbours = await fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour?.map(item => item)}`);
    if (!neighbours.ok) throw new Error("Neighbour not found.");
    const neighbourData = await neighbours.json();
    neighbourData?.forEach(country => renderCountry(country, "neighbour"));
  } catch (error) {
    renderError(`Something went wrong ☠️⚡${error.message}.`);
  }
};

const whereAmI = async function () {
  try {
    const pos = await getPosition()
    const { latitude: lat, longitude: lng } = pos.coords;
    const url = `https://geocode.xyz/${lat},${lng}?geoit=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`You exceed the request limit! (${res.status})`);
    const data = await res.json()
    console.log(`You are in ${data?.city}, ${data?.country}`);
    getCountryDataDRY(data?.country);
    if (countriesContainer.textContent.length > 0) countriesContainer.textContent = "";
  } catch (error) {
    renderError(`Something went wrong. Details: ${error.message}`)
  }
  countriesContainer.style.opacity = 1
};

btn.addEventListener("click", whereAmI);
