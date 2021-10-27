
// set initial count
let count = 0

// select value and buttons
const val = document.querySelector('#value')
const buttons = document.querySelectorAll('.btn')

console.log('buttons :>> ', buttons);

// forEach method we can use on Nodeist like above buttons but not all array methods
buttons.forEach(function(btn){
  btn.addEventListener('click', function(e){
    const styles = e.currentTarget.classList
    if(styles.contains('decrease')){
      count--
    }else if(styles.contains('increase')){
      count++
    }else{
      count=0
    }
    if(count > 0){
      value.style.color = 'green'
    }
    if(count < 0){
      value.style.color = 'red'
    }
    if(count === 0){
      value.style.color = '#222'
    }
    val.textContent = count
  })
})
