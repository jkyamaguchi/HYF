let cards = [];
let flippedCards = [];
let revealCount = 0;
let seconds = 0;
let timerStarted = false;
let timerInterval = null;
let matchedPairs = 0;
let totalPairs = 0;

let frontImagePath = "cardFront.jpg";

// Scoreboard functions
async function loadScores() {
  try {
    const response = await fetch("/scores");
    if (!response.ok) throw new Error("Failed to load scores");
    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error("Error loading scores:", error);
    return [];
  }
}

async function saveScore(playerName, time, reveals) {
  try {
    const response = await fetch("/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerName,
        time: time,
        reveals: reveals,
      }),
    });

    if (!response.ok) throw new Error("Failed to save score");
    const topScores = await response.json();
    return topScores;
  } catch (error) {
    console.error("Error saving score:", error);
    return [];
  }
}

async function displayScoreboard(elementId = "results-scoreboard-list") {
  const scores = await loadScores();
  const scoreboardList = document.getElementById(elementId);

  if (!scoreboardList) return;

  // Clear existing content
  scoreboardList.innerHTML = "";

  if (scores.length === 0) {
    const emptyMessage = createElement("div", "empty-scoreboard");
    emptyMessage.textContent = "No scores yet. Be the first!";
    scoreboardList.appendChild(emptyMessage);
    return;
  }

  scores.forEach((score, index) => {
    const scoreItem = createElement("div", "score-item");

    const scoreName = createElement("div", "score-name");
    scoreName.textContent = `${index + 1}. ${score.name}`;

    const scoreTime = createElement("div", "score-time");
    scoreTime.textContent = `Time: ${formatTimeInMinSec(score.time)}`;

    const scoreReveals = createElement("div", "score-reveals");
    scoreReveals.textContent = `Reveals: ${score.reveals}`;

    scoreItem.append(scoreName, scoreTime, scoreReveals);
    scoreboardList.appendChild(scoreItem);
  });
}

function createPairs(cardData) {
  return [...cardData, ...cardData];
}

function checkWinConditionAndStopTimer() {
  if (matchedPairs === totalPairs) {
    clearInterval(timerInterval);

    setTimeout(async () => {
      await showResultsPage();
    }, 500);
  }
}

async function showResultsPage() {
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("results-page").classList.remove("hidden");

  document.getElementById("final-time").textContent =
    formatTimeInMinSec(seconds);
  document.getElementById("final-reveals").textContent = revealCount;

  await displayScoreboard();

  // Focus on name input
  document.getElementById("player-name-input").focus();
}

function handleSaveScore(event) {
  event.preventDefault();

  const nameInput = document.getElementById("player-name-input");
  const playerName = nameInput.value.trim();

  if (playerName) {
    saveScore(playerName, seconds, revealCount).then(() => {
      displayScoreboard();

      // Disable form after saving
      nameInput.disabled = true;
      event.target.querySelector("button").disabled = true;
      event.target.querySelector("button").textContent = "Saved!";
    });
  }
}

function handlePlayAgain() {
  document.getElementById("results-page").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  // Reset form
  const form = document.getElementById("save-score-form");
  form.reset();
  const nameInput = document.getElementById("player-name-input");
  nameInput.disabled = false;
  const saveButton = form.querySelector("button");
  saveButton.disabled = false;
  saveButton.textContent = "Save Score";

  resetGame();
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  const id1 = card1.dataset.cardId;
  const id2 = card2.dataset.cardId;

  if (id1 === id2) {
    // Wait for flip animation to complete
    setTimeout(() => {
      card1.classList.add("matched");
      card2.classList.add("matched");
      flippedCards = [];
      matchedPairs++;

      checkWinConditionAndStopTimer();
    }, 600);
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1500);
  }
}

function incrementRevealCount() {
  revealCount++;
  document.getElementById("reveal-count").textContent = revealCount;
}

function handleCardClick(event) {
  startTimer();
  const card = event.currentTarget;

  if (flippedCards.length === 2) {
    return;
  }

  flippedCards.push(card);
  card.classList.add("flipped");

  incrementRevealCount();

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function createElement(tag, className, attributes = {}) {
  const element = document.createElement(tag);
  element.className = className;
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
}

function createCardFace(className, imageSrc, imageAlt) {
  const face = createElement("div", className);
  face.appendChild(
    createElement("img", "card-image", { src: imageSrc, alt: imageAlt }),
  );
  return face;
}

function createCardElement(card) {
  const cardElement = createElement("li", "card");
  cardElement.dataset.cardId = card.id;
  cardElement.addEventListener("click", handleCardClick);

  const cardInner = createElement("div", "card-inner");
  cardInner.append(
    createCardFace("card-front", `/images/${frontImagePath}`, "Card front"),
    createCardFace("card-back", `/images/${card.image}`, card.name),
  );

  cardElement.appendChild(cardInner);
  return cardElement;
}

async function getCards() {
  const response = await fetch("/cards");
  const data = await response.json();
  console.log("Cards fetched:", data);
  return data;
}

async function renderCards() {
  const grid = document.querySelector(".cards-list");
  cards.forEach((card) => {
    const cardElement = createCardElement(card);
    grid.appendChild(cardElement);
  });
}

function shuffleCards(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function formatTimeInMinSec(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = formatTimeInMinSec(seconds);
  }, 1000);

  // Trigger first increment immediately to avoid 1-second delay
  seconds++;
  document.getElementById("timer").textContent = formatTimeInMinSec(seconds);
}

async function resetGame() {
  flippedCards = [];
  revealCount = 0;
  seconds = 0;
  timerStarted = false;
  matchedPairs = 0;

  clearInterval(timerInterval);

  document.getElementById("reveal-count").textContent = "0";
  document.getElementById("timer").textContent = "0:00";

  const grid = document.querySelector(".cards-list");
  grid.innerHTML = "";

  const cardData = await getCards();
  totalPairs = cardData.length;
  cards = shuffleCards(createPairs(cardData));

  renderCards();
}

async function getGameConfig() {
  try {
    const response = await fetch("/config/card_front_image");
    if (!response.ok) throw new Error("Config fetch failed");
    const data = await response.json();
    return data.value || "cardFront.jpg";
  } catch (error) {
    console.error("Config error:", error);
    return "cardFront.jpg"; // Default fallback
  }
}

async function initGame() {
  frontImagePath = await getGameConfig();
  const cardData = await getCards();
  const pairedCards = createPairs(cardData);
  totalPairs = cardData.length;
  cards = shuffleCards(pairedCards);
  renderCards();
}

// Setup event listeners
document
  .getElementById("save-score-form")
  .addEventListener("submit", handleSaveScore);
document
  .getElementById("play-again-btn")
  .addEventListener("click", handlePlayAgain);
document.getElementById("reset-btn").addEventListener("click", resetGame);

// Initialize and start game immediately
initGame();
