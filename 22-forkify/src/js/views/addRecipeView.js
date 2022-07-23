import View from './View'
import icons from 'url:../../img/icons.svg'; // PARCEL v2



class AddRecipeView extends View{
  _parentElement = document.querySelector('.upload')
  _message = 'Recipe was successfully uploaded!'
  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')
  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _btnClose = document.querySelector('.btn--close-modal')

  // once object created run _addHandlerShowWindow
  constructor(){
    super()
    this._addHandlerShowWindow()
    this._addHandlerHideWindow()
  }

  _toggleWindow(){
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }
  _addHandlerShowWindow(){
    this._btnOpen.addEventListener('click',this._toggleWindow.bind(this))
  }
  _addHandlerHideWindow(){
    this._btnClose.addEventListener('click',this._toggleWindow.bind(this))
    this._overlay.addEventListener('click',this._toggleWindow.bind(this))
  }

  addHandlerUpload(handler){
    this._parentElement.addEventListener('submit', function(e){
      e.preventDefault()
      // this points _parentElement which is form element
      const dataArr = [...new FormData(this)]
      /**
       * * Object.fromEntries(arr)
       * takes array of entries like => [['title key', 'Title value'],["sourceUrl", "TEST"],...]
       * and convert to objects like below
       {
         "title": "TEST",
         "sourceUrl": "TEST",
         ...
       }
      */
      const data = Object.fromEntries(dataArr)
      handler(data)
    })
  }

  _generateMarkup(){
    return `
      <div class="upload__column">
        <h3 class="upload__heading">Recipe data</h3>
        <label>Title</label>
        <input value="TEST123" required name="title" type="text" />
        <label>URL</label>
        <input value="TEST123" required name="sourceUrl" type="text" />
        <label>Image URL</label>
        <input value="TEST123" required name="image" type="text" />
        <label>Publisher</label>
        <input value="TEST123" required name="publisher" type="text" />
        <label>Prep time</label>
        <input value="23" required name="cookingTime" type="number" />
        <label>Servings</label>
        <input value="23" required name="servings" type="number" />
      </div>

    <div class="upload__column">
      <h3 class="upload__heading">Ingredients</h3>
      <label>Ingredient 1</label>
      <input
        value="0.5,kg,Rice"
        type="text"
        required
        name="ingredient-1"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 2</label>
      <input
        value="1,,Avocado"
        type="text"
        name="ingredient-2"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 3</label>
      <input
        value=",,salt"
        type="text"
        name="ingredient-3"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 4</label>
      <input
        type="text"
        name="ingredient-4"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 5</label>
      <input
        type="text"
        name="ingredient-5"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 6</label>
      <input
        type="text"
        name="ingredient-6"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
    </div>

    <button class="btn upload__btn">
      <svg>
        <use href="${icons}#icon-upload-cloud"></use>
      </svg>
      <span>Upload</span>
    </button>
    `
  }
}

export default new AddRecipeView()