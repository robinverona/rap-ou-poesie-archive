'use strict'; 
const cardDeck = document.querySelector('.card-deck')
const rapButton = document.getElementById('rapButton')
const poetryButton = document.getElementById('poetryButton')
const rulesButton = document.getElementById('rulesButton')

let counterHtml
let loadedQuotes = []
let quotes = []
let i = 0
let card // reference to current card
let counter = 0
let randomIndex;

// get quotes from JSON
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
        counterHtml = document.createElement('div')
        counterHtml.classList.add('counter')
        cardDeck.insertBefore(counterHtml, cardDeck.children[0]); 
        // randomIndex = Math.floor(Math.random() * quotes.length)
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
    const colors = ['green', 'purple', 'yellow', 'grey', 'blue', 'pink', 'skyblue', 'brown']
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
            backgroundColor: '#00d13c'
        })

    } else {
        gsap.to(".card-back", {
            backgroundColor: '#FE1B00'
        })
    }

    setTimeout(() => {
        nextCard()
    }, 2500);
}


function updateCounter() {
    counter++
    counterHtml.innerHTML = `${counter} / ${quotes.length}`
}


rapButton.addEventListener('click', () => {
    flipCard()
    rapButton.disabled = true;
    checkAnswer('rap')
    setTimeout(() => {
        gsap.to(".card", {
            // delay: 1,
            transform: 'rotate(-40deg) translateY(-80px)',
            opacity: 0,
            ease: Power1. easeOut,
        })
    }, 2000);
    // setTimeout(() => {
    //     nextCard()
    // }, 2500);
})

poetryButton.addEventListener('click', () => {
    flipCard()
    poetryButton.disabled = true;
    checkAnswer('poetry')
    setTimeout(() => {
        gsap.to(".card", {
            // delay: 1,
            transform: 'rotate(40deg) translateY(-80px)',
            opacity: 0,
            ease: Power1. easeOut,
        })
    }, 2000);
    // setTimeout(() => {
    //     nextCard()
    // }, 2500);
})


rulesButton.addEventListener('click', () => {
    const rulesCurtain = document.querySelector('.rules-curtain')
    rulesCurtain.classList.toggle('open')
    gsap.to('.rules-content', {
        opacity: 1,
        delay: 1
    })
})