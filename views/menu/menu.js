/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : menu.js
 *  Description : Handeler functionality for Menu screen
 *  Date        : 10-Dec-2025
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
    SoundManager.play("click");
    loadView("introscreen");
  });

  document.getElementById("discover-card")?.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("discovermenu");
  });

  document.getElementById("diy-card")?.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("doitscreen");
  });
})();