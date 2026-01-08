const medicalParagraphs = [
  "The patient is a sixty-two-year-old male presenting with acute onset of substernal chest pain radiating to the left arm.",
  "Physical examination showed a well-developed female in no apparent distress.",
  "Post-operative diagnosis was chronic cholecystitis with cholelithiasis.",
  "Respiratory assessment showed bilateral wheezing and decreased breath sounds.",
  "Neurological findings were significant for mild left-sided hemiparesis.",
  "The patient was prescribed amlodipine and atorvastatin."
];

let timeLeft = 60;
let timer;
let started = false;
let mistakes = 0;

const display = document.getElementById("text-display");
const input = document.getElementById("input-field");
const timerEl = document.getElementById("timer");
const mistakeEl = document.getElementById("mistake-count");
const wpmEl = document.getElementById("current-wpm");
const highScoreEl = document.getElementById("high-score");
const resetBtn = document.getElementById("reset-btn");

let highScore = localStorage.getItem("medscribeHigh") || 0;
highScoreEl.textContent = highScore;

function init() {
  const text = medicalParagraphs[Math.floor(Math.random() * medicalParagraphs.length)];
  display.innerHTML = text.split("").map(c => `<span>${c}</span>`).join("");
  input.value = "";
  input.disabled = false;
  started = false;
  timeLeft = 60;
  mistakes = 0;
  timerEl.textContent = "60s";
  mistakeEl.textContent = "0";
  wpmEl.textContent = "0";
  clearInterval(timer);
  input.focus();
}

input.addEventListener("input", () => {
  if (!started) {
    started = true;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft + "s";
      if (timeLeft <= 0) endTest();
    }, 1000);
  }

  const spans = display.querySelectorAll("span");
  const typed = input.value.split("");
  let correct = 0;
  let errors = 0;

  spans.forEach((span, i) => {
    if (!typed[i]) span.className = "";
    else if (typed[i] === span.textContent) {
      span.className = "correct";
      correct++;
    } else {
      span.className = "incorrect";
      errors++;
    }
  });

  mistakes = errors;
  mistakeEl.textContent = mistakes;

  const elapsed = 60 - timeLeft;
  if (elapsed > 0) {
    wpmEl.textContent = Math.round((correct / 5) / (elapsed / 60));
  }

  if (typed.length >= spans.length) endTest();
});

function endTest() {
  clearInterval(timer);
  input.disabled = true;
  const finalWpm = parseInt(wpmEl.textContent, 10);
  if (finalWpm > highScore) {
    highScore = finalWpm;
    localStorage.setItem("medscribeHigh", highScore);
    highScoreEl.textContent = highScore;
  }
}

resetBtn.addEventListener("click", init);
init();
