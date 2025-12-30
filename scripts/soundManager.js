/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : SoundManager.js
 *  Description : Handeler and functionality for Sounds related (Load, pause ,resume, stop)
 *  Date        : 12-Dec-2025
 ***************************************************************/

const SOUNDS = {
  challange: {
    src: "assets/sounds/challange.mp3",
    // loop: true,
    // volume: 0.4
  },
  easy: {
    src: "assets/sounds/easy.mp3"
  },
  introduction: {
    src: "assets/sounds/introduction.mp3"
  },
  simulation: {
    src: "assets/sounds/simulation.mp3"
  },
  warmUp: {
    src: "assets/sounds/warmUp.mp3"
  },
  click: {
    src: "assets/sounds/click.mp3"
  },
  easyDiscover: {
    src: "assets/sounds/easyDiscover.mp3"
  },
  warmUpDiscover: {
    src: "assets/sounds/warmUpDiscover.mp3"
  },
  challengeDiscover: {
    src: "assets/sounds/challengeDiscover.mp3"
  },
  bgm: {
    src: "assets/sounds/bgm.mp3",
    loop: true,
    volume: 0.5
  },
};



// const SoundManager = (function () {
//   const sounds = {};

//   let currentBgm = null;    
//   let currentSceneBg = null; 
//   let muted = false;
//   let bgmMuted = false;   
//   let voiceMuted = false; 
  
//   function loadFromMap(soundMap = {}) {
//     Object.keys(soundMap).forEach((key) => {
//       if (sounds[key]) return;

//       const config = soundMap[key];
//       const audio = new Audio(config.src);
//       audio.loop = !!config.loop;
//       audio.volume = config.volume ?? 1;

//       sounds[key] = audio;
//     });
//   }

//   function safePlay(audio) {
//     if (!audio || muted) return;
//     audio.play().catch(() => {});
//   }

//   function play(key) {
//     const audio = sounds[key];
//     if (!audio || muted) return;
//     audio.currentTime = 0;
//     safePlay(audio);
//   }

//   // BGM that should keep looping and NOT be replaced by scene audio
//   function playBgm(key = "bgm") {
//     const audio = sounds[key];
//     if (!audio) return;
  
//     audio.loop = true;
//     currentBgm = audio;
  
//     if (bgmMuted) return;      
//     audio.play().catch(()=>{});
//   }
  
//   //  Screen-specific background (easy/warmUp/introduction/etc.)
//   // This will NOT touch bgm.
//   function playSceneBg(key) {
//     const audio = sounds[key];
//     if (!audio) return;

//     if (currentSceneBg && currentSceneBg !== audio) {
//       currentSceneBg.pause();
//       currentSceneBg.currentTime = 0;
//     }

//     currentSceneBg = audio;
//     if (!muted) safePlay(currentSceneBg);
//   }

//   function pause(key) {
//     const audio = sounds[key];
//     if (audio) audio.pause();
//   }

//   function resume() {
//     if (muted) return;
//     if (currentBgm) safePlay(currentBgm);
//     if (currentSceneBg) safePlay(currentSceneBg);
//   }

//   function stop(key) {
//     const audio = sounds[key];
//     if (!audio) return;
//     audio.pause();
//     audio.currentTime = 0;

//     if (currentBgm === audio) currentBgm = null;
//     if (currentSceneBg === audio) currentSceneBg = null;
//   }

//   function stopSceneBg() {
//     if (!currentSceneBg) return;
//     currentSceneBg.pause();
//     currentSceneBg.currentTime = 0;
//     currentSceneBg = null;
//   }

//   function stopAll() {
//     Object.values(sounds).forEach((audio) => {
//       audio.pause();
//       audio.currentTime = 0;
//     });
//     currentBgm = null;
//     currentSceneBg = null;
//   }

//   function mute() {
//     muted = true;
//     Object.values(sounds).forEach((audio) => audio.pause());
//   }

//   function unmute() {
//     muted = false;
//     resume();
//   }

