//This codebase was generated using AI assistance, then manually reviewed, 
//debugged, and audited line-by-line for optimization, and exact layout alignment


let loginRecords = [
  { user: "Akshit", device: "known", location: "India", usualLocation: "India", hour: 21, failedAttempts: 0, isVPN: false },
  { user: "Hrishit", device: "known", location: "India", usualLocation: "India", hour: 9, failedAttempts: 0, isVPN: false }
];


/*
  THE RISK-SCORING
  
  Point values:
     new device                -> +30
     login country != usual    -> +40
     odd hour                  -> +15
     failed attempts           -> +10 per attempt (capped)
     VPN / proxy               -> +10


    --login is loginRecords[i]
*/

function calculateRiskScore(login) {
  let score = 0;

  if (login.device === "new") {
    score = score + 30;
  }

  if (login.location !== login.usualLocation) {
    score = score + 40;
  }

  if (login.hour >= 0 && login.hour <= 5) {
    score = score + 15;
  }

  // cap failed-attempt points at 30 so one number doesn't break the scale
  let failedPoints = login.failedAttempts * 10;
  if (failedPoints > 30) {
    failedPoints = 30;
  }
  score = score + failedPoints;

  if (login.isVPN) {
    score = score + 10;
  }

  // score could theoretically go above 100, so clamping it 
  if (score > 100) {
    score = 100;
  }

  return score;
}


/*Score into Risk Level*/

function getRiskLevel(score) {
  if (score >= 60) {
    return "red";
  } else if (score >= 30) {
    return "yellow";
  } else {
    return "green";
  }
}


/*EXPLANATION LAYER*/

function generateExplanation(login, score, level) {
  let reasons = [];

  if (login.device === "new") {
    reasons.push("an unrecognised device");
  }
  if (login.location !== login.usualLocation) {
    reasons.push("a login from " + login.location + " instead of the usual " + login.usualLocation);
  }
  if (login.hour >= 0 && login.hour <= 5) {
    reasons.push("an unusual login time (" + login.hour + ":00)");
  }
  if (login.failedAttempts > 0) {
    reasons.push(login.failedAttempts + " failed attempt(s) in the last hour");
  }
  if (login.isVPN) {
    reasons.push("use of a VPN/proxy");
  }
  if (reasons.length === 0) {
    return "This login matches the user's normal pattern - no anomalies detected.";
  }
  let reasonText = reasons.join(", ");
  /*joining*/
  if (level === "red") {
    return "Flagged HIGH RISK because of " + reasonText + ".";
  } else if (level === "yellow") {
    return "Flagged for review because of " + reasonText + ".";
  } else {
    return "Minor deviation (" + reasonText + ") but overall risk remains low.";
  }
}


/*RENDER THE TABLE*/

function renderTable() {
  let tbody = document.getElementById("loginTableBody");
  tbody.innerHTML = ""; // clear out old rows before redrawing

  for (let i = 0; i < loginRecords.length; i++) {
    let login = loginRecords[i];

    let score = calculateRiskScore(login);
    let level = getRiskLevel(score);
    let explanation = generateExplanation(login, score, level);

    // build a table row element
    let row = document.createElement("tr");
    row.className = "risk-" + level; // applies the colour-coding CSS class

    row.innerHTML =
      "<td>" + login.user + "</td>" +
      "<td>" + login.device + "</td>" +
      "<td>" + login.location + "</td>" +
      "<td>" + login.hour + ":00</td>" +
      "<td>" + login.failedAttempts + "</td>" +
      "<td>" + score + " / 100</td>" +
      "<td><span class='badge badge-" + level + "'>" + level.toUpperCase() + "</span></td>" +
      "<td class='explanation'>" + explanation + "</td>";

    tbody.appendChild(row);
  }
}


/*ADD LOGIN FORM*/

document.getElementById("addLoginBtn").addEventListener("click", function () {

  // .value reads text/number inputs, .checked reads checkboxes
  let newLogin = {
    user: document.getElementById("userName").value || "Unknown User",
    device: document.getElementById("device").value,
    location: document.getElementById("location").value || "Unknown",
    usualLocation: document.getElementById("usualLocation").value || "Unknown",
    hour: parseInt(document.getElementById("loginHour").value, 10),
    failedAttempts: parseInt(document.getElementById("failedAttempts").value, 10),
    isVPN: document.getElementById("isVPN").checked,
  };

  // parseInt can return NaN if the box was left empty so
  if (isNaN(newLogin.hour)) {
    newLogin.hour = 12; // default to a neutral, non-suspicious hour
  }
  if (isNaN(newLogin.failedAttempts)) {
    newLogin.failedAttempts = 0;
  }

  loginRecords.push(newLogin);

  renderTable();

  //clear the form fields after adding
  document.getElementById("userName").value = "";
  document.getElementById("location").value = "";
  document.getElementById("usualLocation").value = "";
  document.getElementById("loginHour").value = "";
  document.getElementById("failedAttempts").value = "";
  document.getElementById("isVPN").checked = false;
});

/*RUN*/

renderTable();