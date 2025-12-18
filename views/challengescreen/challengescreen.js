/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Challenge screen
 *  Date        : 12-Dec-2025
 ***************************************************************/

(function initChallengeScreen() {
  const challengeResetBtn = document.getElementById("challengeResetBtn");
  const challengeNextBtn = document.getElementById("challengeNextBtn");
  const equalCheck = document.getElementById("equalCheck");
  const checkBtn = document.getElementById("checkBtn");
  const xValueInput = document.getElementById("xValue");
  let equationTxt = document.getElementById("equationTxt");
  // Select sliders
  const sliderX = document.querySelector(".slider-x");
  const sliderY = document.querySelector(".slider-y");
  const sliderZ = document.querySelector(".slider-z");
  // Select labels
  const labelX = sliderX.nextElementSibling;
  const labelY = sliderY.nextElementSibling;
  const labelZ = sliderZ.nextElementSibling;
  let leftWeight = 1;
  let rightWeight = 1;
  let muted = false;

  SoundManager.playSceneBg("challange");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  soundBtn.addEventListener("click", () => {
    SoundManager.play("click");
  
    const muted = SoundManager.toggleVoiceMute();
  
    if (muted) {
      soundBtn.src = "assets/images/common/audio-off.svg";
      soundBtn.setAttribute("title", "Unmute");
    } else {
      soundBtn.src = "assets/images/common/sound-btn.svg";
      soundBtn.setAttribute("title", "Mute");
    }
  });

  // Show info popup when screen loads
  // showPopup("info", { text: "Stop the moving arm as close as you can to the target angle." });

  challengeResetBtn.addEventListener("click", () => {
    SoundManager.play("click");
    sliderX.value = 1;
    labelX.textContent = `${sliderX.value}x`;
    sliderY.value = 1;
    labelY.textContent = `${sliderY.value}`;
    sliderZ.value = 1;
    labelZ.textContent = `${sliderZ.value}`;
    xValueInput.value = "";
    equalCheck.innerText = "=";
    updateEquation();
    updateScaleTilt();
  });

  checkBtn.addEventListener("click", () => {
    SoundManager.play("click");
    if(leftWeight === rightWeight) {
      showPopup("greatWork", { step: 1, description: "" });
    }else {
      alert("Please try again");
    }
  });

  challengeNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("menu")
    SoundManager.stopAll();
    setTimeout(() => {
      if (!SoundManager.isBgmMuted()) {
        SoundManager.playBgm("bgm");
      }
    }, 500);
 
  });

  // Update X slider value
  sliderX.addEventListener("input", () => {
    labelX.textContent = `${sliderX.value}x`;
    updateEquation();
    updateScaleTilt();
  });

  // Update Y slider value
  sliderY.addEventListener("input", () => {
    labelY.textContent = `${sliderY.value}`;
    updateEquation();
    updateScaleTilt();
  });

  // Update Y slider value
  sliderZ.addEventListener("input", () => {
    labelZ.textContent = `${sliderZ.value}`;
    updateEquation();
    updateScaleTilt();
  });

  xValueInput.addEventListener("input", () => {
    updateScaleTilt();
  });

  function updateEquation() {
    equationTxt.innerText = `${sliderX.value}x + ${sliderY.value} = ${sliderZ.value}`;
  }

  function getWeights() {
    const x = Number(xValueInput.value || 0);
    const X = Number(sliderX.value);
    const Y = Number(sliderY.value);
    const Z = Number(sliderZ.value);
    leftWeight = (X * x) + Y;  // LHS = Ax + B
    rightWeight = Z;           // RHS constant
    if(leftWeight === rightWeight) {
      equalCheck.innerText = "="
    }else {
      equalCheck.innerText = "≠"
    }
    return { leftWeight, rightWeight };
  }

  // Function to update the scale machine tilt animation
  function updateScaleTilt() {
    const arm = document.querySelector(".scale-arm");
    const leftW = document.getElementById("leftWeight");
    const rightW = document.getElementById("rightWeight");
    const { leftWeight, rightWeight } = getWeights();
    const diff = leftWeight - rightWeight;
    const maxAngle = 18;
    let angle = Math.max(-maxAngle, Math.min(maxAngle, diff * 2));
    // Rotate ONLY the arm
    arm.style.transform = `rotate(${-angle}deg)`;
    // Tray movement (they stay horizontal)
    const baseTop = 39;  // original top %
    const radius = 35;   // adjust depending on your graphics
    const rad = angle * Math.PI / 180;
    const verticalShift = Math.sin(rad) * radius;
    leftW.style.top = `${baseTop + verticalShift}%`;  // left moves same direction as sin
    rightW.style.top = `${baseTop - verticalShift}%`;  // right moves opposite
  }

})();