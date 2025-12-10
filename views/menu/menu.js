/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : menu.js
 *  Description : Handeler functionality for Menu screen
 *  Date        : 4-Dec-2025
 ***************************************************************/

(function initMenu() {
  // Show / hide common UI for this view
  setCommonUI({
    btnHome: false,
    btnPlay: false,
    btnBook: false,
    musicBtn: true,
    copyright: true
  });

  // Add event listeners
  document.getElementById("intro-card")?.addEventListener("click", () => {
    loadView("introscreen");
  });

  document.getElementById("discover-card")?.addEventListener("click", () => {
    loadView("discovermenu");
  });

  document.getElementById("diy-card")?.addEventListener("click", () => {
    loadView("doitscreen");
  });
})();