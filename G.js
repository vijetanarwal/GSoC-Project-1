const deckCards = ["🍀", "🍀", "🚢", "🚢", "😎", "😎", "🔑", "🔑"];
const deck = document.querySelector(".deck");
let opened = [];
let matched = [];
const modal = document.getElementById("modal");
const reset = document.querySelector(".reset-btn");
const playAgain = document.querySelector(".play-again-btn");
const movesCount = document.querySelector(".moves-counter");
let moves = 0;
const stars = document.getElementById("star-rating").querySelectorAll(".star");
let starCount = 3;
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function startGame() {
    modal.style.display = 'none'; // Ensure modal is hidden at the start of the game
    const shuffledDeck = shuffle(deckCards);
    for (let i = 0; i < shuffledDeck.length; i++) {
        const liTag = document.createElement('LI');
        liTag.classList.add('card');
        
        const backFace = document.createElement('DIV');
        backFace.classList.add('back');
        backFace.textContent = "🂠"; // Backside of the card
        
        const emoji = document.createElement('SPAN');
        emoji.textContent = shuffledDeck[i];
        
        liTag.appendChild(backFace);
        liTag.appendChild(emoji);
        
        deck.append(liTag);
    }
}

startGame();

function removeCard() {
    while (deck.hasChildNodes()) {
        deck.removeChild(deck.firstChild);
    }
}

function timer() {
    time = setInterval(function () {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i> Timer: " + minutes + " Mins " + seconds + " Secs";
    }, 1000);
}

function stopTime() {
    clearInterval(time);
}

function resetEverything() {
    stopTime();
    timeStart = false;
    seconds = 0;
    minutes = 0;
    timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i> Timer: 00:00";

    stars[1].firstElementChild.classList.add("fa-star");
    stars[2].firstElementChild.classList.add("fa-star");
    starCount = 3;
    moves = 0;
    movesCount.innerHTML = 0;
    matched = [];
    opened = [];
    removeCard();
    startGame();
}

function movesCounter() {
    movesCount.innerHTML++;
    moves++;
}

function starRating() {
    if (moves === 14) {
        stars[2].firstElementChild.classList.remove("fa-star");
        starCount--;
    }
    if (moves === 18) {
        stars[1].firstElementChild.classList.remove("fa-star");
        starCount--;
    }
}

function compareTwo() {
    if (opened.length === 2) {
        document.body.style.pointerEvents = "none";
    }
    if (opened.length === 2 && opened[0].querySelector('span').textContent === opened[1].querySelector('span').textContent) {
        match();
    } else if (opened.length === 2 && opened[0].querySelector('span').textContent !== opened[1].querySelector('span').textContent) {
        noMatch();
    }
}

function match() {
    setTimeout(function () {
        opened[0].classList.add("match");
        opened[1].classList.add("match");
        matched.push(...opened);
        document.body.style.pointerEvents = "auto";
        winGame();
        opened = [];
    }, 700);
}

function noMatch() {
    setTimeout(function () {
        opened[0].classList.remove("flip");
        opened[1].classList.remove("flip");
        document.body.style.pointerEvents = "auto";
        opened = [];
    }, 800);
    movesCounter();
    starRating();
}

function addStats() {
    const stats = document.querySelector(".modal-content");
    for (let i = 1; i <= 3; i++) {
        const statsElement = document.createElement("p");
        statsElement.classList.add('stats');
        stats.appendChild(statsElement);
    }
    let p = stats.querySelectorAll("p.stats");
    p[0].innerHTML = "Time to complete: " + minutes + " Minutes and " + seconds + " seconds";
    p[1].innerHTML = "Moves Taken: " + moves;
    p[2].innerHTML = "Your star rating is: " + starCount + " out of 3";
}

function displayModal() {
    const modalClose = document.getElementsByClassName("close")[0];
    modal.style.display = "block"; // Display modal only when the game is won
    modalClose.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function winGame() {
    if (matched.length === 8) { // Adjusted for 8 pairs (16 cards total)
        stopTime();
        addStats();
        displayModal();
    }
}

deck.addEventListener("click", function (evt) {
    if (evt.target.classList.contains('back')) {
        console.log(evt.target.nodeName + " was clicked");
        if (timeStart === false) {
            timeStart = true;
            timer();
        }
        flipCard(evt);
    }

    function flipCard(evt) {
        const card = evt.target.parentElement;
        card.classList.add("flip"); // Flip the card from the back side
        addToOpened(card);
    }

    function addToOpened(card) {
        if (opened.length === 0 || opened.length === 1) {
            opened.push(card);
        }
        compareTwo();
    }
});

reset.addEventListener('click', resetEverything);
playAgain.addEventListener('click', function () {
    modal.style.display = 'none';
    resetEverything();
});
