'use strict'; 
const cardDeck = document.querySelector('.card-deck');
const rapButton = document.getElementById('rapButton');
const poetryButton = document.getElementById('poetryButton');
const rulesButton = document.getElementById('rulesButton');
const rulesCurtain = document.querySelector('.rules-curtain');
let cardFrontTarget = document.querySelector('.card-front');
const startButton = document.getElementById('startButton');
const resultsButton = document.getElementById('resultsButton'); 
// const continueButton = document.getElementById('continueButton');
let counterHtml;
let loadedQuotes = [];
let quotes = [];
let availableQuotes = [];
let i = 0;
let card; // reference to current card
let counter = 0;
let randomIndex;
let bounds;


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(res => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err))
    })
}


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
    availableQuotes = [...loadedQuotes]
    shuffle(availableQuotes)
    quotes = pick(availableQuotes)
    console.log('quotes dans init', quotes)
    gsap.fromTo('.masthead', {
        y: -72, 
        opacity: 0,
        ease: Power1. easeOut,
    }, {
        y: 0, 
        opacity: 1,
        ease: Power1. easeOut,
    });

    
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

function pick(arr) {
    let newQuotes = [];
    for (let index = 0; index < 8; index++) {
        newQuotes.push(arr[index]);
        delete arr[index]; 
    }
    console.log(newQuotes);
    return newQuotes;
}

function createCard(question) {
    const colors = ['green', 'orange', 'purple', 'yellow', 'grey', 'blue', 'pink', 'skyblue', 'brown'];
    let randomNumber = Math.floor(Math.random() * colors.length);

    // Create card block
    card = document.createElement('div');
    card.classList.add('card');

    // Create inner card wrapper
    let cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    card.appendChild(cardInner);
    
    // Create card front
    let cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.classList.add(colors[randomNumber]);
    
    cardInner.appendChild(cardFront);
    cardFrontTarget = cardFront;

    let cardFrontPara = document.createElement('p');
    cardFrontPara.innerHTML = question.quote;
    cardFrontPara.classList.add('card-text');
    cardFront.appendChild(cardFrontPara);

    // Create card back
    let cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardInner.appendChild(cardBack);

    let cardBackAuthor = document.createElement('span');
    cardBackAuthor.innerHTML = question.author;
    cardBackAuthor.classList.add('card-author');
    cardBack.appendChild(cardBackAuthor);

    let cardBackOrigin = document.createElement('span');
    cardBackOrigin.innerHTML = question.origin;
    cardBackOrigin.classList.add('card-origin');
    cardBack.appendChild(cardBackOrigin);

    // create glow div for effect
    let glowHtml = document.createElement('div');
    glowHtml.classList.add('glow');
    cardFront.appendChild(glowHtml);

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
    card.classList.add('translated');
}

function removeCard(card) {
    card.remove();
}

