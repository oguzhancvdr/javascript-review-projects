const menu = [
  {
    id: 1,
    title: 'buttermilk pancakes',
    category: 'breakfast',
    price: 15.99,
    img: './images/item-1.jpeg',
    desc: `I'm baby woke mlkshk wolf bitters live-edge blue bottle, hammock freegan copper mug whatever cold-pressed `,
  },
  {
    id: 2,
    title: 'diner double',
    category: 'lunch',
    price: 13.99,
    img: './images/item-2.jpeg',
    desc: `vaporware iPhone mumblecore selvage raw denim slow-carb leggings gochujang helvetica man braid jianbing. Marfa thundercats `,
  },
  {
    id: 3,
    title: 'godzilla milkshake',
    category: 'shakes',
    price: 6.99,
    img: './images/item-3.jpeg',
    desc: `ombucha chillwave fanny pack 3 wolf moon street art photo booth before they sold out organic viral.`,
  },
  {
    id: 4,
    title: 'country delight',
    category: 'breakfast',
    price: 20.99,
    img: './images/item-4.jpeg',
    desc: `Shabby chic keffiyeh neutra snackwave pork belly shoreditch. Prism austin mlkshk truffaut, `,
  },
  {
    id: 5,
    title: 'egg attack',
    category: 'lunch',
    price: 22.99,
    img: './images/item-5.jpeg',
    desc: `franzen vegan pabst bicycle rights kickstarter pinterest meditation farm-to-table 90's pop-up `,
  },
  {
    id: 6,
    title: 'oreo dream',
    category: 'shakes',
    price: 18.99,
    img: './images/item-6.jpeg',
    desc: `Portland chicharrones ethical edison bulb, palo santo craft beer chia heirloom iPhone everyday`,
  },
  {
    id: 7,
    title: 'bacon overflow',
    category: 'breakfast',
    price: 8.99,
    img: './images/item-7.jpeg',
    desc: `carry jianbing normcore freegan. Viral single-origin coffee live-edge, pork belly cloud bread iceland put a bird `,
  },
  {
    id: 8,
    title: 'american classic',
    category: 'lunch',
    price: 12.99,
    img: './images/item-8.jpeg',
    desc: `on it tumblr kickstarter thundercats migas everyday carry squid palo santo leggings. Food truck truffaut  `,
  },
  {
    id: 9,
    title: 'quarantine buddy',
    category: 'shakes',
    price: 16.99,
    img: './images/item-9.jpeg',
    desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
  },
  {
    id: 10,
    title: 'dinner steak',
    category: 'dinner',
    price: 20.99,
    img: './images/item-10.jpeg',
    desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
  },
]

// we have an issue below logic
// what if an item which is category's dinner added ?
// it happens that users click all btn and our new item will be shown just in this case
// so we need to take just unique categories
// iterate over catefories return buttons
// make sure to select buttons when they are available

const sectionCenter = document.querySelector('.section-center')
const btnContainer = document.querySelector('.btn-container')

// when our page loads we will show menu items and filter buttons
window.addEventListener('DOMContentLoaded', function () {
  displayMenuItems(menu)
  displayMenuButtons()
})

function displayMenuItems(menuList) {
  let displayMenu = menuList.map(function (item) {
    return `
    <article class="menu-item">
      <img src=${item.img} class="photo" alt=${item.title}>
      <div class="item-info">
        <header>
          <h4>${item.title}</h4>
          <h4 class="price">$${item.price}</h4>
        </header>
        <p class="item-text">${item.desc}</p>
      </div>
    </article>`
  })
  // with join method we remove comma between each articles
  displayMenu = displayMenu.join('')
  sectionCenter.innerHTML = displayMenu
}

function displayMenuButtons() {
  const categories = menu.reduce(function (values, item) {
      // check our item.categories exist in our values or not
      // so that we can just take unique categories
      if (!values.includes(item.category)) {
        values.push(item.category)
      }
      return values
    },
    ['all']
  )

  const categoryBtns = categories.map(function (cat) {
      return `<button class="filter-btn" type="button" data-id=${cat}>${cat}</button>`
    }).join('')

  btnContainer.innerHTML = categoryBtns

  // we dont have to use always document we can reach elements from their parents
  const filterBtns = btnContainer.querySelectorAll('.filter-btn')
  // filter items
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // we reach our data-id out
      const category = e.currentTarget.dataset.id
      // we are filtering by our clicked category name
      const menuCategory = menu.filter(function (menuItem) {
        if (menuItem.category === category) {
          return menuItem
        }
      })
      if (category === 'all') {
        displayMenuItems(menu)
      } else {
        displayMenuItems(menuCategory)
      }
    })
  })
}
