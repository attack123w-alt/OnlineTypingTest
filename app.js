const medicalParagraphs = [
  "The patient is a sixty-two-year-old male presenting with acute onset of substernal chest pain radiating to the left arm. An electrocardiogram revealed ST-segment elevation in the anterior leads, suggestive of an acute myocardial infarction.",
  "Physical examination showed a well-developed female in no apparent distress. The abdomen was soft and non-tender with no organomegaly or masses noted. Laboratory results indicate a white blood cell count of twelve thousand per microliter.",
  "Post-operative Diagnosis: Chronic cholecystitis with cholelithiasis. Procedure: Laparoscopic cholecystectomy. The patient was placed in the supine position and general anesthesia was induced without complications.",
  "Respiratory assessment showed bilateral wheezing and decreased breath sounds in the lower lobes. The patient was started on a nebulizer treatment of albuterol and ipratropium bromide to manage the acute exacerbation of asthma.",
  "Neurological findings were significant for a mild left-sided hemiparesis. A CT scan of the head showed a small area of hypodensity in the right parietal lobe, consistent with a recent ischemic cerebrovascular accident.",
  "The patient was prescribed five milligrams of amlodipine daily for hypertension and twenty milligrams of atorvastatin for hypercholesterolemia. Follow-up is scheduled in two weeks for a metabolic panel and blood pressure check."
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
  // Pick a random paragraph
  let text = medicalParagraphs[Math.floor(Math.random() * medicalParagraphs.length)];
  // Remove invisible characters
  text = text.replace(/\uFEFF/g, "");

  // Display each character in a <span>
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

  input.scrollIntoView({behavior: "smooth"});
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
