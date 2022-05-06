"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = this.#uniqueId();
  
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  #uniqueId(len=16){
    return Number.parseInt(Math.ceil(Math.random() * this.date.getTime()).toPrecision(len).toString().replace(".", ""))
  }
}

class Running extends Workout{
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace(){
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout{
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  
  calcSpeed(){
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}


// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;

  constructor() {
    this.#getPosition();
    form.addEventListener("submit", this.#newWorkout.bind(this));
    inputType.addEventListener("input", this.#toggleElevationField);
  }

  #getPosition() {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 3000, // Amount of time before the error callback is invoked
        maximumAge: 0, // Maximum cached position age in miliseconds
      };
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this), // fix undefined this
        function () {
          alert("Could not get your location");
        },
        options
      );
    }
  }

  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    // L.map('map') -> string "map" should point our html element with id="map"
    // map will be inserted into that element
    const coords = [latitude, longitude];
    //! this points undefined because in the #getPosition func,
    // #loadMap just regular func call so it points undefined
    // console.log(this); //! undefined
    // to solve this we need to manually bind this keyword look at 43th line.

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", 
      {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',})
      .addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this.#showForm.bind(this));
  }

  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  #toggleElevationField() {
    // select closest parent. closest method is like reverse querySelector
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  #newWorkout(e) {
    e.preventDefault();

    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";

    const {
      latlng: { lat, lng },
    } = this.#mapEvent;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();
