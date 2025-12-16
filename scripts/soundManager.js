/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
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
  }
};


/* SOUND MANAGER (OBJECT-BASED CONFIG) */
const SoundManager = (function () {
    const sounds = {};          // key -> Audio
    let currentBg = null;       // currently playing background
    let muted = false;
    /* LOAD ALL SOUNDS FROM OBJECT */
    function loadFromMap(soundMap = {}) {
        Object.keys(soundMap).forEach(key => {
        if (sounds[key]) return;

        const config = soundMap[key];
        const audio = new Audio(config.src);

        audio.loop = !!config.loop;
        audio.volume = config.volume ?? 1;

        sounds[key] = audio;
        });
    }


    /* PLAY SOUND (SFX) */
    function play(key) {
        const audio = sounds[key];
        if (!audio || muted) return;
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    /* PLAY BACKGROUND MUSIC */
    function playBg(key) {
        const audio = sounds[key];
        if (!audio) return;
        if (currentBg && currentBg !== audio) {
            currentBg.pause();
            currentBg.currentTime = 0;
        }
        currentBg = audio;
        if (!muted) {
            audio.play().catch(() => { });
        }
    }

    /* PAUSE SOUND */
    function pause(key) {
        const audio = sounds[key];
        if (audio) audio.pause();
    }

    /* RESUME BACKGROUND SOUND */
    function resume() {
        if (!muted && currentBg) {
        currentBg.play().catch(() => {});
        }
    }

    /* STOP SOUND */
    function stop(key) {
        const audio = sounds[key];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    /* STOP ALL SOUNDS */
    function stopAll() {
        Object.values(sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        currentBg = null;
    }

    /* MUTE / UNMUTE */
    function mute() {
        muted = true;
        Object.values(sounds).forEach(audio => audio.pause());
    }

    function unmute() {
        muted = false;
        if (currentBg) {
            currentBg.play().catch(() => { });
        }
    }

    function toggleMute() {
        muted ? unmute() : mute();
        return muted;
    }

    function isMuted() {
        return muted;
    }

    /* CHECK IF SOUND EXISTS */
    function has(key) {
        return !!sounds[key];
    }

    return {
        loadFromMap,
        play,
        playBg,
        pause,
        resume,
        stop,
        stopAll,
        mute,
        unmute,
        toggleMute,
        isMuted,
        has
    };
})();