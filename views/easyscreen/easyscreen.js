/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 11-Dec-2025
 ***************************************************************/

(function initEasyScreen() {
  let totalTxt = document.getElementById('totalTxt');
  let expressionTxt = document.getElementById('expressionTxt');
  let allElemsOnCenterStage = [];
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
      SoundManager.playSceneBg("easy");
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
    if (modeToggle.checked) {
      renderCenterExpression();
    } else {
      renderCoinsRow();
    }
  });

  // Update X slider value
  sliderX.addEventListener("input", () => {
    labelX.textContent = `x = ${sliderX.value}`;
    getTotalValue();
    if (modeToggle.checked) {
      renderCenterExpression();
    } else {
      renderCoinsRow();
    }
  });

  // Update Y slider value
  sliderY.addEventListener("input", () => {
    labelY.textContent = `y = ${sliderY.value}`;
    getTotalValue();
    if (modeToggle.checked) {
      renderCenterExpression();
    } else {
      renderCoinsRow();
    }
  });

  // Clear button click functionality
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    SoundManager.play("click");
    resetCenterPanel();
    if (modeToggle.checked) {
      renderCenterExpression();
    } else {
      renderCoinsRow();
    }
  });

  function resetCenterPanel() {
    workPanel.innerHTML = "";
    totalTxt.innerText = 0;
    expressionTxt.innerText = "-";
    group = null;
    allElemsOnCenterStage = [];
    updateCoefficientBadges();
  }

  function enforceCenterVisibility() {
    const { coins, visual } = getExpressionGroup();
    if (modeToggle.checked) {
      // Algebra mode
      visual.classList.add("active");
      coins.classList.remove("active");
    } else {
      // Coins mode
      coins.classList.add("active");
      visual.classList.remove("active");
      // HARD HIDE visual content
      visual.innerHTML = "";
    }
  }


  const modeToggle = document.getElementById("modeToggle");
  // default mode = Coins
  setDragMode("coins");
  modeToggle.addEventListener("change", () => {
    SoundManager.play("click");
    setDragMode(modeToggle.checked ? "algebra" : "coins");
    enforceCenterVisibility();
  });

  function setDragMode(mode) {
    const { coins, visual } = getExpressionGroup();
    if (mode === "coins") {
      coins.classList.add("active");
      visual.classList.remove("active");
    } else {
      visual.classList.add("active");
      coins.classList.remove("active");
    }
    const coinItems = document.querySelectorAll(".tool-section.coins .drag-src");
    const algebraItems = document.querySelectorAll(".tool-section.algebra .drag-src");
    if (mode === "coins") {
      enableDrag(coinItems);
      disableDrag(algebraItems);
    } else {
      enableDrag(algebraItems);
      disableDrag(coinItems);
    }
  }


  function enableDrag(nodeList) {
    nodeList.forEach(el => {
      el.setAttribute("draggable", "true");
      el.classList.remove("drag-disabled");
    });
  }

  function disableDrag(nodeList) {
    nodeList.forEach(el => {
      el.removeAttribute("draggable");
      el.classList.add("drag-disabled");
    });
  }

  // Make toolbox items draggable
  document.querySelectorAll(".drag-src").forEach(src => {
    src.addEventListener("dragstart", e => {
      if (!src.getAttribute("draggable")) {
        e.preventDefault();
        return;
      }
      // 👇 HIDE algebra layer when dragging coins
      if (src.dataset.type === "coin") {
        const { visual, coins } = getExpressionGroup();
        visual.classList.remove("active");
        coins.classList.add("active");
      }
      e.dataTransfer.setData("text/plain", "dragging");
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
    //Never merge operators
    if (item.symbol === "+" || item.symbol === "-") return null;

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
      existing.textContent = `${existing.dataset.symbol}`;
      // if (existing.dataset.symbol === "x" || existing.dataset.symbol === "y") {
      //   existing.textContent = `${count}${existing.dataset.symbol}`;
      // } else if(existing.dataset.symbol === "-1") {
      //   existing.textContent = `-${count}`;
      // } else {
      //   existing.textContent = `${count}`;
      // }
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
    let currentSign = 1;
    for (let i = 0; i < allElemsOnCenterStage.length; i++) {
      const el = allElemsOnCenterStage[i];
      if (el.symbol === "+") {
        currentSign = 1;
        continue;
      }
      if (el.symbol === "-") {
        currentSign = -1;
        continue;
      }
      if (el.symbol === "x") {
        totalVal += currentSign * el.value * sliderX.value;
        xCount += currentSign * el.value;
      } 
      else if (el.symbol === "y") {
        totalVal += currentSign * el.value * sliderY.value;
        yCount += currentSign * el.value;
      }
      else {
        totalVal += currentSign * el.value;
        constantCount += currentSign * el.value;
      }
      // reset sign after applying
      currentSign = 1;
    }
    //  Build equation text properly
    const parts = [];
    // X term
    if (xCount !== 0) {
      parts.push(formatTerm(xCount, "x", parts.length === 0));
    }
    // Y term
    if (yCount !== 0) {
      parts.push(formatTerm(yCount, "y", parts.length === 0));
    }
    // Constant term (from 1 / -1)
    if (constantCount !== 0) {
      parts.push(formatConstant(constantCount, parts.length === 0));
    }
    const equationTxt = parts.join(" ");
    totalTxt.innerText = totalVal;
    expressionTxt.innerText = `${equationTxt} = ${totalVal}`;
  }

  function formatTerm(value, symbol, isFirst) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "+";
    const coeff = abs === 1 ? symbol : `${abs}${symbol}`;
    if (isFirst) {
      return value < 0 ? `-${coeff}` : coeff;
    }
    return `${sign} ${coeff}`;
  }

  function formatConstant(value, isFirst) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "+";
    if (isFirst) {
      return value < 0 ? `-${abs}` : `${abs}`;
    }
    return `${sign} ${abs}`;
  }



  //Log everything currently on stage
  function logAllWorkItems() {
    const items = [
      ...workPanel.querySelectorAll(".coins-layer .work-item"),
      ...workPanel.querySelectorAll(".logic-layer .work-item")
    ];
    allElemsOnCenterStage = items.map(el => ({
      type: el.dataset.type,
      symbol: el.dataset.symbol || "",
      value: Number(el.dataset.count) * Number(el.dataset.baseValue),
      text: el.innerText.trim(),
      x: parseInt(el.style.left),
      y: parseInt(el.style.top)
    }));
    getTotalValue();
    renderCenterExpression();
    return allElemsOnCenterStage;
  }

  // Handle drop
  workPanel.addEventListener("drop", e => {
    e.preventDefault();
    if (!draggedData) return;
    const existing = findExistingWorkItem(draggedData);
    if (existing) {
      mergeExistingItem(existing, draggedData);
    } else {
      createWorkItem(draggedData);
    }
    updateCoefficientBadges();
    logAllWorkItems();       // updates allElemsOnCenterStage
    const { coins, visual } = getExpressionGroup();
    if (modeToggle.checked) {
      // Algebra mode
      coins.classList.remove("active");
      visual.classList.add("active");
      renderCenterExpression();
    } else {
      // Coins mode
      visual.classList.remove("active");
      coins.classList.add("active");
      renderCoinsRow();
    }
  });

  document.addEventListener("dragend", () => {
    const { coins, visual } = getExpressionGroup();
    if (modeToggle.checked) {
      visual.classList.add("active");
      coins.classList.remove("active");
    } else {
      coins.classList.add("active");
      visual.classList.remove("active");
    }
  });


  // Create the dropped object --- old code
  /*function createWorkItem(item) {
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
  }*/

  function createWorkItem(item) {
    const { logic, coins } = getExpressionGroup();
    let el;
    // ---- COINS ----
    if (item.type === "coin") {
      const original = document.querySelector(
        `.drag-src[data-type="coin"][data-symbol="${item.symbol}"][data-value="${item.value}"]`
      );
      // Single clone used for BOTH logic + visual
      const coinEl = original.cloneNode(true);
      coinEl.classList.add("work-item");
      coinEl.removeAttribute("draggable");
      coinEl.style.cursor = "default";
      coinEl.dataset.type = item.type;
      coinEl.dataset.symbol = item.symbol;
      coinEl.dataset.baseValue = item.value;
      coinEl.dataset.count = 1;
      coinEl.dataset.value = item.value;
      coins.appendChild(coinEl);   // 👈 coins-layer ONLY
      return;
    }
    // ---- ALGEBRA (logic only) ----
    el = document.createElement("div");
    el.className = "work-item";
    el.dataset.type = item.type;
    el.dataset.symbol = item.symbol;
    el.dataset.baseValue = item.value;
    el.dataset.count = 1;
    el.dataset.value = item.value;
    logic.appendChild(el);
  }




  const showCoeffChk = document.getElementById("showCoeffChk");
  showCoeffChk.addEventListener("change", () => {
    updateCoefficientBadges();
  });

  const showCoinValChk = document.getElementById("showCoinValChk");
  showCoinValChk.addEventListener("change", () => {
    document.querySelectorAll(".btn.coin").forEach(coin => {
      const value = (coin.dataset.baseValue) ? coin.dataset.baseValue : coin.dataset.value;      // 5, 10, 15
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
      } else if(el.dataset.symbol === "+" || el.dataset.symbol === "-") {
        // DO nothing
      } else {
        badge.textContent = `${count}`;
        badge.classList.add("coeff-const");
      }
      el.appendChild(badge);
    });
  }

  function getExpressionGroup() {
    let logic = workPanel.querySelector(".logic-layer");
    let coins = workPanel.querySelector(".coins-layer");
    let visual = workPanel.querySelector(".visual-layer");
    if (!logic) {
      logic = document.createElement("div");
      logic.className = "expr-group logic-layer";
      workPanel.appendChild(logic);
    }
    if (!coins) {
      coins = document.createElement("div");
      coins.className = "expr-group coins-layer";
      workPanel.appendChild(coins);
    }
    if (!visual) {
      visual = document.createElement("div");
      visual.className = "expr-group visual-layer";
      workPanel.appendChild(visual);
    }
    return { logic, coins, visual };
  }

  function renderCenterExpression() {
    // const group = workPanel.querySelector(".visual-layer");
    const { visual } = getExpressionGroup();
    if (!visual) return;
    visual.innerHTML = "";
    // group.innerHTML = "";
    let xCount = 0, yCount = 0, constantCount = 0;
    allElemsOnCenterStage.forEach(el => {
      if (el.symbol === "x") xCount += el.value;
      else if (el.symbol === "y") yCount += el.value;
      else constantCount += el.value;
    });
    const terms = [];
    if (xCount) terms.push({ value: xCount, symbol: "x" });
    if (yCount) terms.push({ value: yCount, symbol: "y" });
    if (constantCount) terms.push({ value: constantCount, symbol: "" });
    terms.forEach((t, i) => {
      if (i > 0) {
        const s = document.createElement("span");
        s.className = "expr-sign";
        s.textContent = t.value < 0 ? "−" : "+";
        visual.appendChild(s);
      }
      const el = document.createElement("span");
      el.className = "text-item";
      el.textContent = Math.abs(t.value) === 1 && t.symbol
        ? t.symbol
        : Math.abs(t.value) + t.symbol;
      visual.appendChild(el);
    });
  }

  function renderCoinsRow() {
    const { coins } = getExpressionGroup();
    const coinElems = [...coins.querySelectorAll(".btn.coin")];
    coins.innerHTML = "";
    coinElems.forEach((coin, i) => {
      if (i > 0) {
        const plus = document.createElement("span");
        plus.className = "expr-sign";
        plus.textContent = "+";
        coins.appendChild(plus);
      }
      coins.appendChild(coin);
    });
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