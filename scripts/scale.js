/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : scale.js
 *  Description : Handeler for scaling of app for multiple device
 *  Date        : 4-Dec-2025
 ***************************************************************/

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
let CURRENT_SCALE = 1;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
function getViewportSize() {
    if (window.visualViewport) {
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height
        };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function scaleStage() {
    const stage = document.getElementById("stage");
    const { width: ww, height: wh } = getViewportSize();
    // --- Landscape only ---
    if (ww < wh) {
        stage.style.display = "none";
        document.body.style.background = "#000";
        return;
    }
    stage.style.display = "block";
    // --- Scaling ---
    CURRENT_SCALE = Math.min(ww / BASE_WIDTH, wh / BASE_HEIGHT);
    // --- Apply transform ---
    stage.style.transform = `scale(${CURRENT_SCALE})`;
    // --- Center stage ---
    const scaledWidth = BASE_WIDTH * CURRENT_SCALE;
    const scaledHeight = BASE_HEIGHT * CURRENT_SCALE;
    stage.style.left = (ww - scaledWidth) / 2 + "px";
    stage.style.top = (wh - scaledHeight) / 2 + "px";
}

function getStageCoords(e, element) {
    const rect = element.getBoundingClientRect();
    // Compute scale applied by CSS transform
    const scaleX = rect.width / element.width;
    const scaleY = rect.height / element.height;
    return {
        x: (e.clientX - rect.left) / scaleX,
        y: (e.clientY - rect.top) / scaleY
    };
}

// function getStageCoords1(clientX, clientY) {
//     const stage = document.getElementById("stage");
//     const rect = stage.getBoundingClientRect();
//     const scaleX = rect.width / BASE_WIDTH;
//     const scaleY = rect.height / BASE_HEIGHT;
//     const scale = Math.min(scaleX, scaleY);
//     return {
//         x: (clientX - rect.left) / scale,
//         y: (clientY - rect.top) / scale,
//         scale
//     };
// }

function requestFullScreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) { // iOS Safari
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) { // IE/old Edge
    el.msRequestFullscreen();
  }
}

// Force fullscreen on first user interaction (mobile-safe)
function enableFullscreenOnFirstTouch() {
  const handler = () => {
    requestFullScreen();
    document.removeEventListener("touchstart", handler);
    document.removeEventListener("click", handler);
  };
  document.addEventListener("touchstart", handler, { once: true });
  document.addEventListener("click", handler, { once: true });
}

if (isMobile) {
    requestFullScreen();
    enableFullscreenOnFirstTouch();
}

scaleStage();
window.addEventListener("resize", scaleStage);
window.visualViewport?.addEventListener("resize", scaleStage);
window.addEventListener("orientationchange", scaleStage);