'use strict'

import * as model from './model'
import recipeView from './views/recipeView';
import 'core-js/stable'; // it is pollifilling everything else
import 'regenerator-runtime/runtime';  // it is pollifilling async-await


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

const init = function(){
  // subscribe event with handler in the controller
  recipeView.addHandlerRender(controlRecipes)
}

init()
