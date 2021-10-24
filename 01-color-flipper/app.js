const colors = ['green', 'red', 'rgba(133,122,200)', '#f15025']

const btn = document.getElementById('btn')
const color = document.querySelector('.color')
const simpleLink = document.querySelector('.simple-link')
const hexLink = document.querySelector('.hex-link')

btn.addEventListener('click', function () {
  /**
   * todo
   * get random number between 0-3
   * and assign to body's background color from colors
   * then assign to textContent of span
   */

  const random = Math.floor(Math.random() * colors.length)
  document.body.style.backgroundColor = colors[random]
  color.textContent = colors[random]
})
