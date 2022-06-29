import View from './View'
import icons from 'url:../../img/icons.svg'; // PARCEL v2


class ResultView extends View{
  _parentElement = document.querySelector('.results')
  _errorMessage = "No recipes found for your query! Please try again.";
  _message = ''

  _generateMarkup(){
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join('')
  }

  _generateMarkupPreview(result){
    const id = window.location.hash.slice(1)
    return `
      <li class="preview">
        <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" crossorigin="anonymous"/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}>
          </div>
        </a>
      </li>
    `;

  }

  
}

export default new ResultView()