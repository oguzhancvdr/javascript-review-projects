// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false
let editID = ''

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)

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
    // after our element created we can access edit and delete btns
    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    // now we can add event listeners
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
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
    editElement.innerHTML = value
    displayAlert('Your item has been updated', 'success')
    // edit localStorage
    // editLocalStorage(editID,value)
    setBackToDefault()

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
// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item')
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('empty list', 'success')
  setBackToDefault()
  // localStorage.removeItem('list')
}
// delete func
function deleteItem(e) {
  // if we used e.target then we could access icons.
  // So to reach parent of parentElement cant be possible
  // we used currentTarget beacuse path that we reach is specific
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  const elemName = element.children
  list.removeChild(element)
  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }
  for (let item of elemName) {
    if (item.classList.contains('title')) {
      displayAlert(`the ${item.innerHTML} was deleted.`, 'success')
      break
    }
  }
  setBackToDefault()
  // remove from local storage
  // removeFromLocalStorage(id)
}
// edit func
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling
  // set form value
  grocery.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.id
  submitBtn.textContent = 'edit'

}
// set back to default (clear value of input after submitting)
function setBackToDefault() {
  grocery.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'submit'
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {}
function removeFromLocalStorage(id) {}
function editLocalStorage(id, value){}

// ****** SETUP ITEMS **********
