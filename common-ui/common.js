/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : common.js
 *  Description : Common functionality
 *  Date        : 4-Dec-2025
 ***************************************************************/

document.querySelectorAll("img").forEach(img => {
  if (!img.classList.contains("draggable-img")) {
    img.addEventListener("dragstart", e => e.preventDefault());
  }
});

document.getElementById("common-ui").innerHTML = `
  <div class="logo-btn" id="btnLogo">Logo</div>
  <img src="assets/images/common/icon-home.svg" class="common-btn" id="btnHome" />
  <img src="assets/images/common/icon-play.svg" class="common-btn" id="btnPlay" />
  <img src="assets/images/common/icon-book.svg" class="common-btn" id="btnBook" />
  <img src="assets/images/common/copyright.svg" class="copyright-txt" id="copyright" />
  <img src="assets/images/common/music-btn.svg" class="music-btn" id="musicBtn" />
`;

document.getElementById("btnLogo").onclick = () => {
  loadView('intro');
};

document.getElementById("btnHome").onclick = () => {
  loadView('menu');
};

document.getElementById("btnPlay").onclick = () => {
  alert("Play clicked!");
};

document.getElementById("btnBook").onclick = () => {
  alert("Book clicked!");
};

// document.getElementById("btnReload").onclick = () => {
//   window.location.reload();
// };

// Intro screen click events
// document.querySelector(".intro-play-btn").addEventListener("click", () => {
//     loadView("menu");
// });


// Menu screen Card Click Events
// document.getElementById("intro-card").addEventListener("click", () => {
//   loadView("introscreen");
// });
// document.getElementById("discover-card").addEventListener("click", () => {
//   loadView("discovermenu");
// });
// document.getElementById("diy-card").addEventListener("click", () => {
//   // loadDIYView();
// });
