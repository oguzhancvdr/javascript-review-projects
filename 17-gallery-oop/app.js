function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

function Gallery(element) {
  this.container = element;
  // take all imgs
  // this will procude NodeList
  // with spread operator we can convert to array
  this.list = [...element.querySelectorAll(".img")];
  // target
  this.modal = getElement(".modal");
  this.modalImg = getElement(".main-img");
  this.imageName = getElement(".image-name");
  this.modalImages = getElement(".modal-images");
  this.closeBtn = getElement(".close-btn");
  this.nextBtn = getElement(".next-btn");
  this.prevBtn = getElement(".prev-btn");
  // this points now Gallery, self ref
  // const self = this;
  this.closeModal = this.closeModal.bind(this);
  this.nextImage = this.nextImage.bind(this);
  this.prevImage = this.prevImage.bind(this);
  // container event
  // this.openModal points leftOfthe dot, that is container
  // but we want to access Gallery so by binding we can handle with this stiuation
  this.container.addEventListener(
    "click",
    function (e) {
      // use withoyt binding
      // self.openModal()
      if (e.target.classList.contains("img")) {
        this.openModal(e.target, this.list);
      }
      // if we remove bind(this), then this point container again not Gallery
    }.bind(this)
  );
}

// create click event function on prototype
Gallery.prototype.openModal = function (selectedImage, list) {
  this.setMainImage(selectedImage);
  this.modalImages.innerHTML = list
    .map(function (image) {
      return `
        <img 
            src="${image.src}" 
            title="${image.title}" 
            data-id="${image.dataset.id}" 
            class="${
              selectedImage.dataset.id === image.dataset.id
                ? "modal-img selected"
                : "modal-img"
            }"
        >
      `;
    })
    .join("");
  this.modal.classList.add("open");
  this.closeBtn.addEventListener("click", this.closeModal);
  this.nextBtn.addEventListener("click", this.nextImage);
  this.prevBtn.addEventListener("click", this.prevImage);
};

Gallery.prototype.setMainImage = function (selectedImage) {
  this.modalImg.src = selectedImage.src;
  this.imageName.textContent = selectedImage.title;
};

Gallery.prototype.closeModal = function () {
  this.modal.classList.remove("open");
  this.closeBtn.removeEventListener("click", this.closeModal);
  this.nextBtn.removeEventListener("click", this.nextImage);
  this.prevBtn.removeEventListener("click", this.prevImage);
};

Gallery.prototype.nextImage = function () {
  const selected = this.modalImages.querySelector(".selected");
  const next = selected.nextElementSibling || this.modalImages.firstElementChild;
  selected.classList.remove("selected");
  next.classList.add("selected");
  this.setMainImage(next);
};

Gallery.prototype.prevImage = function () {
  const selected = this.modalImages.querySelector(".selected");
  const prev = selected.previousElementSibling || this.modalImages.lastElementChild;
  selected.classList.remove("selected");
  prev.classList.add("selected");
  this.setMainImage(prev);
};

const nature = new Gallery(getElement(".nature"));
const city = new Gallery(getElement(".city"));
