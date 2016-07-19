/*
===================================================================
Put 2 of each card into an array.  Scramble them.
Put each into a div.
Put a div over the div, hiding the div.
Press Start button.  Allow only two cards to show at a time.  Keep the div. 
if timer reaches zero, display all cards, put RED border around unmatched cards.
Put new message.
===================================================================
*/


var elDirectionsBox = document.getElementById('directions');
var elStartButton = document.getElementById('startbutton');
var elGameOverBox = document.getElementById('gameover');
var totalMatches = document.getElementById('totalMatches');
var elTryAgainButton = document.getElementById('tryagainbutton'); 
var elAssignedCards = document.getElementsByClassName('card assigned'); 
var cardsArr = document.getElementsByClassName('card'); // find all the cards that have class="card" 
var cardscontainer = document.getElementById('cardscontainer');	// parent element
var elTimeleftSpan = document.getElementById('timeleft');
var flippedOne = document.getElementsByClassName('flippedOne'); //back of Card1
var flippedTwo = document.getElementsByClassName('flippedTwo'); //back of Card2


/* ======== elTryAgainButton.addEventListener('click', randomizeCards, false);=== */

function tryAgain() {
	turnoverCards();
	elGameOverBox.style.visibility = 'hidden';
	elDirectionsBox.style.visibility = 'visible';
	resetCounterAndMatches();
	elTimeleftSpan.innerHTML = 30;
}

function cardsContainerChange() {
	if(elGameOverBox.style.visibility == 'visible') {
		cardscontainer.id = 'gameovercardscontainer';
	} else {
		cardscontainer.id = 'cardscontainer';
	}
}

/* ======== prevent cards from being clicked after time runs out, show GameOver Box, report number of matches === */
function gameOver() {
	totalMatches.innerHTML = numberOfMatches;
	elGameOverBox.style.visibility = 'visible';
	cardsContainerChange();
}


/* ======== Resets timer and number of matches === */

function resetCounterAndMatches() {
	count = 30; // count for the startTimer() myTimer()
	numberOfMatches = 0; // number of correctly matched pairs
}

/* ======== countMatches() counts correctly matched pairs ========== */ 

function countMatches() {
	numberOfMatches += 1;
	return numberOfMatches;
}

/* ======== startTimer() starts timer when elStartButton is clicked ========== */ 


function startTimer() {
	var timerInterval = setInterval(myTimer, 1000);
		function myTimer() {
				if (cardscontainer.id == 'cardscontainer') {
					count -= 1;
					if (count >= 0) {
						elTimeleftSpan.innerHTML = count;
				}
			} 
			if (count < 0) {
				count = 30;
				gameOver();
			}
		}
}

/* ======== randomizeCards() assigns a randomly generated image to each card ========== */ 

function randomizeCards() {
	var imgArr = ['0 0', '0 0', '0 160px', '0 160px', 					//array of images
				  '0 360px', '0 360px', '200px 190px', '200px 190px',
				  '200px 360px', '200px 360px', '420px 360px', '420px 360px', 
				  '200px 600px', '200px 600px', '420px 590px', '420px 590px',  
				  '410px 160px', '410px 160px'];
	var i = 0;
	
	for ( i ; i < cardsArr.length ; i++ ) {
		var elCard = cardsArr[i];
		randomIndex = Math.floor(Math.random() * (imgArr.length));
		elCard.style.background = 'url(monetliliestiles.jpg) ' + imgArr[randomIndex];
		imgArr.splice(randomIndex,1);
		elCard.className = 'card assigned';
	}
}

/* ======== turnoverCards() combined with reset(); turns cards to the back ================ */

function turnoverCards() {
	var matchCards = document.getElementsByClassName('match'); // find all the backs of cards class="match"
	var i = 0;
	while (matchCards.length) {
		matchCards[0].className = 'back';
	}
}

/* ======== Add EventListeners to the Start Button and Try Again Button ================ */

	elStartButton.addEventListener('click', function() { 
		elDirectionsBox.style.visibility = 'hidden'; }, false);
	elStartButton.addEventListener('click', startTimer, false);
	elStartButton.addEventListener('click', randomizeCards, false);
	elStartButton.addEventListener('click', canClick, false);
	elStartButton.addEventListener('click', cardsContainerChange, false);
	elStartButton.addEventListener('click', resetCounterAndMatches, false);

elTryAgainButton.addEventListener('click', tryAgain, false);

/* === set up EventListener on parent element 'cardscontainer' to call showCard(e) on click ====== */

function canClick() {
	if (cardscontainer.addEventListener) {
		cardscontainer.addEventListener('click', function(e) { 
			showCard(e);
		}, false);
	}
}	

/* ======== showCard(e) if clicking on an child element of parent 'cardscontainer' ====== */

var countShowCard = 0;
var cardOne, cardTwo = undefined;

function getTarget(e) {
	return e.target;
}

function showCard(e) {							/*  only two cards can be clicked  */ 
	if (cardscontainer.id == 'cardscontainer') {
		var target = getTarget(e); // back of card
		var targetParent = target.parentNode; // front of card
			if (target.className == 'back') {
				countShowCard++;
				if (countShowCard == 1) {	/* only two unmatched cards can show at any given time  */ 
					targetParent.id = 'cardOne';
					target.className = 'match';
					target.id = 'matchOne';
					cardOne = document.getElementById('cardOne');
				}
				if (countShowCard == 2) {
					targetParent.id = 'cardTwo';
					target.className = 'match';
					target.id = 'matchTwo';
					cardTwo = document.getElementById('cardTwo');
					countShowCard = 0;
					findMatch();
					cardsContainerChange();
				}			
			}
	}
}

/* ======== check matches ====== */


function findMatch() {	// see if cards match by comparing their background values
	var mO = document.getElementById('matchOne');
	var mT = document.getElementById('matchTwo');
	var cardOneFront = cardOne.style.background;
	var cardTwoFront = cardTwo.style.background;
		if (cardOneFront == cardTwoFront) {	
			countMatches();		
		} else {
			setTimeout(notAMatch, 450); // 450 sets delay on NotAMatch
			function notAMatch() {
				mO.className = 'back';
				mT.className = 'back';
			}
		}
		/*	============ display 'Congratulations' message if all div.cards class='match',  ========  */
		if (numberOfMatches == 9) {
			document.getElementById('congratulations').style.visibility = 'visible';
			document.getElementById('winningtime').innerHTML = count;
		}
	
	cardOne.id = ''; // resets attributes, 'cardOne' 'cardTwo'
	cardTwo.id = '';
	mO.id = ''; // resets id attribute, mO mT
	mT.id = '';
	cardsContainerChange();
}

/*	============ if all div.cards class='back' && timer reaches 0 seconds ========  

function revealUnmatchedCards() {
	if (className == 'back' && time == 0) {
		style.borderColor = red;
	}
}

*/
