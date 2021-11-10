const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const giveaway = document.querySelector('.giveaway')
const deadline = document.querySelector('.deadline')

// we can capture elements under the common class
const items = document.querySelectorAll('.deadline-format h4')

let tempDate = new Date()
let tempYear = tempDate.getFullYear()
let tempMonth = tempDate.getMonth()
let tempDay = tempDate.getDate()


// let futureDate = new Date(2022, 3, 20, 19, 20, 0)
// when app started countdown from 10 days
const futureDate = new Date(tempYear, tempMonth, tempDay + 10, 19, 37, 0)
const year = futureDate.getFullYear()
const hours = futureDate.getHours()
const minutes = futureDate.getMinutes()
const month = months[futureDate.getMonth()]
const day = weekdays[futureDate.getDay()]
const date = futureDate.getDate()

giveaway.textContent = `giveaway ends on ${day}, ${date} ${month} ${year} ${hours}:${minutes}pm`

// future time in ms
const futureTime = futureDate.getTime()

function getRemainingTime() {
  const today = new Date().getTime()
  const t = futureTime - today
  // 1s = 1000ms
  // 1m = 60s
  // 1hr = 60mn
  // 1d = 24hr

  // values in ms
  const oneDay = 24 * 60 * 60 * 1000
  const oneHour = 60 * 60 * 1000
  const oneMin = 60 * 1000

  // calculate
  let days = Math.floor(t / oneDay)
  let hours = Math.floor((t % oneDay) / oneHour)
  let minutes = Math.floor((t % oneHour) / oneMin)
  let seconds = Math.floor((t % oneMin) / 1000)

  // set values array
  const values = [days, hours, minutes, seconds]
  function format(item) {
    if (item < 10) {
      return (item = `0${item}`)
    }
    return item
  }
  items.forEach(function (item, index) {
    item.innerHTML = format(values[index])
  })
  if (t < 0) {
    clearInterval(countdown)
    deadline.innerHTML = `<h2 class="expired">sorry this giveaway has expired</h2>`
  }
}

// countdown
let countdown = setInterval(getRemainingTime, 1000)
getRemainingTime()
