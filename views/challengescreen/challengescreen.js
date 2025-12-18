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
  updateEquation();

  SoundManager.playSceneBg("challange");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: false,
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
    // updateEquation();
    updateScaleTilt();
  });

  // Update Y slider value
  sliderY.addEventListener("input", () => {
    labelY.textContent = `${sliderY.value}`;
    // updateEquation();
    updateScaleTilt();
  });

  // Update Y slider value
  sliderZ.addEventListener("input", () => {
    labelZ.textContent = `${sliderZ.value}`;
    // updateEquation();
    updateScaleTilt();
  });

  xValueInput.addEventListener("input", () => {
    updateScaleTilt();
  });

  function updateEquation() {
    // equationTxt.innerText = `${sliderX.value}x + ${sliderY.value} = ${sliderZ.value}`;
    let equationData = generateBalancedEquation();
    equationTxt.innerText = equationData.equation;
    sliderX.value = 0; //equationData.a;
    labelX.textContent = `${sliderX.value}x`;
    sliderY.value = 0; //equationData.b;
    labelY.textContent = `${sliderY.value}`;
    sliderZ.value = 0; //equationData.rhs;
    labelZ.textContent = `${sliderZ.value}`;
    xValueInput.value = "";
    equalCheck.innerText = "≠";

  }

  function generateBalancedEquation() {
    const x = getRandomInt(0, 10);      // solution for x
    const a = getRandomInt(1, 10);      // coefficient of x (avoid 0)
    const b = getRandomInt(0, 10);      // constant
    const rhs = a * x + b;
    // Ensure RHS is within allowed range
    if (rhs < 1 || rhs > 110) {
      return generateBalancedEquation(); // retry
    }
    return {
      equation: `${a}x + ${b} = ${rhs}`,
      a,
      b,
      rhs,
      x
    };
  }

  // Helper
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    const leftTray = document.getElementById("leftWeight");
    const rightTray = document.getElementById("rightWeight");
    const xBalls = leftTray.querySelector(".x-balls");
    const yBalls = leftTray.querySelector(".y-balls");
    const zBalls = rightTray.querySelector(".z-balls");
    const xVal = Number(xValueInput.value || 0);
    const A = Number(sliderX.value);
    const B = Number(sliderY.value);
    const Z = Number(sliderZ.value);
    const xCount = A * xVal;
    const yCount = B;
    const leftWeight = xCount + yCount;
    const rightWeight = Z;
    renderBalls(xBalls, xCount, "x");
    renderBalls(yBalls, yCount, "y");
    renderBalls(zBalls, rightWeight, "z");
    equalCheck.innerText = leftWeight === rightWeight ? "=" : "≠";
    const diff = leftWeight - rightWeight;
    const maxAngle = 18;
    const angle = Math.max(-maxAngle, Math.min(maxAngle, diff * 2));
    arm.style.transform = `rotate(${-angle}deg)`;
    const baseTop = 39;
    const radius = 35;
    const rad = angle * Math.PI / 180;
    const shift = Math.sin(rad) * radius;
    leftTray.style.top = `${baseTop + shift}%`;
    rightTray.style.top = `${baseTop - shift}%`;
  }


  function renderBalls(container, count, type) {
    if (!container) return;
    const current = container.children.length;
    // ADD
    for (let i = current; i < count; i++) {
      const ball = document.createElement("div");
      ball.className = `ball ${type}`;
      container.appendChild(ball);
      requestAnimationFrame(() => {
        ball.classList.add("show");
      });
    }
    // REMOVE
    for (let i = current - 1; i >= count; i--) {
      const ball = container.children[i];
      ball.classList.remove("show");
      setTimeout(() => ball.remove(), 250);
    }
  }
})();