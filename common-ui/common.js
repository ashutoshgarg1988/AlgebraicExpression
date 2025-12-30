/***************************************************************
 * common.js
 ***************************************************************/

// 1) Load all sounds once (MUST be before playBg)
SoundManager.loadFromMap(SOUNDS);

// 2) UI
document.getElementById("common-ui").innerHTML = `
  <a href="https://macmillaneducation.in/" target="_blank" class="tooltip-btn">
    <img src="assets/images/common/logo.png" class="btn logo-btn" id="btnLogo" />
  </a>

  <div class="top-btns">
    <div class="tooltip-btn">
      <img src="assets/images/common/icon-home.svg" class="btn common-btn" id="btnHome" />
      <span class="tooltip-text">Home</span>
    </div>

    <div class="tooltip-btn">
      <img src="assets/images/common/icon-play.svg" class="btn common-btn" id="btnPlay" />
      <span class="tooltip-text">Play</span>
    </div>

    <div class="tooltip-btn">
      <img src="assets/images/common/icon-book.svg" class="btn common-btn" id="btnBook" />
      <span class="tooltip-text">Book</span>
    </div>
  </div>

  <div class="tooltip-btn music-Btn-div">
    <img src="assets/images/common/music-btn.svg" class="btn music-btn" id="musicBtn" />
    <span class="tooltip-text">Sound</span>
  </div>

  <img src="assets/images/common/copyright.svg" class="copyright-txt" id="copyright" />
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
