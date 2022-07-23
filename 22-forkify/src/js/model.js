import { API_KEY, API_URL, RES_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

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

const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

const createRecipeObject = function(data){
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title:recipe.title,
    publisher: recipe.publisher,
    sourceUrl : recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // handy tricks
  }
}

export const loadRecipe = async function(id){
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`)
    state.recipe = createRecipeObject(data)

    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true
    else state.recipe.bookmarked = false
  } catch (error) {
    // to reject promise and access this error object from controller
    throw error
  }
}

export const loadSearchResults = async function(query="pizza"){
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title:rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      }
    })
    // when user search new query then update pagination btn to reset 1
    state.search.page = 1;
  } catch (err) {
    throw err
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
  persistBookmarks()
}

export const deleteBookmark = function(id){
  const index = state.bookmarks.findIndex(el => el.id === id);
  // rm bookmarked recipe
  state.bookmarks.splice(index, 1)

    // mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks()
}

const init = function(){
  const storage = localStorage.getItem('bookmarks');
  if(storage) state.bookmarks = JSON.parse(storage)
}
init()

export const uploadRecipe = async function(newRecipe){
  try {
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim())
      if(ingArr.length !== 3) throw new Error('Wrong Format! Please use the correct format.')
      const [quantity, unit, description] = ingArr
      return { quantity: quantity ? +quantity : null, unit, description}
    })
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
  } catch (error) {
    throw error
  }
}