function nextCard() {
    gsap.to('#content', {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
        duration: 1
    })
    i++;
    if (i === quotes.length) {
        console.log('fin')
        gsap.to('.curtain', {
            height: '100%',
            display: 'flex',
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
        gsap.to('.card-back', {
            backgroundColor: '#16B84E',
        })
        gsap.to('#content', {
            background: 'rgba(22, 184, 78, 0.3)',
            // duration: 1
        })
        setTimeout(() => {
            gsap.to('.card', 
            {
                transform: 'scale(1.3) rotate(40deg) translateY(-80px)',
                opacity: 0,
                ease: Power1. easeOut,
            })
        }, 1000);
        
    } else {
        gsap.to('.card-back', {
            backgroundColor: '#FE1B00'
        })
        gsap.to('#content', {
            background: 'rgba(254, 27, 0, 0.3)',
            // duration: 1
        })
        setTimeout(() => {
            gsap.to('.card', {
                transform: 'scale(1.3) rotate(-40deg) translateY(-80px)',
                opacity: 0,
                ease: Power1. easeOut,
            })
        }, 1000);
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
    gsap.to('.card', {
        transform: 'rotate(0)'
    })
    flipCard()
    rapButton.disabled = true;
    checkAnswer('rap')
    
})

poetryButton.addEventListener('click', () => {
    gsap.to('.card', {
        transform: 'rotate(0)'
    })
    flipCard()
    poetryButton.disabled = true;
    checkAnswer('poetry')
    
})

// rapButton.addEventListener('mouseenter', () => {
//     gsap.to('.card', {
//         transform: 'rotate(-10deg)'
//     })
// })

// rapButton.addEventListener('mouseleave', () => {
//     gsap.to('.card', {
//         transform: 'rotate(0)'
//     })
// })

// poetryButton.addEventListener('mouseenter', () => {
//     gsap.to('.card', {
//         transform: 'rotate(10deg)'
//     })
// })

// poetryButton.addEventListener('mouseleave', () => {
//     gsap.to('.card', {
//         transform: 'rotate(0)'
//     })
// })

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
    
if (!isMobile()) {    
    startButton.addEventListener('mouseenter', () => {
        let circle = document.querySelector('#startButton img')
        circle.style.animationDuration = '5s'
    })
    
    startButton.addEventListener('mouseleave', () => {
        let circle = document.querySelector('#startButton img')
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
    rulesCurtain.classList.remove('open');
    gsap.to('.rules-content', {
        opacity: 0,
        // delay: 0.5
    })

    startButton.style.display = 'none';
})

gsap.registerPlugin("ScrollTrigger", "Draggable");

resultsButton.addEventListener('click', () => {
    gsap.to('.card-deck', {
        opacity: 0, 
        display: 'none'
    });
    gsap.to('.controls', {
        opacity: 0, 
        display: 'none'
    });
    gsap.to('.curtain', {
        height: 0
    });

    const slider = document.querySelector('.slider');
    slider.style.display = 'block';
    const collection = document.querySelector('.wheel'); 
    console.log(quotes);


    quotes.forEach(quote => {


        const colors = ['green', 'orange', 'purple', 'yellow', 'grey', 'blue', 'pink', 'skyblue', 'brown'];
        let randomNumber = Math.floor(Math.random() * colors.length);


        let resultCard = document.createElement('li');
        resultCard.classList.add('card');
        resultCard.classList.add('wheel-card');

        resultCard.classList.add(colors[randomNumber]);


        let resultCardQuote = document.createElement('p');
        resultCardQuote.innerHTML = quote.quote;
        resultCardQuote.classList.add('card-text');
        resultCard.appendChild(resultCardQuote);

        let resultCardInfosWrapper = document.createElement('div'); 
        resultCardInfosWrapper.classList.add('card-infos');

        let resultCardAuthor = document.createElement('p');
        resultCardAuthor.innerHTML = quote.author;
        resultCardAuthor.classList.add('card-author');
        resultCardInfosWrapper.appendChild(resultCardAuthor);

        let resultCardOrigin = document.createElement('p');
        resultCardOrigin.innerHTML = quote.origin;
        resultCardOrigin.classList.add('card-origin');
        resultCardInfosWrapper.appendChild(resultCardOrigin);

        resultCard.appendChild(resultCardInfosWrapper);
        collection.appendChild(resultCard);

        // gsap.fromTo('.card', {
        //     y: 2000
        // }, {
        //     y: 0,
        //     stagger: 0.5,
        //     duration: 1
        // })
    });
    // console.clear();

    gsap.registerPlugin("ScrollTrigger");
    gsap.registerPlugin("Draggable");

    let body = document.querySelector('body');
    body.classList.add('collection')

    let wheel = document.querySelector(".wheel");
    let cards = gsap.utils.toArray(".wheel-card");

    // gsap.to(".arrow", { y: 5, ease: "power1.inOut", repeat: -1, yoyo: true });

    function setup() {
        let radius = wheel.offsetWidth / 2;
        let center = wheel.offsetWidth / 2;
        let total = cards.length;
        let slice = (2 * Math.PI) / total;

        cards.forEach((item, i) => {
            let angle = i * slice;

            let x = center + radius * Math.sin(angle);
            let y = center - radius * Math.cos(angle);

            gsap.set(item, {
                rotation: angle + "_rad",
                xPercent: -50,
                yPercent: -50,
                x: x,
                y: y
            });
        });
    }

    setup();

    window.addEventListener("resize", setup);

    gsap.to(".wheel", {
        rotate: () => -360,
        ease: "none",
        duration: cards.length,
        scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 1,
            snap: 1 / cards.length,
            invalidateOnRefresh: true
        }
    });

    // let cards = gsap.utils.toArray(".wheel-card");

    // let isFullScreen = false;

    Draggable.create(".wheel", {
        type: "rotation",
        inertia: true,
        snap: {
            rotation: gsap.utils.snap(360 / cards.length)
        }
    });
})


