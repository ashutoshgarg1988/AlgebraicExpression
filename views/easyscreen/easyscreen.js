/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 11-Dec-2025
 ***************************************************************/

(function initEasyScreen() {
  SoundManager.playSceneBg("easy");
  let totalTxt = document.getElementById('totalTxt');
  let expressionTxt = document.getElementById('expressionTxt');
  let allElemsOnCenterStage;
  // Select sliders
  const sliderX = document.querySelector(".slider-x");
  const sliderY = document.querySelector(".slider-y");
  // Select labels
  const labelX = sliderX.nextElementSibling;
  const labelY = sliderY.nextElementSibling;
  const workPanel = document.getElementById("workPanel");
  // Drag and drop functionality
  let draggedData = null;
  let currentMergeTarget = null;
  let muted = false;

  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: false,
    musicBtn: true,
    copyright: true
  });

  // Show info popup when screen loads
  // showPopup("info", { text: "Drag the angle arm to build an angle" });

  // Next button click functionality
  easyNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("warmupscreen");
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

  document.getElementById("easyResetBtn").addEventListener("click", ()=> {
    SoundManager.play("click");
    sliderX.value = 1;
    labelX.textContent = `x = ${sliderX.value}`;
    sliderY.value = 1;
    labelY.textContent = `y = ${sliderY.value}`;
    totalTxt.innerText = "0";
    resetCenterPanel();
  });

  // Update X slider value
  sliderX.addEventListener("input", () => {
    labelX.textContent = `x = ${sliderX.value}`;
    getTotalValue();
  });

  // Update Y slider value
  sliderY.addEventListener("input", () => {
    labelY.textContent = `y = ${sliderY.value}`;
    getTotalValue();
  });

  // Clear button click functionality
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    SoundManager.play("click");
    resetCenterPanel();
  });

  function resetCenterPanel() {
    workPanel.innerHTML = "";
    totalTxt.innerText = 0;
    expressionTxt.innerText = "-";
    group = null;
    updateCoefficientBadges();
  }

  // Make toolbox items draggable
  document.querySelectorAll(".drag-src").forEach(src => {
    src.setAttribute("draggable", "true");
    src.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "dragging"); // required for Chrome
      draggedData = {
        type: src.dataset.type,
        symbol: src.dataset.symbol || "",
        value: Number(src.dataset.value),
        html: src.innerHTML
      };
    });
  });

  workPanel.addEventListener("dragover", e => {
    e.preventDefault();
    // Clear previous highlight
    if (currentMergeTarget) {
      currentMergeTarget.classList.remove("merge-highlight");
      currentMergeTarget = null;
    }
    if (!draggedData) {
      workPanel.style.cursor = "default";
      return;
    }
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (
      target &&
      target.classList.contains("work-item") &&
      target.dataset.type === draggedData.type &&
      target.dataset.symbol === (draggedData.symbol || "")
    ) {
      currentMergeTarget = target;
      target.classList.add("merge-highlight");
      workPanel.style.cursor = "copy";
    } else {
      workPanel.style.cursor = "default";
    }
  });

  // helper to find existing item on center panel
  function findExistingWorkItem(item) {
    return [...workPanel.querySelectorAll(".work-item")].find(el =>
      el.dataset.type === item.type &&
      el.dataset.symbol === (item.symbol || "") &&
      Number(el.dataset.baseValue) === Number(item.value)
    );
  }

  // Merge logic (count-based, correct)
  function mergeExistingItem(existing, draggedData) {
    const count = Number(existing.dataset.count) + 1;
    existing.dataset.count = count;
    existing.dataset.value = count * existing.dataset.baseValue;
    // Update text ONLY for text-based items
    if (
      existing.dataset.type === "var" ||
      existing.dataset.type === "num"
    ) {
      if (existing.dataset.symbol === "x" || existing.dataset.symbol === "y") {
        existing.textContent = `${count}${existing.dataset.symbol}`;
      } else if(existing.dataset.symbol === "-1") {
        existing.textContent = `-${count}`;
      } else {
        existing.textContent = `${count}`;
      }
    }
    // Coins & weights untouched visually
    updateCoefficientBadges();
  }



  // Function to get total text value on right side panel
  function getTotalValue() {
    let totalVal = 0;
    let xCount = 0;
    let yCount = 0;
    let constantCount = 0;

    for (let i = 0; i < allElemsOnCenterStage.length; i++) {
      const el = allElemsOnCenterStage[i];
      if (el.symbol === 'x') {
        totalVal += el.value * sliderX.value;
        xCount += el.value;
      } else if (el.symbol === 'y') {
        totalVal += el.value * sliderY.value;
        yCount += el.value;
      } else if (
        el.symbol === '1' ||
        el.symbol === '-1' ||
        el.symbol === 'B' ||
        el.symbol === 'S' ||
        el.symbol === 'G' ||
        el.symbol === '2W' ||
        el.symbol === '5W' ||
        el.symbol === '10W'
      ) {
        totalVal += el.value;
        constantCount += el.value;
      } else {

      }

    }

    // Build equation text cleanly
    const parts = [];
    if (xCount !== 0) parts.push(`${xCount}x`);
    if (yCount !== 0) parts.push(`${yCount}y`);
    if (constantCount !== 0) parts.push(`${constantCount}`);
    const equationTxt = parts.join(' + ');
    totalTxt.innerText = totalVal;
    expressionTxt.innerText = `${equationTxt} = ${totalVal}`;
  }

  //Log everything currently on stage
  function logAllWorkItems() {
    const items = [...document.querySelectorAll("#workPanel .work-item")];
    allElemsOnCenterStage = items.map(el => ({
      type: el.dataset.type,
      symbol: el.dataset.symbol || "",
      value: Number(el.dataset.value),
      text: el.innerText.trim(),
      x: parseInt(el.style.left),
      y: parseInt(el.style.top)
    }));
    getTotalValue();
    return allElemsOnCenterStage;
  }

  // Handle drop
  workPanel.addEventListener("drop", e => {
    e.preventDefault();
    if (!draggedData) return;
    const existing = findExistingWorkItem(draggedData);
    // MERGE if already exists
    if (existing) {
      mergeExistingItem(existing, draggedData);
    }
    // ➕ Otherwise create new
    else {
      createWorkItem(draggedData, e.offsetX, e.offsetY, e);
    }
    updateCoefficientBadges();
    logAllWorkItems();
  });


  // Create the dropped object
  function createWorkItem(item) {
    const original = document.querySelector(
      `.drag-src[data-type="${item.type}"][data-symbol="${item.symbol || ""}"][data-value="${item.value}"]`
    );
    // Clone the original element EXACTLY
    const el = original.cloneNode(true);
    el.classList.add("work-item");
    // Remove drag-only behavior
    el.removeAttribute("draggable");
    el.style.cursor = "default";
    // Data for logic
    el.dataset.type = item.type;
    el.dataset.symbol = item.symbol || "";
    el.dataset.baseValue = item.value;
    el.dataset.count = 1;
    el.dataset.value = item.value;
    getExpressionGroup().appendChild(el);
    updateCoefficientBadges();
  }


  const showCoeffChk = document.getElementById("showCoeffChk");
  showCoeffChk.addEventListener("change", () => {
    updateCoefficientBadges();
  });

  const showCoinValChk = document.getElementById("showCoinValChk");
  showCoinValChk.addEventListener("change", () => {
    document.querySelectorAll(".btn.coin").forEach(coin => {
      const value = coin.dataset.value;      // 5, 10, 15
      const textEl = coin.querySelector(".coin-text");
      if (showCoinValChk.checked) {
        if (textEl) {
          textEl.textContent = value;
        }
      }else {
        textEl.textContent = '₹';
      }
    });
  });

  function updateCoefficientBadges() {
    document.querySelectorAll(".work-item").forEach(el => {
      el.querySelector(".coeff-badge")?.remove();
      if (!showCoeffChk.checked) return;
      const count = Number(el.dataset.count || 1);
      const badge = document.createElement("div");
      badge.classList.add("coeff-badge");
      if (el.dataset.symbol === "x" || el.dataset.symbol === "y") {
        badge.textContent = `${count}`; //${el.dataset.symbol}
        badge.classList.add("coeff-x");
      } else {
        badge.textContent = `${count}`;
        badge.classList.add("coeff-const");
      }
      el.appendChild(badge);
    });
  }

  function getExpressionGroup() {
    let group = workPanel.querySelector(".expr-group");
    if (!group) {
      group = document.createElement("div");
      group.className = "expr-group";
      workPanel.appendChild(group);
    }
    return group;
  }



})();



