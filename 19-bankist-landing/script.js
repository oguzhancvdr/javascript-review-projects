"use strict";

///////////////////////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const nav = document.querySelector(".nav");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navLink = document.querySelectorAll(".nav__link");
const navLinks = document.querySelector(".nav__links");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Node list has foreach method
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// button scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log("Curr scroll (X/Y): ", window.scrollX, window.scrollY);
  console.log(
    "Curr portion of page (X/Y): ",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // smooth Scrolling old scholl way
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth'
  // });

  // modern way
  section1.scrollIntoView({ behavior: "smooth" });
});

// page navigation
// * it is not efficent for performance
// * think about you have 1000 element and
// * we attach this function for each
// * so we can put this function into common parent element
// * then we can benefit from event delegation !
// navLinks.forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'})
//   })
// })

// event delegation
/**
 * TODO:
 * 1. add event listner to common parent element
 * 2. Determine what element originated the event
 */

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed components
// bad practice what if it is 100 tab ? bad performance
// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')))
// good practice to add event listener common parent
tabsContainer.addEventListener("click", function (e) {
  // matching strategy what button is clicked ?
  // find closest parent with specified className(operations__tab)
  const clicked = e.target.closest(".operations__tab");

  // Guard close
  if (!clicked) return;

  // clear active classes both
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
// it is impossible send another argument on event handler func
// any handler function can have one real argument like event object
// but if we want to send additional argument to event handler function
// then we need to use this keyword like below handler function

const handleHOver = function (e) {
  console.log(this);
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// we again use event bubling(delegation)
// ! because of this, we cannot use mouseenter event which is not bubling
// ? instead, we can use mouseover event
// nav.addEventListener('mouseover', function(e){
//   handleHOver(e, 0.5)
// })

// nav.addEventListener('mouseout', function(e){
//   handleHOver(e, 1)
// })

// best practice passing arguments to event handlers
// bind method passing 'argument' into handler function
nav.addEventListener("mouseover", handleHOver.bind(0.5));
nav.addEventListener("mouseout", handleHOver.bind(1));

// Sticky navigation
// scroll event is not efficent. Just for exploring purpose
// because every scrolling fires all the time
// it leads bad performence esspecially in mobile
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener("scroll", function () {
//   console.log(window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// * let's implement sticky navigation with more performant
// Intersection Observer API

// once header section was dissapeard on viewport we want to navbar is sticky
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // 0 means when header viewport is 0 (disappered) then fire stickyNav callback
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  // unobserve for unneccseary observing and firing event
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

// lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data.src
  entry.target.src = entry.target.dataset.src;
  // bad practice because it doesn't wait to load img and persist blury until new images are loaded
  // entry.target.classList.remove('lazy-img')
  // best practice

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px", // download img before scroll arrive thresold
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const sliderFunc = function () {
  const slider = document.querySelector(".slider");
  const slides = slider.querySelectorAll(".slide");
  const btnLeft = slider.querySelector(".slider__btn--left");
  const btnRight = slider.querySelector(".slider__btn--right");
  const dotContainer = slider.querySelector(".dots");

  let currSlide = 0;
  let maxSlide = slides.length;

  //*functions
  // create dots with length of slides
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"> </button>`
      );
    });
  };

  const activeDot = function (slide) {
    // first rm all active class
    dotContainer
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    dotContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // first slide 0%, and then 100%, 200%, 300% so on..
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const init = function () {
    createDots();
    activeDot(0);
    goToSlide(0);
  };

  init();

  //* Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // we want firstOne -100%,0%, 100%, 200%
  // currSlide = 1: 251.line 100 * (0 - 1) -> -100%
  // currSlide = 1: 251.line 100 * (1 - 1) -> 0%
  // currSlide = 1: 251.line 100 * (2 - 1) -> 100%
  // currSlide = 1: 251.line 100 * (3 - 1) -> 200%
  // ...

  // slide by  left and right arrow on keyboard
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

sliderFunc();

// DOM lifecycle
// this event will wait for just HTML and Javascript files are loaded.(not images or external sources)
//* if you have script tag on your html no need to use DOmContentLoaded
document.addEventListener('DOMContentLoaded', function(e){
  console.log('Html parsed and Dom tree built!', e);
})


window.addEventListener('load', function(e){
  console.log('Page fully loaded', e);
})

// when leaving site, confirm pop-up appears
// but dont use this too much, just use for when user left filling the form on the middle
// or when users write a blog post and before completed it we can use this event
// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ';'
// })
