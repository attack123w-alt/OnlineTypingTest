const paragraphs = {
basic: [
"The patient was seen in the clinic for routine follow-up. Vital signs were stable. No acute complaints were reported."
],
intermediate: [
"The patient is a sixty-two-year-old male presenting with chest discomfort radiating to the left arm. Past history includes hypertension and diabetes."
],
advanced: [
"The patient underwent laparoscopic cholecystectomy under general anesthesia without complications. Estimated blood loss was minimal and the patient was transferred to recovery in stable condition."
]
};

const audio = new Audio("dictation.mp3"); // optional local audio

const display = document.getElementById("text-display");
const input = document.getElementById("input-field");
const timerEl = document.getElementById("timer");
const mistakesEl = document.getElementById("mistake-count");
const wpmEl = document.getElementById("current-wpm");
const accuracyEl = document.getElementById("accuracy");
const leaderboardEl = document.getElementById("leaderboard");

const resetBtn = document.getElementById("reset-btn");
const playBtn = document.getElementById("play-audio");
const timeMode = document.getElementById("time-mode");
const difficultySel = document.getElementById("difficulty");

let timeLeft, timer, started, mistakes;
let text = "";

function dailyKey() {
  return "best_" + new Date().toISOString().slice(0,10);
}

function loadLeaderboard() {
  leaderboardEl.textContent = localStorage.getItem(dailyKey()) || 0;
}

function init() {
  started = false;
  mistakes = 0;
  timeLeft = parseInt(timeMode.value);
  timerEl.textContent = timeLeft + "s";
  mistakesEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  clearInterval(timer);

  const diff = difficultySel.value;
  text = paragraphs[diff][0];

  display.innerHTML = text.split("").map(c => `<span>${c}</span>`).join("");
  input.value = "";
  input.disabled = false;
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

  spans.forEach((span, i) => {
    if (!typed[i]) span.className = "";
    else if (typed[i] === span.textContent) {
      span.className = "correct";
      correct++;
    } else {
      span.className = "incorrect";
    }
  });

  mistakes = typed.length - correct;
  mistakesEl.textContent = mistakes;

  const elapsed = (parseInt(timeMode.value) - timeLeft) / 60;
  if (elapsed > 0) {
    const wpm = Math.round((correct / 5) / elapsed);
    wpmEl.textContent = wpm;
    const acc = Math.max(0, Math.round((correct / typed.length) * 100));
    accuracyEl.textContent = acc + "%";

    gtag("event", "typing_progress", {
      wpm: wpm,
      accuracy: acc
    });
  }
});

function endTest() {
  clearInterval(timer);
  input.disabled = true;

  const finalWpm = parseInt(wpmEl.textContent);
  const best = Math.max(finalWpm, localStorage.getItem(dailyKey()) || 0);
  localStorage.setItem(dailyKey(), best);
  leaderboardEl.textContent = best;

  gtag("event", "typing_complete", {
    wpm: finalWpm,
    mistakes: mistakes
  });
}

playBtn.addEventListener("click", () => {
  audio.currentTime = 0;
  audio.play();
});

resetBtn.addEventListener("click", init);

loadLeaderboard();
init();
