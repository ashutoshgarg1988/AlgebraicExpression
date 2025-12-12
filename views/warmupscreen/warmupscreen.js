/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
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

  const eqs = generateRandomEquations();
  document.getElementById("equation1").textContent = eqs[0];
  document.getElementById("equation2").textContent = eqs[1];
  document.getElementById("equation3").textContent = eqs[2];

  // Show info popup when screen loads
  // showPopup("info", { text: "Use the tiles at bottom to build an angle that matches the target angle" });

  warmupNextBtn.addEventListener("click", () => {
    loadView("challengescreen");
  });

  // CLEAR BUTTON
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    workspace.innerHTML = "";
    group = null;
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
            dragged.style.cursor = "default";

            // reset workspace to empty
            workspace.innerHTML = "";
            group = null;
        }
    });
});


  // -----------------------------
  // BASIC DRAG AND DROP ENGINE
  // -----------------------------

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


})();