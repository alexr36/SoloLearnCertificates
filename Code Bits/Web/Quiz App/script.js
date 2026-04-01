/*
 * *****************************************************************************
 * @file           : script.js
 * @author         : Alex Rogoziński
 * @brief          : This file contains the JavaScript code for the Quiz App. 
 *                   It handles the logic for displaying questions, checking answers, 
 *                   keeping track of the score, and managing the timer.
 *                   The code is partially provided by SoloLearn.         
 * *****************************************************************************
 */

// Variables to keep track of what question, the user's score, and which answer is correct for the current question
const MAX_QUESTIONS = 3;
const SECOND_MS = 1000;
const TIME_FADE_IN_MS = 10;
const TIME_QUESTION_CARD_JUMP = 20;

let questionNumber = 0;
let score = 0;
let correctAnswer = null;
let timeLimit = 5;
let currentTime = 0;

// Variables to access elements on the web page
let question = document.getElementById('question');
let points = document.getElementById('points');
let errorList = document.getElementById('error-list');

let trueButtonElement = document.getElementById("true");
let falseButtonElement = document.getElementById("false");

let timerDisplay = document.getElementById("timer");

let questionCard = document.getElementsByClassName("questionCard")[0];

// EventListeners for buttons
trueButtonElement.addEventListener(
  "pointerover", 
  () => { setButtonColor(trueButtonElement, "green"); }
);

trueButtonElement.addEventListener(
  "pointerout", 
  () => { resetButtonColor(trueButtonElement); }
);

falseButtonElement.addEventListener(
  "pointerover", 
  () => { setButtonColor(falseButtonElement, "red"); } 
);

falseButtonElement.addEventListener(
  "pointerout", 
  () => { resetButtonColor(falseButtonElement); }
);

// Functions to handle the quiz logic
/**
 * Adds event listeners to the reset button for pointerover and pointerout events.
 * Needed because the reset button is created dynamically after the user 
 * finishes the quiz, so event listeners cannot be added to it at the beginning 
 * of the script.
 * @return {void}
 */
function addResetButtonEventListeners(resetButton) {
  resetButton.addEventListener(
    "pointerover",
    () => { setButtonColor(resetButton, "lightgray"); }
  )
  resetButton.addEventListener(
    "pointerout",
    () => { resetButtonColor(resetButton); }
  )
}

/**
 * Sets the background color of a button to the specified color.
 * @param {HTMLElement} button 
 * @param {string} color 
 */
function setButtonColor(button, color) {
  button.style.backgroundColor = color;
}

/**
 * Resets the background color of a button to white.
 * @param {HTMLElement} button 
 */
function resetButtonColor(button) {
  button.style.backgroundColor = "white";
}

/**
 * Handles the logic for the true button click.
 * @returns {void}
 */
function trueButton() {
  if (correctAnswer == null) return;
  // Check if true is the correct answer
    // Add 1 to the score if it is correct
  if (correctAnswer) handleCorrectAnswer();

  //Update the textContent of points
  points.textContent = score;

  // Call the nextQuestion() function to load the next question;
  if (!correctAnswer) handleWrongAnswer();
  if (correctAnswer != null) nextQuestion();
}

/**
 * Handles the logic for the false button click.
 * @returns {void}
 */
function falseButton() {
  if (correctAnswer == null) return;
  // Check if false is the correct answer
    // Add 1 to the score if it is correct
  if (!correctAnswer) handleCorrectAnswer();

  //Update the textContent of points
  points.textContent = score;

  // Call the nextQuestion() function to load the next question;
  if (correctAnswer) handleWrongAnswer();

  nextQuestion();
}

/**
 * Handles the logic for when the user selects the correct answer.
 * @returns {void}
 */
function handleCorrectAnswer() {
  score++;
  animateAnswerCorrect();
}

/**
 * Handles the logic for when the user selects the wrong answer.
 * @returns {void}
 */
function handleWrongAnswer() {
  saveErrorToList();
  if (score > 0) score--;
  animateAnswerWrong();
}

/**
 * Handles the logic for loading the next question. It updates the question text
 * and the correct answer variable based on the current question number. 
 * If the user has finished all questions, it displays a message and a reset button.
 * @returns {void}
 */
