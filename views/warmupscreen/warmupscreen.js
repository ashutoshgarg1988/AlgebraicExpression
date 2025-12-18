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
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  let correctCounter = 0;
  let eqs = []; 
  let muted = false;
  const soundBtn = document.getElementById("soundBtn");

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
  genrateRandomEq();

  // Show info popup when screen loads
  // showPopup("info", { text: "Use the tiles at bottom to build an angle that matches the target angle" });

  warmupNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("challengescreen");
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
    genrateRandomEq();
  });

  // Function to genrate 3 random equations to show in right panel
  function generateRandomEquations() {
    const variables = ["x", "y"];
    function randomCoeff() {
      return Math.floor(Math.random() * 10) + 1; // 1–10
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
    const token = document.createElement("div");
    token.classList.add("workspace-block");
    token.textContent = dragged.dataset.value;
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
      if(correctCounter === 3) {
        showPopup("greatWork", { step: 1, description: "" });
      }
    } else {
      slot.style.border = "3px solid #e74c3c"; // red
    }
  }

  // Convert blocks to algebraic string
  function groupToExpression(groupElem) {
    // collect raw token texts in order
    const raw = [...groupElem.querySelectorAll(".workspace-block")].map(b => b.textContent.trim());
    const parts = [];
    let i = 0;
    while (i < raw.length) {
      const t = raw[i];
      // If token is a variable (x or y)
      if (t === "x" || t === "y") {
        // If previous part is a plain integer (possibly signed), merge them
        if (parts.length > 0 && /^[+-]?\d+$/.test(parts[parts.length - 1])) {
          const coeff = parts.pop();            // e.g. "7" or "-3"
          parts.push(coeff + t);                // "7x" or "-3y"
        } else {
          // no explicit coefficient → assume 1
          parts.push("1" + t);                  // change to "x" if you prefer
        }
        i++;
        continue;
      }
      // If token looks like a signed/unsigned integer (coefficient or constant)
      if (/^[+-]?\d+$/.test(t)) {
        // push as-is (may later be merged with variable)
        parts.push(t);
        i++;
        continue;
      }
      // Fallback: push whatever it is (handles unexpected tokens)
      parts.push(t);
      i++;
    }

    // Build final expression string with explicit + between positive terms
    if (parts.length === 0) return "";
    let expr = parts[0];
    for (let j = 1; j < parts.length; j++) {
      const p = parts[j];
      if (p.startsWith("-")) {
        expr += p;             // negative term: append directly e.g. "-6y"
      } else {
        expr += "+" + p;       // positive term: add plus
      }
    }
    // clean small things (optional)
    expr = expr.replace(/\+\-/g, "-").replace(/\-\-/g, "+");
    return expr;
  }
})();