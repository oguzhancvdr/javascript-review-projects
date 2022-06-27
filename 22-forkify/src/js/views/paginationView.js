import View from './View'
import icons from 'url:../../img/icons.svg'; // PARCEL v2


class PaginationView extends View{
  _parentElement = document.querySelector('.pagination')

  
  addHandlerClick(handler){
    // event delegation to listen both function
    // add event listner to common parent element
    this._parentElement.addEventListener('click', function(e){
      const btn = e.target.closest('.btn--inline')
      if(!btn) return;

      // convert to number with '+'
      const goToPage = +btn.dataset.goto;

      handler(goToPage)
    })
  }
  
  _generateMarkup(){
    const currPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
    // Page1, and there are other pages
    if(currPage === 1 && numPages > 1){
      return `
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // Last page
    if(currPage === numPages && numPages > 1){
      return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>
      `;
    }
    // Other 
    if(currPage < numPages){
      return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }
    // Page1, and there are no other pages
    return ''
  }
}

export default new PaginationView()