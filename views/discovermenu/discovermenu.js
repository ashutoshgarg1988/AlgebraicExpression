/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : discovermenu.js.js
 *  Description : Handeler for Discover Menu screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initDiscoverMenu() {
  setCommonUI({
    btnHome: true,
    btnPlay: false,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Card Click Events
  document.getElementById("easyCard").addEventListener("click", () => {
    loadView("easyscreen");
  });

  document.getElementById("warmUpCard").addEventListener("click", () => {
    loadView('warmupscreen');
  });

  document.getElementById("challengeCard").addEventListener("click", () => {
    loadView('challengescreen');
  });
})();