// Older Code
// workPanel.addEventListener("drop", e => {
  //   e.preventDefault();
  //   if (!draggedData) return;
  //   // If merge target exists → MERGE
  //   if (currentMergeTarget) {
  //     mergeWorkItems(currentMergeTarget, draggedData);
  //     updateCoefficientBadges();
  //     currentMergeTarget.classList.remove("merge-highlight");
  //     currentMergeTarget = null;
  //     workPanel.style.cursor = "default";
  //     logAllWorkItems();
  //     return;
  //   }
  //   // Otherwise → create new item
  //   const x = e.offsetX;
  //   const y = e.offsetY;
  //   createWorkItem(draggedData, x, y, e);
  //   logAllWorkItems();
  // });


    // Allow moving inside work panel
  // function enableMoveInsideWork(el) {
  //   let offsetX = 0, offsetY = 0;
  //   el.addEventListener("mousedown", e => {
  //     offsetX = e.offsetX;
  //     offsetY = e.offsetY;
  //     function move(ev) {
  //       el.style.left = (ev.pageX - workPanel.offsetLeft - offsetX) + "px";
  //       el.style.top = (ev.pageY - workPanel.offsetTop - offsetY) + "px";
  //     }
  //     function stop() {
  //       document.removeEventListener("mousemove", move);
  //     }
  //     document.addEventListener("mousemove", move);
  //     document.addEventListener("mouseup", stop, { once: true });
  //   });
  // }

  //   function mergeWorkItems(existing, draggedData) {
  //   const existingCount = Number(existing.dataset.count || 1);
  //   const incomingCount = 1;
  //   const newCount = existingCount + incomingCount;
  //   existing.dataset.count = newCount;
  //   // Update value for calculations
  //   const baseValue = Number(draggedData.value);
  //   existing.dataset.value = newCount * baseValue;
  //   // Update visual text
  //   if (existing.dataset.symbol === 'x' || existing.dataset.symbol === 'y') {
  //     existing.innerHTML = `${newCount}${existing.dataset.symbol}`;
  //   } else {
  //     existing.innerHTML = newCount;
  //   }
  //   updateCoefficientBadges();
  // }

  // Delete by dragging back onto toolbox buttons
  // function enableDeleteByDraggingBack(el) {
  //   el.setAttribute("draggable", "true");
  //   el.addEventListener("dragstart", e => {
  //     e.dataTransfer.setData("text/plain", "dragging");
  //     draggedData = el;
  //   });
  //   document.querySelectorAll(".drag-src").forEach(src => {
  //     src.addEventListener("dragover", e => e.preventDefault());
  //     src.addEventListener("drop", () => {
  //       if (draggedData.classList.contains("work-item")) {
  //         draggedData.remove();
  //         updateCoefficientBadges();
  //       }
  //     });
  //   });
  // }