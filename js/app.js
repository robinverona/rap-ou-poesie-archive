'use strict'; 
const cardDeck = document.querySelector('.card-deck')
const rapButton = document.getElementById('rapButton')
const poetryButton = document.getElementById('poetryButton')
const rulesButton = document.getElementById('rulesButton')
const rulesCurtain = document.querySelector('.rules-curtain')
let cardFrontTarget = document.querySelector('.card-front')
const startButton = document.getElementById('startButton')

let counterHtml
let loadedQuotes = []
let quotes = []
let availableQuotes = []
let i = 0
let card // reference to current card
let counter = 0
let randomIndex
let bounds


// get all quotes from JSON
fetch('https://robinverona.github.io/rap-ou-poesie/data/quotes.json')
    .then(res => {
        return res.json()
    })
    .then(quotesFromJSON => {
        loadedQuotes = quotesFromJSON
        init();     
    })
    .catch(err => {
        console.error(err)
});


function init() {
    quotes = [...loadedQuotes]
    shuffle(quotes)
    gsap.fromTo('.masthead', {
        y: -72, 
        opacity: 0,
        ease: Power1. easeOut,
    }, {
        y: 0, 
        opacity: 1,
        ease: Power1. easeOut,
    })

    
    setTimeout(() => {
        createCounter()
        createCard(quotes[i])

        gsap.fromTo('.controls', {
            y: 100, 
            opacity: 0,
            ease: Power1. easeOut,
        }, {
            y: 0, 
            opacity: 1,
            ease: Power1. easeOut,
        })

    }, 1000);
}


function createCard(question) {
    const colors = ['green', 'orange', 'purple', 'yellow', 'grey', 'blue', 'pink', 'skyblue', 'brown']
    let randomNumber = Math.floor(Math.random() * colors.length)

    // Create card block
    card = document.createElement('div')
    card.classList.add('card')

    // Create inner card wrapper
    let cardInner = document.createElement('div')
    cardInner.classList.add('card-inner')

    card.appendChild(cardInner)
    
    // Create card front
    let cardFront = document.createElement('div')
    cardFront.classList.add('card-front')
    cardFront.classList.add(colors[randomNumber])
    
    cardInner.appendChild(cardFront)
    cardFrontTarget = cardFront

    let cardFrontPara = document.createElement('p')
    cardFrontPara.innerHTML = question.quote
    cardFrontPara.classList.add('card-text')
    cardFront.appendChild(cardFrontPara)

    // Create card back
    let cardBack = document.createElement('div')
    cardBack.classList.add('card-back')
    cardInner.appendChild(cardBack)

    let cardBackAuthor = document.createElement('span')
    cardBackAuthor.innerHTML = question.author
    cardBackAuthor.classList.add('card-author')
    cardBack.appendChild(cardBackAuthor)

    let cardBackOrigin = document.createElement('span')
    cardBackOrigin.innerHTML = question.origin
    cardBackOrigin.classList.add('card-origin')
    cardBack.appendChild(cardBackOrigin)

    // create glow div for effect
    let glowHtml = document.createElement('div')
    glowHtml.classList.add('glow')
    cardFront.appendChild(glowHtml)

    // cardDeck.appendChild(card)
    cardDeck.insertBefore(card, cardDeck.children[1]); 


    gsap.fromTo('.card', {
        opacity: 0,
        y: -50
    }, {
        opacity: 1,
        y: 0
    })

    updateCounter()

    rapButton.disabled = false;
    poetryButton.disabled = false;

    cardFrontTarget.addEventListener('mouseenter', () => {
        bounds = cardFrontTarget.getBoundingClientRect();
        document.addEventListener('mousemove', rotateToMouse);
      });
      
      cardFrontTarget.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', rotateToMouse);
        cardFrontTarget.style.transform = '';
        cardFrontTarget.style.background = '';
      });

}

function flipCard() {
    card.classList.add('translated')
}

function removeCard(card) {
    card.remove();
}

function nextCard() {
    i++;
    if (i === quotes.length) {
        console.log('fin')
        gsap.to('.curtain', {
            height: '100%'
        })
        gsap.to('.menu', {
            delay: 0.5,
            opacity: 1
        })
    } else {
        // randomIndex = Math.floor(Math.random() * quotes.length)
        removeCard(card)
        createCard(quotes[i])
    }   
}

