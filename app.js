"use strict";

/* ===============================
   LONG MEDICAL TRANSCRIPTION DATA
   (120–180+ words each)
================================ */

const medicalReports = [
`The patient is a sixty five year old male who presented to the emergency department with complaints of progressive shortness of breath, chest tightness, and intermittent dizziness over the past three days. Past medical history is significant for hypertension, type two diabetes mellitus, hyperlipidemia, and a previous myocardial infarction five years ago. On arrival, vital signs revealed a blood pressure of one hundred sixty over ninety two, heart rate of one hundred ten beats per minute, respiratory rate of twenty two, and oxygen saturation of ninety one percent on room air. Physical examination demonstrated bilateral crackles at the lung bases with mild lower extremity edema. Laboratory evaluation showed elevated troponin levels, mild leukocytosis, and an elevated B type natriuretic peptide. Chest radiograph revealed pulmonary vascular congestion. The patient was admitted to the cardiac telemetry unit for further management and initiated on intravenous diuretics, beta blockers, and supplemental oxygen therapy.`,

`This operative report documents a laparoscopic cholecystectomy performed for chronic cholecystitis with symptomatic cholelithiasis. The patient is a forty eight year old female with a history of recurrent right upper quadrant abdominal pain associated with nausea and fatty food intolerance. Preoperative ultrasound demonstrated gallstones with gallbladder wall thickening. The patient was brought to the operating room and placed in the supine position. General anesthesia was induced without complication. After sterile preparation and draping, four trocars were inserted under direct visualization. The gallbladder was noted to be chronically inflamed with adhesions to surrounding structures. The cystic duct and cystic artery were carefully identified, clipped, and divided. The gallbladder was dissected from the liver bed using electrocautery and removed via an endoscopic retrieval bag. Hemostasis was confirmed. The patient tolerated the procedure well and was transferred to the recovery room in stable condition.`,

`The patient is a seventy two year old female who was evaluated in the neurology clinic for complaints of progressive memory impairment, difficulty with word finding, and occasional episodes of confusion over the past year. Family members report that the patient has had increasing difficulty managing medications and performing activities of daily living independently. Neurological examination revealed impaired short term memory and decreased attention span, while motor strength and sensation remained intact. A magnetic resonance imaging scan of the brain demonstrated diffuse cortical atrophy with prominent involvement of the temporal lobes. Laboratory evaluation was unremarkable for reversible causes of cognitive decline. Based on the clinical presentation and imaging findings, the patient was diagnosed with probable Alzheimer type dementia. Treatment options were discussed extensively with the patient and family. The patient was started on donepezil with plans for close outpatient follow up and cognitive support therapy.`,

`This discharge summary pertains to a fifty five year old male admitted with community acquired pneumonia. The patient presented with fever, productive cough, pleuritic chest pain, and generalized weakness for four days prior to admission. Initial laboratory studies revealed leukocytosis with a left shift, elevated inflammatory markers, and mild hypoxemia. Chest radiograph demonstrated a right lower lobe infiltrate consistent with pneumonia. Blood and sputum cultures were obtained. The patient was treated with intravenous antibiotics, bronchodilator therapy, and supplemental oxygen. Over the course of hospitalization, the patient demonstrated significant clinical improvement with resolution of fever and normalization of oxygen saturation. Repeat laboratory studies showed decreasing white blood cell count. The patient was transitioned to oral antibiotics and discharged home in stable condition with instructions to complete the prescribed antibiotic course and follow up with primary care in one week.`,

`The patient is a thirty four year old gravida two para one female who presented to labor and delivery at thirty nine weeks gestation with regular uterine contractions occurring every five minutes. Prenatal course had been uncomplicated. On admission, cervical examination revealed the cervix to be four centimeters dilated and eighty percent effaced. Fetal heart rate monitoring demonstrated a reassuring pattern. The patient progressed appropriately through labor and received epidural anesthesia for pain control. After a period of active pushing, a healthy male infant was delivered vaginally without complication. Apgar scores were eight and nine at one and five minutes respectively. The placenta was delivered intact. Estimated blood loss was within normal limits. Both mother and infant were stable and transferred to postpartum care for routine monitoring.`
];

/* ===============================
   STATE
================================ */
let timeLeft = 180;
let timer = null;
let started = false;
let mistakes = 0;
let bestWPM = localStorage.getItem("bestWPM") || 0;

/* ===============================
   ELEMENTS
================================ */
const display = document.getElementById("text-display");
const input = document.getElementById("input-field");
const timerEl = document.getElementById("timer");
const mistakeEl = document.getElementById("mistake-count");
const wpmEl = document.getElementById("current-wpm");
const accuracyEl = document.getElementById("accuracy");
const leaderboardEl = document.getElementById("leaderboard");
const resetBtn = document.getElementById("reset-btn");

/* ===============================
   INIT
================================ */
function loadReport() {
  const text = medicalReports[Math.floor(Math.random() * medicalReports.length)];
  display.innerHTML = text.split("").map(c => `<span>${c}</span>`).join("");
  input.value = "";
  mistakes = 0;
  started = false;
  clearInterval(timer);
  timerEl.textContent = timeLeft;
  mistakeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  leaderboardEl.textContent = bestWPM;
  input.disabled = false;
  input.focus();
}

/* ===============================
   TIMER
================================ */
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endTest();
  }, 1000);
}

/* ===============================
   INPUT HANDLER
================================ */
input.addEventListener("input", () => {
  if (!started) {
    startTimer();
    started = true;
  }

  const chars = display.querySelectorAll("span");
  const typed = input.value.split("");
  let correct = 0;
  mistakes = 0;

  chars.forEach((span, i) => {
    const char = typed[i];
    if (!char) {
      span.className = "";
    } else if (char === span.textContent) {
      span.className = "correct";
      correct++;
    } else {
      span.className = "incorrect";
      mistakes++;
    }
  });

  mistakeEl.textContent = mistakes;

  const elapsed = (180 - timeLeft) / 60;
  if (elapsed > 0) {
    const wpm = Math.round((correct / 5) / elapsed);
    wpmEl.textContent = wpm;
    accuracyEl.textContent = Math.max(0, Math.round((correct / (correct + mistakes)) * 100)) + "%";
  }
});

/* ===============================
   END TEST
================================ */
function endTest() {
  clearInterval(timer);
  input.disabled = true;
  const finalWPM = parseInt(wpmEl.textContent) || 0;

  if (finalWPM > bestWPM) {
    bestWPM = finalWPM;
    localStorage.setItem("bestWPM", bestWPM);
  }

  alert(`Test Completed!\nWPM: ${finalWPM}\nMistakes: ${mistakes}`);
}

/* ===============================
   RESET
================================ */
resetBtn.addEventListener("click", () => {
  timeLeft = 180;
  loadReport();
});

/* ===============================
   START
================================ */
loadReport();
