import View from './View'


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

  _generateMarkup(){}
}

export default new AddRecipeView()