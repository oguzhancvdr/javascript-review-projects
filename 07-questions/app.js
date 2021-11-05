// other solution by using selectors inside the element
const questions = document.querySelectorAll('.question')

questions.forEach(function(question){
  // we are just looking for an element of just inside questions not whole document
  const btn = question.querySelector('.question-btn')
  // console.log(btn);
  btn.addEventListener('click', function(){
    questions.forEach(function(item){
      if(item !== question){
        console.log({item, question});
        item.classList.remove('show-text')
      }
    })
    question.classList.toggle('show-text')
  })
})

// ? one solution by traversing the dom
// const questionBtns = document.querySelectorAll('.question-btn')

// questionBtns.forEach(function(btn){
//   btn.addEventListener('click', function(e){
//     // * we need to reach parent of parent of btn to show and hide questions
//     console.log(e.currentTarget.parentElement.parentElement);
//     const question = e.currentTarget.parentElement.parentElement
//     question.classList.toggle('show-text')
//   })
// })

