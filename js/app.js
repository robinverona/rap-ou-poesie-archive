'use strict'; 
const cardDeck = document.querySelector('.card-deck');
const rapButton = document.getElementById('rapButton'); 
const poetryButton = document.getElementById('poetryButton');
const currentCard = document.querySelector('.card.current');

let quotes = []
let i = 0;

rapButton.addEventListener('click', () => {
    checkAnswer('rap');
    cardDeck.classList.add('rap');
})

poetryButton.addEventListener('click', () => {
    checkAnswer('poetry');
    setTimeout(() => {
        cardDeck.classList.add('poetry');
    }, 1000); //carte redevient grise après animation
    
})

document.body.addEventListener(
    'animationend', animationDone
);




fetch("../data/quotes.json")
    .then(res => {
        return res.json();
    })
    .then(loadedQuotes => {
        quotes = loadedQuotes;
        console.log(quotes);
        populateCard();
    })
    .catch(err => {
        console.error(err);
});

function populateCard() {
    console.log(quotes);
    currentCard.innerHTML = quotes[i].quote;
}

function nextCard() {
    i++;
    currentCard.innerHTML = quotes[i].quote;

}

function checkAnswer(answer) {
    if (quotes[i].answer === answer) {
        currentCard.classList.add('true')
    } else {
        currentCard.classList.add('false')
    }
    nextCard();

}


function animationDone(ev) {
    // remove the appropriate class
    // depending on the animation name
    if (ev.animationName === 'rap') {
        cardDeck.classList.remove('rap');
    }
    if (ev.animationName === 'poetry') {
        cardDeck.classList.remove('poetry');
    }
    if (ev.animationName === 'correct') {
        currentCard.classList.remove('true');
    }
    if (ev.animationName === 'incorrect') {
        currentCard.classList.remove('false');
    }
    // if (ev.animationName === 'reveal') {
    //     currentCard.classList.remove('current');
    // }

}


