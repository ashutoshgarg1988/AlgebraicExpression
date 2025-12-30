/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : discovermenu.js.js
 *  Description : Handeler for Discover Menu screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initDiscoverMenu() {
  SoundManager.playSceneBg("simulation");
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

  const tooltips = document.querySelectorAll(".tooltip-wrapper");
  tooltips.forEach(wrapper => {
    const openIcon = wrapper.querySelector(".tooltip-icon");
    const closeIcon = wrapper.querySelector(".tooltip-close");
    openIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      tooltips.forEach(t => {
        if (t !== wrapper) t.classList.remove("active");
      });
      wrapper.classList.toggle("active");
    });
    closeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.remove("active");
    });
  });

})();