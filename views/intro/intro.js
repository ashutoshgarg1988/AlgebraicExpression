/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : intro.js
 *  Description : Handeler for Intro screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initIntro() {
  // When play button is clicked → go to quiz / next screen
  let playBtn = document.querySelector(".intro-play-btn");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  playBtn.addEventListener("click", () => {
    loadView("menu");
    if (isMobile) {
        requestFullScreen();
        enableFullscreenOnFirstTouch();
    }
  });

  setCommonUI({
    btnHome: false,
    btnPlay: false,
    btnBook: false,
    musicBtn: true,
    copyright: false
  });
})();