function nextQuestion(){
  currentTime = timeLimit;
  animateQuestionCard();
  questionNumber = questionNumber + 1;

  switch (questionNumber){
    case 1:
      question.textContent = 'Is the Earth flat?';
      correctAnswer = false;
      break;
    case 2:
      question.textContent = 'Is the Earth round?';
      correctAnswer = true;
      break;
    case 3:
      question.textContent = 'Do you love programming?';
      correctAnswer = true;
      break;
    default:
      question.textContent = 'You finished the quiz!'
      correctAnswer = null;
      let resetButton = document.createElement("button");
      resetButton.textContent = "Reset";
      resetButton.id = "reset";

      if (document.getElementById("reset") == null) {
        document.body.appendChild(resetButton);
      }
      
      resetButton.addEventListener("click", resetQuiz);
      addResetButtonEventListeners(resetButton);
  }
}

/**
 * Resets the quiz to the initial state. It resets the question number, score, 
 * correct answer, and timer. It also clears the error list and loads 
 * the first question.
 * @returns {void}
 */
function resetQuiz() {
  questionNumber = 0;
  score = 0;
  correctAnswer = null;

  nextQuestion();

  errorList.innerHTML = '';
  currentTime = timeLimit;

  clearInterval(timer);

  timer = setInterval(handleTimer, SECOND_MS);
  timerDisplay.innerHTML = getTimerText();
  points.textContent = score;
  document.body.removeChild(document.getElementById("reset"));
}

/**
 * Returns the text for the timer display.
 * @returns {string}
 */
function getTimerText() {
  return `Time: ${currentTime}`;
}

nextQuestion();
// currentTime = timeLimit - 1;
timerDisplay.innerHTML = getTimerText()

/**
 * Saves the current question to the error list if the user selects the wrong answer.
 * It creates a new list item with the question text and appends it to the error list.
 * @returns {void}
 */
function saveErrorToList() {
  let listElement = document.createElement("li");
  let questionText = document.createTextNode(question.textContent);
  listElement.appendChild(questionText);
  errorList.appendChild(listElement);
}

if (correctAnswer == null && questionNumber > 0) {
  let resetButton = document.createElement("button");
  document.body.appendChild(resetButton);
}

/**
 * Handles the logic for the timer. It checks if the current time has reached 
 * the time limit for the question. If it has, it resets the current time 
 * and loads the next question. It also updates the timer display with the current time.
 * @returns {void}
 */
function handleTimer() {
  if (questionNumber > MAX_QUESTIONS) clearInterval(timer);

  if (currentTime == 0) {
    nextQuestion();
  }

  currentTime--;
  timerDisplay.innerHTML = getTimerText();
}

let timer = setInterval(handleTimer, SECOND_MS);

document.body.style.opacity = 0.0;
window.onload = bodyFadeIn;

/**
 * Handles the fade-in animation for the body of the webpage. It gradually 
 * increases the opacity of the body from 0 to 1 over a specified duration.
 * @returns {void}
 */
function bodyFadeIn() {
  let opacity = 0.0;
  let bodyFadeInTimer = setInterval(
    () => {
      if (opacity >= 1.0) clearInterval(bodyFadeInTimer);
      document.body.style.opacity = opacity;
      opacity += 0.01;
    }, 
    TIME_FADE_IN_MS
  );
}

/**
 * Animates the question card by increasing its width from 80% to 100% and then back to 80%.
 * It uses a timer to update the width at regular intervals, creating a jumping effect.
 * @returns {void}
 */
function animateQuestionCard() {
  let width = 80;
  let initialWidth = width;
  let animateIn = true;

  questionCard.style.width = `${++width}%`;
  let questionTimer = setInterval(
    () => {
      if (width <= 100 && animateIn) {
        if (width == 100) animateIn = false;
        width++;
      }
      else {
        if (width == initialWidth) clearInterval(questionTimer);
        width--;
      }

      questionCard.style.width = `${width}%`;
    },
    TIME_QUESTION_CARD_JUMP
  );
}

/**
 * Animates the answer correctness by changing the background color of the body.
 * @param {string} color - The color to change the background to.
 * @returns {void}
 */
function animateAnswerCorrect() {
  animateAnswerValidity("lightgreen");
}

/**
 * Animates the answer wrongness by changing the background color of the body.
 * @returns {void}
 */
function animateAnswerWrong() {
  animateAnswerValidity("lightcoral");
}

/**
 * Animates the answer validity by changing the background color of the body.
 * @param {string} color - The color to change the background to.
 * @returns {void}
 */
function animateAnswerValidity(color) {
  document.body.style.backgroundColor = color;
  setTimeout(
    () => { document.body.style.backgroundColor = "white";}, 
    500
  );
}
