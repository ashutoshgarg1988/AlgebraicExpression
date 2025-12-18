/***************************************************************
 * common.js
 ***************************************************************/

// 1) Load all sounds once (MUST be before playBg)
SoundManager.loadFromMap(SOUNDS);

// 2) UI
document.getElementById("common-ui").innerHTML = `
  <a href="https://macmillaneducation.in/" target="_blank">
    <img src="assets/images/common/logo.png" class="btn logo-btn" id="btnLogo" />
  </a>
  <img src="assets/images/common/icon-home.svg" class="btn common-btn" id="btnHome" />
  <img src="assets/images/common/icon-play.svg" class="btn common-btn" id="btnPlay" />
  <img src="assets/images/common/icon-book.svg" class="btn common-btn" id="btnBook" />
  <img src="assets/images/common/copyright.svg" class="copyright-txt" id="copyright" />
  <img src="assets/images/common/music-btn.svg" class="btn music-btn" id="musicBtn" />
`;

// Prevent image drag
document.querySelectorAll("img").forEach(img => {
  if (!img.classList.contains("draggable-img")) {
    img.addEventListener("dragstart", e => e.preventDefault());
  }
});

// ---- BGM toggle helpers ----
const MUSIC_ON_ICON  = "assets/images/common/music-btn.svg";
const MUSIC_OFF_ICON = "assets/images/common/music-off.png";

const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const nowBgmMuted = SoundManager.toggleBgmMute();
  musicBtn.src = nowBgmMuted ? MUSIC_OFF_ICON : MUSIC_ON_ICON;

  if (!nowBgmMuted) SoundManager.playBgm("bgm");
});

function unlockAndStartBgmOnce() {

  if (!SoundManager.isBgmMuted()) SoundManager.playBgm("bgm");

  // renderMusicIcon();

  window.removeEventListener("pointerdown", unlockAndStartBgmOnce, true);
  window.removeEventListener("keydown", unlockAndStartBgmOnce, true);
}
window.addEventListener("pointerdown", unlockAndStartBgmOnce, true);
window.addEventListener("keydown", unlockAndStartBgmOnce, true);





// ---- Your existing buttons ----
document.getElementById("btnLogo").onclick = () => {
  SoundManager.play("click");
  loadView("intro");
  SoundManager.stopAll();

  setTimeout(() => {
    if (!SoundManager.isBgmMuted()) {
      SoundManager.playBgm("bgm");
    }
  }, 500);
};

document.getElementById("btnHome").onclick = () => {

  SoundManager.play("click");
  loadView("menu");
  SoundManager.stopAll();

  setTimeout(() => {
    if (!SoundManager.isBgmMuted()) {
      SoundManager.playBgm("bgm");
    }
  }, 500);
};

document.getElementById("btnPlay").onclick = () => {
  // alert("Play clicked!");
  SoundManager.play("click");
  loadView('discovermenu')
  SoundManager.stopAll();
  setTimeout(() => {
    if (!SoundManager.isBgmMuted()) {
      SoundManager.playBgm("bgm");
    }
  }, 500);
};

document.getElementById("btnBook").onclick = () => {
  // alert("Book clicked!");
  SoundManager.play("click");
  loadView("introscreen")
  SoundManager.stopAll();
  setTimeout(() => {
    if (!SoundManager.isBgmMuted()) {
      SoundManager.playBgm("bgm");
    }
  }, 500);
};
