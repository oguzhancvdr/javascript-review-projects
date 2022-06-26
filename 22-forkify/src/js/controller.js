import * as model from './model'
import recipeView from './views/recipeView';
import searchView from './views/searchView';

import 'core-js/stable'; // it is pollifilling everything else
import 'regenerator-runtime/runtime';  // it is pollifilling async-await
import resultsView from './views/resultsView';

if(module.hot){
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2


const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1)

    if(!id) return;
    recipeView.renderSpinner()

    // loading recipe
    await model.loadRecipe(id)

    // rendering recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner()
    // 1) get search query
    const query = searchView.getQuery()
    if(!query) return;
    // it doesn't return anything
    // it is just manipulating state
    // thus we don't assign this data in any variable

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3) render results
    resultsView.render(model.state.search.results)
  } catch (error) {
    console.error('error :>> ', error);
  }
}

const init = function(){
  // subscribe event with handler in the controller
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}

init()
