/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : popup.js
 *  Description : Handeler and functionality for popup
 *  Date        : 4-Dec-2025
 ***************************************************************/

// ========== POPUP TEMPLATES ==========
const popupTemplates = {
  
  info: (text) => `
    <div class="popup-overlay">
      <div class="info-popup">
        <div class="info-text">${text}</div>
      </div>
      <button class="info-btn" onclick="hidePopup()">Continue</button>
    </div>
  `,

  /*<div class="title">GREAT<br>WORK</div>
  <div class="content">
    <p>You’ve completed</p>
    <h1>Step ${step}!</h1>
    <p>${description}</p>
  </div>*/
  greatWork: (step, description) => `
    <div class="popup-overlay">
      <div class="greatwork-popup">
        <div class="gw-btn-row">
          <img src="assets/images/common/icon-play.svg" class="btn gw-btn play" onclick="goToGame()">
          <img src="assets/images/common/reset.svg" class="btn gw-btn reset" onclick="restartStep()">
          <img src="assets/images/common/next.svg" class="btn gw-btn next" onclick="goNextStep()">
        </div>

      </div>
    </div>
  `,
};

// ========== SHOW POPUP ==========
function showPopup(type, data = {}) {
  const layer = document.getElementById("popup-layer");
  if (!popupTemplates[type]) {
    console.error(`Popup type "${type}" not found!`);
    return;
  }
  layer.innerHTML = popupTemplates[type](...Object.values(data));
}

// ========== HIDE POPUP ==========
function hidePopup() {
  document.getElementById("popup-layer").innerHTML = "";
}

// button callbacks here:
function goToGame() {
  console.log("Navigate to game...");
}

function restartStep() {
  hidePopup();
}

function goNextStep() {
  console.log("Go to next step...");
}