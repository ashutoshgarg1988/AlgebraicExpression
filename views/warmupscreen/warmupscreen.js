/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : warmupscreen.js
 *  Description : Handeler and functionality for warm up screen
 *  Date        : 12-Dec-2025
 ***************************************************************/

(function initWarmupScreen() {
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: false,
    musicBtn: true,
    copyright: true
  });
  let correctCounter = 0;
  let eqs = [];
  let coinEqs = [];
  let muted = false;
  let level = 0;
  const soundBtn = document.getElementById("soundBtn");
  // Coin based equation work
  const COINS = {
    B: { value: 5, img: "assets/images/warmupscreen/bronz.svg" },
    S: { value: 10, img: "assets/images/warmupscreen/silver.svg" },
    G: { value: 15, img: "assets/images/warmupscreen/gold.svg" }
  };
  genrateRandomEq();
  function handleLevelChanges() {
    if(level === 0){
      document.getElementById('xyBtns').style.display = 'block';
      document.getElementById('coinBtns').style.display = 'none';
      genrateRandomEq();
    }else {
      document.getElementById('xyBtns').style.display = 'none';
      document.getElementById('coinBtns').style.display = 'block';
      genrateRandomCoinEq();
    }
  }

  // SoundManager.playBg("warmUp");
  // soundBtn.addEventListener("click", () => {
  //   SoundManager.play("click");
  //   muted = !muted;
  //   if(muted) {
  //     SoundManager.pause('warmUp');
  //   } else {
  //     SoundManager.resume();
  //   }

  // });

  // start warmUp narration
  SoundManager.playSceneBg("warmUp");
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


  function genrateRandomEq() {
    eqs = generateRandomEquations();
    document.getElementById("equation1").textContent = eqs[0];
    document.getElementById("equation2").textContent = eqs[1];
    document.getElementById("equation3").textContent = eqs[2];
  }

  // Show info popup when screen loads
  // showPopup("info", { text: "Use the tiles at bottom to build an angle that matches the target angle" });

  warmupNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    if(level === 0) {
      level++;
      handleLevelChanges();
    }else {
      loadView("challengescreen");
    }
  });

  // CLEAR BUTTON
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    workspace.innerHTML = "";
    group = null;
  });

  document.getElementById("warmupResetBtn").addEventListener("click", () => {
    SoundManager.play("click");
    workspace.innerHTML = "";
    group = null;
    // 2️⃣ Clear all equation slots
    document.querySelectorAll(".eq-slot").forEach(slot => {
      slot.innerHTML = "";
      slot.style.border = "1px solid grey";
    });

    // 3️⃣ Reset internal drag state
    dragged = null;
    group = null;
    (level === 0) ? genrateRandomEq() : genrateRandomCoinEq();
    
  });

  // Function to genrate 3 random equations to show in right panel
  function generateRandomEquations() {
    const variables = ["x", "y"];
    function randomCoeff() {
      return Math.floor(Math.random() * 9) + 1; // 1–10
    }

    function randomSign() {
      return Math.random() < 0.5 ? "+" : "-";
    }

    function generateOneEquation() {
      let parts = [];
      // always include x and y
      variables.forEach(v => {
        parts.push(`${randomCoeff()}${v}`);
      });
      // maybe add constant term
      if (Math.random() < 0.7) {  // 70% chance
        parts.push(`${randomCoeff()}`);
      }
      // join with random signs
      let eq = parts[0];
      for (let i = 1; i < parts.length; i++) {
        eq += randomSign() + parts[i];
      }
      return eq;
    }

    // create 3 equations
    return [
      generateOneEquation(),
      generateOneEquation(),
      generateOneEquation(),
    ];
  }


  // Functionality to drop the group equation to the slot
  const eqSlots = document.querySelectorAll(".eq-slot");
  eqSlots.forEach(slot => {
    slot.addEventListener("dragover", e => e.preventDefault());
    slot.addEventListener("drop", e => {
      e.preventDefault();
      if (!dragged) return;
      // Only accept the full expression-group
      if (dragged.classList.contains("expression-group")) {
        slot.innerHTML = "";          // clear the slot
        slot.appendChild(dragged);    // move group into slot
        // prevent dragging it again
        dragged.setAttribute("draggable", "false");
        // validate equation here
        validateEquation(slot, dragged);
        dragged.style.cursor = "default";
        // reset workspace to empty
        workspace.innerHTML = "";
        group = null;
      }
    });
  });


  // BASIC DRAG AND DROP ENGINE
  let dragged = null;
  let group = null;
  // make all toolbox items draggable
  document.querySelectorAll(".draggable-block").forEach(el => {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", e => {
      dragged = e.target;
    });
  });

  // MAKE EXPRESSION GROUP DRAGGABLE
  function makeGroupDraggable(group) {
    group.setAttribute("draggable", "true");

    group.addEventListener("dragstart", (e) => {
      dragged = group;
      e.dataTransfer.setData("text/plain", "expression-group");
    });
  }

  // make workspace droppable
  const workspace = document.querySelector(".workspace");
  workspace.addEventListener("dragover", e => e.preventDefault());

  workspace.addEventListener("drop", e => {
    e.preventDefault();
    if (!dragged) return;
    // If first item → create expression group
    if (!group) {
      group = document.createElement("div");
      group.classList.add("expression-group");
      workspace.innerHTML = "";
      workspace.appendChild(group);
      makeGroupDraggable(group);
    }
    // Create token
    const type = dragged.dataset.type;
    let token;
    if (type === "coin") {
      token = document.createElement("div");
      token.classList.add("workspace-block", "coin-block");
      const img = document.createElement("img");
      img.src = dragged.querySelector("img").src;
      img.classList.add("coin-img");
      token.dataset.value = dragged.dataset.value;   // 5 / 10 / 15
      token.dataset.symbol = dragged.dataset.symbol; // B / S / G
      token.appendChild(img);
    } else {
      // number / + / -
      token = document.createElement("div");
      token.classList.add("workspace-block");
      token.textContent = dragged.dataset.value;
    }
    group.appendChild(token);
  });


  function normalize(expr) {
    return expr
      .replace(/\s+/g, "")     // remove spaces
      .replace(/\+\-/g, "-")   // "+-" → "-"
      .replace(/\-\-/g, "+");  // "--" → "+"
  }

  // Compare with correct equation
  function validateEquation(slot, group) {
    const slotIndex = parseInt(slot.id.replace("slot", "")) - 1;
    const correctEq = eqs[slotIndex];
    const userEq = groupToExpression(group);
    const isCorrect = normalize(userEq) === normalize(correctEq);
    if (isCorrect) {
      slot.style.border = "3px solid #2ecc71"; // green
      correctCounter++;
      if (correctCounter === 3) {
        showPopup("greatWork", { step: 1, description: "" });
      }
    } else {
      slot.style.border = "3px solid #e74c3c"; // red
    }
  }

  function groupToExpression(groupElem) {
    // const raw = [...groupElem.querySelectorAll(".workspace-block")].map(b => b.textContent.trim());
    const raw = [...groupElem.querySelectorAll(".workspace-block")].map(b => {
      if (b.classList.contains("coin-block")) {
        return b.dataset.symbol; // B / S / G
      }
      return b.textContent.trim();
    });
    const tokens = [];
    let i = 0;
    while (i < raw.length) {
      const t = raw[i];
      // Merge number + variable → 3 + x = 3x
      if (/^\d+$/.test(t) && (raw[i + 1] === "x" || raw[i + 1] === "y")) {
        tokens.push(t + raw[i + 1]); // "3x"
        i += 2;
        continue;
      }
      // Variable alone → 1x / 1y
      if (t === "x" || t === "y") {
        tokens.push("1" + t);
        i++;
        continue;
      }
      // Operators + -
      if (t === "+" || t === "-") {
        tokens.push(t);
        i++;
        continue;
      }
      // Plain number (constant)
      if (/^\d+$/.test(t)) {
        tokens.push(t);
        i++;
        continue;
      }
      // fallback
      tokens.push(t);
      i++;
    }
    // Join without injecting extra operators
    let expr = "";
    tokens.forEach((t, idx) => {
      // avoid starting with "+"
      if (idx === 0 && t === "+") return;
      expr += t;
    });
    return expr;
  }


  // Random coin-based equation generator (DATA only)
  function generateRandomCoinEquation() {
    const terms = [];
    // 1–2 coin terms
    const coinKeys = Object.keys(COINS);
    const coinTermCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < coinTermCount; i++) {
      const coinKey = coinKeys[Math.floor(Math.random() * coinKeys.length)];
      const count = Math.floor(Math.random() * 4) + 1; // 1–4 coins
      terms.push({
        type: "coin",
        coin: coinKey,
        count
      });
    }
    // Optional constant
    if (Math.random() < 0.7) {
      terms.push({
        type: "number",
        value: Math.floor(Math.random() * 9) + 1
      });
    }
    console.log("terms:::",terms);
    return terms;
  }

  function renderCoinEquation(container, equation) {
    container.innerHTML = "";
    equation.forEach((term, index) => {
      if (index > 0) {
        const plus = document.createElement("span");
        plus.textContent = " + ";
        plus.className = "eq-plus";
        container.appendChild(plus);
      }
      if (term.type === "coin") {
        const termWrap = document.createElement("span");
        termWrap.className = "eq-coin-term";

        const count = document.createElement("span");
        count.textContent = term.count;
        count.className = "eq-count";

        const img = document.createElement("img");
        img.src = COINS[term.coin].img;
        img.className = "eq-coin-img";

        termWrap.appendChild(count);
        termWrap.appendChild(img);
        container.appendChild(termWrap);
      }

      if (term.type === "number") {
        const num = document.createElement("span");
        num.textContent = term.value;
        num.className = "eq-number";
        container.appendChild(num);
      }
    });
  }

  // Show coin based equations
  function genrateRandomCoinEq() {
    // existing text equations
    eqs = generateRandomEquations();
    // NEW: coin equations
    coinEqs = [
      generateRandomCoinEquation(),
      generateRandomCoinEquation(),
      generateRandomCoinEquation()
    ];
    console.log("coinEqs:::",coinEqs);

    renderCoinEquation(
      document.querySelector("#equation1"),
      coinEqs[0]
    );
    renderCoinEquation(
      document.querySelector("#equation2"),
      coinEqs[1]
    );
    renderCoinEquation(
      document.querySelector("#equation3"),
      coinEqs[2]
    );
  }





})();