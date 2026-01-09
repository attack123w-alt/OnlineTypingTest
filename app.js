const medicalParagraphs = [
  `The patient is a sixty-two-year-old male who presented to the emergency department with complaints of acute substernal chest pain radiating to the left arm and jaw. The pain began approximately one hour prior to arrival and was associated with diaphoresis, nausea, and shortness of breath. Past medical history is significant for hypertension, hyperlipidemia, and type two diabetes mellitus. An electrocardiogram demonstrated ST-segment elevation in the anterior leads, consistent with an acute myocardial infarction. Initial troponin levels were elevated. The patient was administered aspirin, nitroglycerin, and intravenous heparin. Cardiology was consulted, and the patient was taken emergently to the cardiac catheterization laboratory for percutaneous coronary intervention. Post-procedure, the patient was admitted to the coronary care unit for continuous monitoring, serial cardiac enzymes, and initiation of guideline-directed medical therapy.`,

  `Physical examination revealed a well-developed, well-nourished female in no acute distress. Vital signs were stable, with blood pressure within normal limits and oxygen saturation of ninety-eight percent on room air. The abdomen was soft, non-tender, and non-distended with positive bowel sounds in all quadrants. No hepatosplenomegaly or palpable masses were appreciated. Laboratory studies demonstrated leukocytosis with a white blood cell count of twelve thousand per microliter. Hemoglobin and hematocrit were within normal limits. A urinalysis was negative for infection. The assessment was acute viral gastroenteritis. The patient was advised to maintain hydration, follow a bland diet, and return to the clinic if symptoms worsened or failed to improve within forty-eight hours.`,

  `Postoperative diagnosis was chronic cholecystitis with cholelithiasis. The patient underwent a laparoscopic cholecystectomy under general anesthesia without complications. The patient was placed in the supine position, and pneumoperitoneum was established using a Veress needle. Trocar placement was achieved under direct visualization. The gallbladder was identified, dissected from the liver bed, and removed intact. Hemostasis was achieved, and no bile leak was observed. Estimated blood loss was minimal. The patient tolerated the procedure well and was transferred to the recovery room in stable condition. Discharge instructions included pain management, activity restrictions, wound care, and follow-up with the surgeon in two weeks.`,

  `Neurological examination revealed mild left-sided hemiparesis with decreased strength in the upper and lower extremities. Cranial nerves were grossly intact, and speech was mildly dysarthric. A non-contrast CT scan of the head demonstrated a small area of hypodensity in the right parietal lobe, consistent with an acute ischemic cerebrovascular accident. The patient was admitted to the stroke unit for further management. Aspirin therapy was initiated, and blood pressure was carefully controlled. Physical therapy, occupational therapy, and speech therapy evaluations were ordered. The patient and family were counseled extensively regarding stroke risk factors, medication compliance, and the importance of follow-up care.`,

  `The patient is a forty-five-year-old female presenting with worsening shortness of breath, wheezing, and productive cough for three days. Past medical history is significant for asthma and seasonal allergies. On examination, bilateral expiratory wheezes were noted with decreased air movement at the lung bases. Chest X-ray showed no acute infiltrates. The patient was treated with nebulized albuterol and ipratropium bromide, as well as intravenous corticosteroids. Symptoms improved after treatment. The assessment was acute asthma exacerbation. The patient was discharged home with a prednisone taper, rescue inhaler, and instructions to follow up with her primary care provider.`,

  `Discharge summary: The patient was admitted for uncontrolled hypertension and dizziness. During hospitalization, antihypertensive medications were adjusted, resulting in improved blood pressure control. Laboratory studies, including a basic metabolic panel and complete blood count, were within normal limits. The patient denied chest pain, shortness of breath, or visual changes at the time of discharge. He was counseled on medication adherence, dietary sodium restriction, and regular blood pressure monitoring at home. Follow-up with the primary care physician was scheduled for one week. The patient was discharged in stable condition with no activity restrictions.`
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
  let text = medicalParagraphs[Math.floor(Math.random() * medicalParagraphs.length)];
  text = text.replace(/\uFEFF/g, "");

  display.innerHTML = text
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("");

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
    if (!typed[i]) {
      span.className = "";
    } else if (typed[i] === span.textContent) {
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
