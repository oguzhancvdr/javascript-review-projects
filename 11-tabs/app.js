const btns = document.querySelectorAll('.tab-btn')
const about = document.querySelector('.about')
const articles = document.querySelectorAll('.content')

about.addEventListener('click', function(e){
  // ! to reach target and benefit from event bubling in this logic is important
  // console.log(e.target.dataset.id);
  const id = e.target.dataset.id
  if(id){
    // remove active class all from buttons
    btns.forEach(function(btn){
      btn.classList.remove('active')
      // add active class to clicked button
      e.target.classList.add('active')
    })
    // hide all articles
    articles.forEach(function(article){
      article.classList.remove('active')
    })
    // capture element which is matched with clicked tab
    const element = document.getElementById(id)
    // add active class to matched tab's content
    element.classList.add('active')
  }
})