//   function toggleMute() {
//     muted ? unmute() : mute();
//     return muted;
//   }

//   function isMuted() {
//     return muted;
//   }
//   function isbgmMuted() {
//     return bgmMuted;
//   }
//   function has(key) {
//     return !!sounds[key];
//   }

//   return {
//     loadFromMap,
//     play,
//     playBgm,        // use for bgm
//     playSceneBg,    // use for easy/warmUp/introduction/etc
//     pause,
//     resume,
//     stop,
//     stopSceneBg,
//     stopAll,
//     mute,
//     unmute,
//     toggleMute,
//     isMuted,
//     has,
//     isbgmMuted
//   };
// })();




const SoundManager = (function () {
  const sounds = {};

  let currentBgm = null;
  let currentSceneBg = null;

  let bgmMuted = false;     //  only bgm
  let voiceMuted = true;   

  function loadFromMap(soundMap = {}) {
    Object.keys(soundMap).forEach((key) => {
      if (sounds[key]) return;
      const config = soundMap[key];
      const audio = new Audio(config.src);
      audio.loop = !!config.loop;
      audio.volume = config.volume ?? 1;
      sounds[key] = audio;
    });
  }

  function safePlay(audio) {
    if (!audio) return;
    audio.play().catch(() => {});
  }


  function play(key) {
    const audio = sounds[key];
    if (!audio || voiceMuted) return;
    audio.currentTime = 0;
    safePlay(audio);
  }


  function playBgm(key = "bgm") {
    const audio = sounds[key];
    if (!audio) return;

    audio.loop = true;

    // stop previous bgm if different
    if (currentBgm && currentBgm !== audio) {
      currentBgm.pause();
      currentBgm.currentTime = 0;
    }

    currentBgm = audio;

    if (bgmMuted) return;
    safePlay(currentBgm);
  }


  function playSceneBg(key) {
    const audio = sounds[key];
    if (!audio || voiceMuted) return;

    if (currentSceneBg && currentSceneBg !== audio) {
      currentSceneBg.pause();
      currentSceneBg.currentTime = 0;
    }

    currentSceneBg = audio;
    safePlay(currentSceneBg);
  }

  function stop(key) {
    const audio = sounds[key];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    if (currentBgm === audio) currentBgm = null;
    if (currentSceneBg === audio) currentSceneBg = null;
  }

  function stopSceneBg() {
    if (!currentSceneBg) return;
    currentSceneBg.pause();
    currentSceneBg.currentTime = 0;
    currentSceneBg = null;
  }

  function stopAll() {
    Object.values(sounds).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    currentBgm = null;
    currentSceneBg = null;
  }


  function muteBgm() {
    bgmMuted = true;
    if (currentBgm) currentBgm.pause();
  }
  function unmuteBgm() {
    bgmMuted = false;
    if (currentBgm) safePlay(currentBgm);
  }
  function toggleBgmMute() {
    bgmMuted ? unmuteBgm() : muteBgm();
    return bgmMuted;
  }
  function isBgmMuted() {
    return bgmMuted;
  }

  
  function muteVoice() {
    voiceMuted = true;
    if (currentSceneBg) currentSceneBg.pause();
  }
  function unmuteVoice() {
    voiceMuted = false;
    if (currentSceneBg) safePlay(currentSceneBg);
  }
  function toggleVoiceMute() {
    voiceMuted ? unmuteVoice() : muteVoice();
    return voiceMuted;
  }
  function isVoiceMuted() {
    return voiceMuted;
  }
  function has(key) {
    return !!sounds[key];
  }

  return {
    loadFromMap,
    play,
    playBgm,
    playSceneBg,
    stop,
    stopSceneBg,
    stopAll,
    has,
    muteBgm,
    unmuteBgm,
    toggleBgmMute,
    isBgmMuted,
    muteVoice,
    unmuteVoice,
    toggleVoiceMute,
    isVoiceMuted,
  };
})();
