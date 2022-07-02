import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
  search:{
    query: '',
    results: [],
    page:1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
}

export const loadRecipe = async function(id){
  try {
    const data = await getJSON(`${API_URL}/${id}`)
    
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title:recipe.title,
      publisher: recipe.publisher,
      sourceUrl : recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    }
    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true
    else state.recipe.bookmarked = false
    console.log(state.recipe);
  } catch (error) {
    // to reject promise and access this error object from controller
    throw error
  }
}

export const loadSearchResults = async function(query="pizza"){
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title:rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      }
    })
    // when user search new query then update pagination btn to reset 1
    state.search.page = 1;
  } catch (err) {
    throw error
  }
}

export const getSearchResultsPage = function(page = state.search.page){
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0-10-20
  const end = page * state.search.resultsPerPage; // 9-19-29
  return state.search.results.slice(start, end)
}

export const updateServings = function(newServings){
  state.recipe.ingredients.forEach(ing => {
    // newQty = oldQty * newServings / oldServings => 2 * 8 / 4 = 4
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  })

  state.recipe.servings = newServings;
}

export const addBookmark = function(recipe){
  // Add bookmark
  state.bookmarks.push(recipe)

  // mark current recipe as bookmark
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

export const deleteBookmark = function(id){
  const index = state.bookmarks.findIndex(el => el.id === id);
  // rm bookmarked recipe
  state.bookmarks.splice(index, 1)

    // mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
}
