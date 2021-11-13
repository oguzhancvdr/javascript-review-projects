// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBttn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false
let editID = ''

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem)

// ****** FUNCTIONS **********
// generate unique id
function uid() {
  const head = Date.now().toString(36)
  const tail = Math.random().toString(36).substr(2)
  return head + tail
}
// add item
function addItem(e) {
  e.preventDefault()
  const value = grocery.value
  const id = uid()
  if (value && !editFlag) {
    const element = document.createElement('article')
    // add class
    element.classList.add('grocery-item')
    // add id
    const attr = document.createAttribute('date-id')
    attr.value = id
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn">
        <i class="fas fa-edit"></i>      
      </button>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`
    // append child
    list.appendChild(element)
    // display alert
    displayAlert('item added to the list', 'success')
    // show container
    container.classList.add('show-container')
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefault()
  } else if (value && editFlag) {
    console.log('editing')
  } else {
    displayAlert('please enter value', 'danger')
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(function () {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1500)
}

// set back to default
function setBackToDefault(){
  console.log('set back to default');
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
  console.log('added local storage');
}

// ****** SETUP ITEMS **********
