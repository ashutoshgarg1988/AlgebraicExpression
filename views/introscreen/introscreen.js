/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : introscreen.js
 *  Description : Handeler function for Intro screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initIntroScreen() {
  SoundManager.playBg("introduction");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  const skipBtn = document.getElementById("skipBtn");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      SoundManager.play("click");
      loadView("menu");
    });
  }
})();