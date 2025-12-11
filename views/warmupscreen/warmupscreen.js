/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : warmupscreen.js
 *  Description : Handeler and functionality for warm up screen
 *  Date        : 4-Dec-2025
 ***************************************************************/

(function initWarmupScreen() {
  // let warmupResetBtn = document.getElementById("warmupResetBtn");
  // let warmupNextBtn = document.getElementById("warmupNextBtn");
  // let targetAngleTxt = document.getElementById("targetAngle");
  // let currentAngleTxt = document.getElementById("currentAngle");
  // let checkBtn = document.getElementById("checkBtn");

  // const canvas = document.getElementById("angleCanvas");
  // const ctx = canvas.getContext("2d");
  // let currentAngle = 0;
  // let targetAngle = null;
  // const center = { x: canvas.width / 2, y: canvas.height / 2 };
  // const radius = 230;

  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Show info popup when screen loads
  showPopup("info", { text: "Use the tiles at bottom to build an angle that matches the target angle" });

  warmupNextBtn.addEventListener("click", () => {
    loadView("challengescreen");
  });

  checkBtn.addEventListener("click", () => {
    if (targetAngle === currentAngle) {
      showPopup("greatWork", { step: 1, description: "Let's compare two shapes next." });
    } else {
      alert("fail");
    }
  });
})();