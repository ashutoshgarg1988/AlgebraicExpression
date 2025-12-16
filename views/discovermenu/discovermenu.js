/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : discovermenu.js.js
 *  Description : Handeler for Discover Menu screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initDiscoverMenu() {
  SoundManager.playBg("simulation");
  setCommonUI({
    btnHome: true,
    btnPlay: false,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Card Click Events
  document.getElementById("easyCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView("easyscreen");
  });

  document.getElementById("warmUpCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView('warmupscreen');
  });

  document.getElementById("challengeCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView('challengescreen');
  });
})();