import * as model from './model'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
import bookmarksView from './views/bookmarksView'
import addRecipeView from './views/addRecipeView'

import 'core-js/stable' // it is pollifilling everything else
import 'regenerator-runtime/runtime'  // it is pollifilling async-await
import { MODAL_CLOSE_SEC } from './config'

// if(module.hot){
//   module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2
// API_KEY = 2014899b-55ca-4b4b-ad17-2d36202647d5



const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1)

    if(!id) return
    recipeView.renderSpinner()

    // Update result view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks)
    
    // loading recipe
    await model.loadRecipe(id)
    
    // rendering recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    recipeView.renderError()
    console.error(error)
  }
}

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner()
    // 1) get search query
    const query = searchView.getQuery()
    if(!query) return
    // it doesn't return anything
    // it is just manipulating state
    // thus we don't assign this data in any variable

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3) render results
    // resultsView.render(model.state.search.results) // all results
    resultsView.render(model.getSearchResultsPage()) // first ten result

    //4) render inital pagination buttons
    paginationView.render(model.state.search)
  } catch (error) {
    console.error('error :>> ', error)
  }
}

const controlPagination = function(goToPage){
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))
  // render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  // update the recipe servings (in state)
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe) // it will render all view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function(){
  // 1-) Add/Remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  // 2-) Update recipe view
  recipeView.update(model.state.recipe)

  // 3-) Render bookmarks
  bookmarksView.render(model.state.bookmarks) 
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try {
    // render spinner
    addRecipeView.renderSpinner()
    // Upload recipe
    await model.uploadRecipe(newRecipe)
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderSuccessMsg()
    // Close form window
    setTimeout(function(){
      addRecipeView._toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    console.error(error , "🔥");
    addRecipeView.renderError(error.message)
  }

}

const init = function(){
  // subscribe event with handler in the controller
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)  
}
// for development purpose uncomment 11st line and clear local storage
const clearBookmarks = function(){
  localStorage.clear('bookmarks')
}
// clearBookmarks()
init()
