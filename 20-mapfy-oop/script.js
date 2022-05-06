"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = this.#uniqueId() + "";
  // clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
  // in a real world application, give this responsibility to 3rd party libraries like uuid.
  #uniqueId(len = 16) {
    return Number.parseInt(
      Math.ceil(Math.random() * this.date.getTime())
        .toPrecision(len)
        .toString()
        .replace(".", "")
    );
  }

  // not private but protected
  _setDescription() {
    // prettier-ignore
    const months = ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December",];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  // click(){
  //   this.clicks++;
  //   console.log(this.clicks);
  // }
}

class Running extends Workout {
  type = "running"; // same like inside constructor

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling"; // same like inside constructor

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.cycling = 'cycling'
    this.calcSpeed();
    this._setDescription(); // we didn't call this method on Workout Class because there is not type variable
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #zoomLvl = 13

  constructor() {
    // get user's position
    this.#getPosition();
    // Attach event handlers
    form.addEventListener("submit", this.#newWorkout.bind(this));
    inputType.addEventListener("input", this.#toggleElevationField);
    containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
    // get data from localstorage
    this.#getLocalstorage();
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

    this.#map = L.map("map").setView(coords, this.#zoomLvl);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this.#showForm.bind(this));

    // rendering markers in first load
    this.#workouts.forEach(workout => {
      this.#renderWorkoutMarker(workout);
    })
  }

  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  #hideForm(){
    // prettier-ignore    
    inputDistance.value = inputDuration.value =  inputCadence.value = inputElevation.value = "";
    form.style.display = 'none'
    form.classList.add("hidden");
    setTimeout(() => form.style.display = 'grid', 1000);
  }

  #toggleElevationField() {
    // select closest parent. closest method is like reverse querySelector
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  #newWorkout(e) {
    const validInputs = (...inputs) => inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);
    e.preventDefault();

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const {
      latlng: { lat, lng },
    } = this.#mapEvent;
    let workout;

    // if workout runing, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive number.");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive number.");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // render workout on map as marker
    this.#renderWorkoutMarker(workout);

    // Render workout on list
    this.#renderWorkout(workout);

    // hide form + Clear input fields
    this.#hideForm();

    // Set localstorage to all workouts
    this.#setLocalstorage();

  }

  #renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description }`)
      .openPopup();
  }

  #renderWorkout(workout) {
    // common part for both running and cycling
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        `;
    if (workout.type === "running")
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    
    if (workout.type === "cycling")
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    form.insertAdjacentHTML("afterend", html);
  }

  #moveToPopup(e){
    const workoutEl = e.target.closest('.workout');

    if(!workoutEl) return;

    const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
    this.#map.setView(workout.coords, this.#zoomLvl, {
      animate: true,
      pan: {
        duration:1,
      }
    })

    // using the publick interface
    // workout.click(); // ! its point was that localstorage object is not inherited parent class
  }

  #setLocalstorage(){
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  #getLocalstorage(){
    const data = localStorage.getItem('workouts');
    if(!data) return;
    this.#workouts = JSON.parse(data);

    this.#workouts.forEach(workout => {
      this.#renderWorkout(workout)
      //! TypeError: Cannot read properties of undefined (reading 'addLayer')
      // because we are trying to add markers on the map which is yet fully loaded
      // so we need to wait map is fully loaded and then we can add markers.
      // this.#renderWorkoutMarker(workout); // ? lets move this code to #loadMap() func.
    })
  }
  
  //! just for reset localstorage data in the console
  reset(){
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
