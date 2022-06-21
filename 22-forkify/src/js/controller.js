'use strict'

import * as model from './model'
import recipeView from './views/recipeView';
import 'core-js/stable'; // it is pollifilling everything else
import 'regenerator-runtime/runtime';  // it is pollifilling async-await


const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2


const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1)

    if(!id) return;
    recipeView.renderSpinner()

    // loading recipe
    await model.loadRecipe(id)
    // render recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    console.error(error)
  }
}
const events = ['hashchange', 'load']
events.forEach(ev => window.addEventListener(ev, controlRecipes))
