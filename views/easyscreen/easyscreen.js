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
    btnBook: true,
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

  // Function to get total text value on right side panel
  function getTotalValue() {
    let totalVal = 0;
    let equationTxt = '';
    for (let i = 0; i < allElemsOnCenterStage.length; i++) {
      if (equationTxt !== "") {
        equationTxt += " + ";
      }
      if (allElemsOnCenterStage[i].symbol === 'x') {
        totalVal = totalVal + allElemsOnCenterStage[i].value * sliderX.value;
        equationTxt += allElemsOnCenterStage[i].value + 'x';
      } else if (allElemsOnCenterStage[i].symbol === 'y') {
        totalVal = totalVal + allElemsOnCenterStage[i].value * sliderY.value;
        equationTxt += allElemsOnCenterStage[i].value + 'y';
      } else if (allElemsOnCenterStage[i].symbol === '1' || allElemsOnCenterStage[i].symbol === '-1' || allElemsOnCenterStage[i].symbol === 'B' || allElemsOnCenterStage[i].symbol === 'S' || allElemsOnCenterStage[i].symbol === 'G') {
        totalVal = totalVal + allElemsOnCenterStage[i].value;
        equationTxt += allElemsOnCenterStage[i].value;
      }
    }
    totalTxt.innerText = totalVal;
    expressionTxt.innerText = equationTxt + ' = ' + totalVal;
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
    // If merge target exists → MERGE
    if (currentMergeTarget) {
      mergeWorkItems(currentMergeTarget, draggedData);
      currentMergeTarget.classList.remove("merge-highlight");
      currentMergeTarget = null;
      workPanel.style.cursor = "default";
      logAllWorkItems();
      return;
    }
    // Otherwise → create new item
    const x = e.offsetX;
    const y = e.offsetY;
    createWorkItem(draggedData, x, y, e);
    logAllWorkItems();
  });

  // Create the dropped object
  function createWorkItem(item, x, y, event) {
    // Clone the toolbox template
    const original = document.querySelector(
      `.drag-src[data-type="${item.type}"][data-symbol="${item.symbol || ""}"][data-value="${item.value}"]`
    );
    const el = original.cloneNode(true);
    el.classList.add("work-item");
    // Start with its original value
    el.dataset.value = item.value;
    el.dataset.symbol = item.symbol || "";
    el.dataset.type = item.type;
    // Position in work area
    el.style.position = "absolute";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.cursor = "grab";
    el.style.width = "100px";
    // Otherwise add as new box
    enableMoveInsideWork(el);
    enableDeleteByDraggingBack(el);
    workPanel.appendChild(el);
  }

  function mergeWorkItems(existing, draggedData) {
    const existingVal = Number(existing.dataset.value);
    const incomingVal = Number(draggedData.value);
    const newVal = existingVal + incomingVal;
    existing.dataset.value = newVal;
    if (existing.dataset.symbol === 'x' || existing.dataset.symbol === 'y') {
      existing.innerHTML = `${newVal}${existing.dataset.symbol}`;
    } else {
      existing.innerHTML = newVal;
    }
  }


  // Allow moving inside work panel
  function enableMoveInsideWork(el) {
    let offsetX = 0, offsetY = 0;
    el.addEventListener("mousedown", e => {
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      function move(ev) {
        el.style.left = (ev.pageX - workPanel.offsetLeft - offsetX) + "px";
        el.style.top = (ev.pageY - workPanel.offsetTop - offsetY) + "px";
      }
      function stop() {
        document.removeEventListener("mousemove", move);
      }
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop, { once: true });
    });
  }

  // Delete by dragging back onto toolbox buttons
  function enableDeleteByDraggingBack(el) {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "dragging");
      draggedData = el;
    });
    document.querySelectorAll(".drag-src").forEach(src => {
      src.addEventListener("dragover", e => e.preventDefault());
      src.addEventListener("drop", () => {
        if (draggedData.classList.contains("work-item")) {
          draggedData.remove();
        }
      });
    });
  }
})();