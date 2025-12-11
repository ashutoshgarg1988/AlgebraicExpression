/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 4-Dec-2025
 ***************************************************************/

(function initEasyScreen() {

  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Show info popup when screen loads
  // showPopup("info", { text: "Drag the angle arm to build an angle" });

  easyNextBtn.addEventListener("click", () => {
    loadView("warmupscreen");
  });

  soundBtn.addEventListener("click", () => {
    muted = !muted;
    soundBtn.src = muted ? "assets/icons/sound-off.png" : "assets/icons/sound-on.png";
  });

})();