function checkAnswer(answer) {
    if (quotes[i].answer === answer) {
        gsap.to(".card-back", {
            backgroundColor: '#16B84E',
        })

    } else {
        gsap.to(".card-back", {
            backgroundColor: '#FE1B00'
        })
    }

    setTimeout(() => {
        nextCard()
    }, 1500);
}

function createCounter() {
    counterHtml = document.createElement('div')
    counterHtml.classList.add('counter')

    let counterCurrent = document.createElement('span')
    counterCurrent.classList.add('counter-current')
    counterCurrent.innerHTML = counter
    counterHtml.appendChild(counterCurrent)

    let totalCount = document.createElement('span')
    totalCount.innerHTML = ` / ${quotes.length}`
    counterHtml.appendChild(totalCount)

    cardDeck.insertBefore(counterHtml, cardDeck.children[0])

    gsap.from('.counter', {
        opacity: 0
    })
}


function updateCounter() {
    counter++
    // counterHtml.innerHTML = `${counter} / ${quotes.length}`
    let counterCurrent = document.querySelector('.counter-current')
    counterCurrent.innerHTML = `${counter}`
    gsap.from('.counter-current', {
        y: -100,
        opacity: 0
    })

}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    }
    const distance = Math.sqrt(center.x**2 + center.y**2);
    
    cardFrontTarget.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance)* 2}deg
      )
    `;
    
    cardFrontTarget.querySelector('.glow').style.backgroundImage = `
      radial-gradient(
        circle at
        ${center.x * 2 + bounds.width/2}px
        ${center.y * 2 + bounds.height/2}px,
        #ffffff55,
        #0000000f
      )
    `;
  }
  

rapButton.addEventListener('click', () => {
    flipCard()
    rapButton.disabled = true;
    checkAnswer('rap')
    setTimeout(() => {
        gsap.to(".card", {
            transform: 'scale(1.3) rotate(-40deg) translateY(-80px)',
            opacity: 0,
            ease: Power1. easeOut,
        })
    }, 1000);
})





poetryButton.addEventListener('click', () => {
    flipCard()
    poetryButton.disabled = true;
    checkAnswer('poetry')
    setTimeout(() => {
        gsap.to(".card", {
            transform: 'scale(1.3) rotate(40deg) translateY(-80px)',
            opacity: 0,
            ease: Power1. easeOut,
        })
    }, 1000);
})

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
    
if (!isMobile()) {
    poetryButton.addEventListener('mouseenter', () => {
        let circle = document.querySelector('#poetryButton img')
        circle.style.animationDuration = '5s'
    })
    
    poetryButton.addEventListener('mouseleave', () => {
        let circle = document.querySelector('#poetryButton img')
        circle.style.animationDuration = '20s'
    })
    rapButton.addEventListener('mouseenter', () => {
        let circle = document.querySelector('#rapButton img')
        circle.style.animationDuration = '5s'
    })
    
    rapButton.addEventListener('mouseleave', () => {
        let circle = document.querySelector('#rapButton img')
        circle.style.animationDuration = '20s'
    })    
}



rulesButton.addEventListener('click', () => {
    rulesButton.classList.add('closeButton')
    // const closeButton = document.querySelector('.closeButton')
    rulesCurtain.classList.toggle('open')

    if (!rulesCurtain.classList.contains('open')) {
        rulesButton.innerHTML = 'infos'
        gsap.to('.rules-content', {
            opacity: 0,
        })
    } 

    if (rulesCurtain.classList.contains('open')) {
        rulesButton.innerHTML = 'fermer'
        gsap.to('.rules-content', {
            opacity: 1,
            delay: 0.5
        })
    } 


    rulesCurtain.addEventListener('click', () => {
        rulesCurtain.classList.remove('open')
        if (!rulesCurtain.classList.contains('open')) {
            rulesButton.innerHTML = 'infos'
        } 
    
        if (rulesCurtain.classList.contains('open')) {
            rulesButton.innerHTML = 'fermer'
        } 

        gsap.to('.rules-content', {
            opacity: 0,
            delay: 0.5
        })

    })
})

startButton.addEventListener('click', (e) => {
    rulesCurtain.classList.remove('open')
    gsap.to('.rules-content', {
        opacity: 0,
        // delay: 0.5
    })

})