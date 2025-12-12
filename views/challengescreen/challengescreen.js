/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Challenge screen
 *  Date        : 12-Dec-2025
 ***************************************************************/

(function initChallengeScreen() {
  const challengeResetBtn = document.getElementById("challengeResetBtn");
  const challengeNextBtn = document.getElementById("challengeNextBtn");
  let equationTxt = document.getElementById("equationTxt");
  // Select sliders
  const sliderX = document.querySelector(".slider-x");
  const sliderY = document.querySelector(".slider-y");
  const sliderZ = document.querySelector(".slider-z");
  // Select labels
  const labelX = sliderX.nextElementSibling;
  const labelY = sliderY.nextElementSibling;
  const labelZ = sliderZ.nextElementSibling;

  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Show info popup when screen loads
  // showPopup("info", { text: "Stop the moving arm as close as you can to the target angle." });

  challengeResetBtn.addEventListener("click", () => {

  });

  challengeNextBtn.addEventListener("click", () => {
    loadView("menu");
  });

  // Update X slider value
  sliderX.addEventListener("input", () => {
    labelX.textContent = `${sliderX.value}x`;
    updateEquation();
  });

  // Update Y slider value
  sliderY.addEventListener("input", () => {
    labelY.textContent = `${sliderY.value}`;
    updateEquation();
  });

  // Update Y slider value
  sliderZ.addEventListener("input", () => {
    labelZ.textContent = `${sliderZ.value}`;
    updateEquation();
  });

  function updateEquation() {
    equationTxt.innerText = `${sliderX.value}x + ${sliderY.value} = ${sliderZ.value}`;
  }
})();