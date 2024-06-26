const { JamBuddy } = require("./jam_buddy");
const { updateJamBuddy } = require("./app_helper");
const { displayed, userInput, buttons, answers } = require("./dom_elements");
const { musicNotes } = require("./helper_objects");
const { calculateNoteDifferences } = require("./helper_functions");

const buddy = new JamBuddy();
let streak = 0;
const resultMessage = document.getElementById("resultMessage");

function displayNotes(buddy) {
  const notesDisplay = displayed.notesDisplay;
  const currentNotes = buddy.getCurrentNotes();
  notesDisplay.textContent = `Current Notes: ${currentNotes[0]} and ${currentNotes[1]}`;
}

function displayResult(isCorrect) {
  if (isCorrect) {
    resultMessage.textContent = answers.correct;
    buttons.submitButton.disabled = true;
    streak++;
    updateStreakDisplay();
  } else {
    resultMessage.textContent = answers.incorrect;
    streak = 0;
    updateStreakDisplay();
  }

  updateStreakDisplay();

  setTimeout(() => {
    clearResultMessage();
  }, 3000);
}

function displayExplanation() {
  const explanationMessage = document.getElementById("explanationMessage");
  const currentNotes = buddy.getCurrentNotes();
  const correctAnswers = calculateNoteDifferences(
    currentNotes[0],
    currentNotes[1]
  );

  const harmonicNotes = [
    "A/Bb",
    "A#",
    "B",
    "C",
    "C#/Db",
    "D",
    "D#/Eb",
    "E",
    "F",
    "F#/Gb",
    "G",
    "G#/Ab",
  ];

  const formattedNotes = harmonicNotes
    .map((note) => {
      const seperatedNotes = note.split("/");

      if (
        seperatedNotes.includes(currentNotes[0]) ||
        seperatedNotes.includes(currentNotes[1])
      ) {
        return `<b>${seperatedNotes.join("/")}</b>`;
      }
      return note;
    })
    .join(", ");

  explanationMessage.innerHTML = `Explanation - These are the notes in their order: ${formattedNotes}. The notes are <b>${currentNotes[0]}</b> and <b>${currentNotes[1]}</b>. The correct semitone difference is <b>${correctAnswers.anticlockwise}</b> in the clockwise direction & <b>${correctAnswers.clockwise}</b> in the anti-clockwise.`;
}

function clearResultMessage() {
  resultMessage.textContent = "";
  const answerInput = document.getElementById("answerInput");
  answerInput.value = "";
}

function clearExplanationMessage() {
  displayed.explanationMessage.textContent = "";
}

function updateStreakDisplay() {
  const streakDisplay = document.getElementById("streakDisplay");
  streakDisplay.textContent = `Streak: ${streak}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const answerForm = buttons.answerForm;
  answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answerInput = userInput.answerInput;
    const userAnswer = parseInt(answerInput.value, 10);
    let isCorrect;
    try {
      updateJamBuddy(buddy);
      isCorrect = buddy.checkAnswer(userAnswer);
      displayResult(isCorrect, () => {
        const submitButton = buttons.submitButton;
        const randomizeButton = buttons.randomizeButton;
        randomizeButton.disabled = true;
        submitButton.disabled = true;
      });
    } catch (error) {
      const resultMessage = displayed.resultMessage;
      resultMessage.textContent = error.message;
    }
  });

  const randomizeButton = buttons.randomizeButton;
  randomizeButton.addEventListener("click", () => {
    buddy.randomizeCurrentNotes();
    displayNotes(buddy);
    buttons.submitButton.disabled = false;
    clearResultMessage();
    clearExplanationMessage();
  });

  const giveUpButton = document.getElementById("giveUpButton");
  giveUpButton.addEventListener("click", () => {
    displayExplanation();
    streak = 0;
    buttons.submitButton.disabled = true;
    updateStreakDisplay();
  });

  buddy.randomizeCurrentNotes();
  displayNotes(buddy);
});

module.exports = {
  displayNotes,
  displayResult,
  clearResultMessage,
  displayExplanation,
  updateStreakDisplay,
};
