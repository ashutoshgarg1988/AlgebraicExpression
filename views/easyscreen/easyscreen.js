/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 11-Dec-2025
 ***************************************************************/

(function initEasyScreen() {
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

  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  // Show info popup when screen loads
  // showPopup("info", { text: "Drag the angle arm to build an angle" });

  easyNextBtn.addEventListener("click", () => {
    loadView("warmupscreen");
  });

  soundBtn.addEventListener("click", () => {
    muted = !muted;
    soundBtn.src = muted ? "assets/icons/sound-off.png" : "assets/icons/sound-on.png";
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

  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    workPanel.innerHTML = "";
    totalTxt.innerText = 0;
    expressionTxt.innerText = "-";
    group = null;
  });

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

  // Allow dropping
  workPanel.addEventListener("dragover", e => {
    e.preventDefault();
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
        equationTxt += allElemsOnCenterStage[i].value+'x';
      } else if (allElemsOnCenterStage[i].symbol === 'y') {
        totalVal = totalVal + allElemsOnCenterStage[i].value * sliderY.value;
        equationTxt += allElemsOnCenterStage[i].value+'y';
      } else if (allElemsOnCenterStage[i].symbol === '1' || allElemsOnCenterStage[i].symbol === '-1') {
        console.log("allElemsOnCenterStage[i].value::",allElemsOnCenterStage[i].value);
        totalVal = totalVal + allElemsOnCenterStage[i].value;
        equationTxt += allElemsOnCenterStage[i].value+'y';
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
    const x = e.offsetX;
    const y = e.offsetY;
    createWorkItem(draggedData, x, y, e);
    //Log everything currently on stage
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
    // Check if dropped on an existing work item
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target && target.classList.contains("work-item")) {
      mergeWorkItems(target, el);
      return; // do NOT add a new box
    }
    // Otherwise add as new box
    enableMoveInsideWork(el);
    enableDeleteByDraggingBack(el);
    workPanel.appendChild(el);
  }

  function mergeWorkItems(existing, incoming) {
    // Only merge if same type and same symbol
    if (
      existing.dataset.type !== incoming.dataset.type ||
      existing.dataset.symbol !== incoming.dataset.symbol
    ) {
      return;
    }
    // Calculate new value
    let newVal = Number(existing.dataset.value) + Number(incoming.dataset.value);
    existing.dataset.value = newVal;
    // Update display
    if (existing.dataset.symbol) {
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