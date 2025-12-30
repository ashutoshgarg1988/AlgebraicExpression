(function initIntroScreen() {
  SoundManager.playSceneBg("introduction");

  setCommonUI({
    btnHome: true,
    btnPlay: false,
    btnBook: false,
    musicBtn: true,
    copyright: true
  });

  const soundBtn = document.getElementById("soundBtn"); 
  let introMuted = false;

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      SoundManager.play("click");
      introMuted = !introMuted;
      if (introMuted) {
        SoundManager.stop("introduction"); 
        soundBtn.src = "assets/images/common/audio-off.svg";
        soundBtn.setAttribute("title", "Unmute");
      } else {        
        SoundManager.playSceneBg("introduction"); 
        soundBtn.src = "assets/images/common/sound-btn.svg";
        soundBtn.setAttribute("title", "Mute");
      }
    });
  }

  const skipBtn = document.getElementById("skipBtn");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      SoundManager.play("click");
      SoundManager.stopAll()
      loadView("menu");
      setTimeout(() => {
        if (!SoundManager.isBgmMuted()) {
          SoundManager.playBgm("bgm");
        }
      }, 500);         
     // SoundManager.stopAll({ keepBgm: true });
    });
  }
})();
