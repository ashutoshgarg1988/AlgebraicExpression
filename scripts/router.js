/***************************************************************
 *  Author      : Ashutosh Garg
 *  Email       : ashutoshgarg1987@gmail.com
 *  File        : router.js
 *  Description : Handeler routes
 *  Date        : 4-Dec-2025
 ***************************************************************/

// Code to load views Locaally
function loadView(viewName) {
  // Load HTML from <template>
  const tpl = document.getElementById(`view-${viewName}`);
  if (!tpl) {
    console.error("View not found:", viewName);
    return;
  }
  document.querySelector("#app").innerHTML = tpl.innerHTML;
  // Remove OLD CSS
  document.querySelectorAll("link[data-view-css]").forEach(el => el.remove());
  // Add NEW CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `views/${viewName}/${viewName}.css`;
  css.setAttribute("data-view-css", viewName);
  document.head.appendChild(css);
  // Remove OLD JS
  document.querySelectorAll("script[data-view-js]").forEach(el => el.remove());
  // Add NEW JS
  const js = document.createElement("script");
  js.src = `views/${viewName}/${viewName}.js`;
  js.setAttribute("data-view-js", viewName);
  document.body.appendChild(js);
}

/*
// Code for run on server using dynamic load using fetch
async function loadView(viewName) {
  // Load HTML
  const html = await fetch(`views/${viewName}/${viewName}.html`).then(r => r.text());
  document.querySelector("#app").innerHTML = html;

  // Remove OLD CSS
  document.querySelectorAll("link[data-view-css]").forEach(el => el.remove());

  // Add NEW CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `views/${viewName}/${viewName}.css`;
  css.setAttribute("data-view-css", viewName);
  document.head.appendChild(css);

  // Remove OLD JS
  document.querySelectorAll("script[data-view-js]").forEach(el => el.remove());

  // Add NEW JS
  const js = document.createElement("script");
  js.src = `views/${viewName}/${viewName}.js`;
  js.setAttribute("data-view-js", viewName);
  document.body.appendChild(js);
}
*/

// Show/Hide common elements as per need
function setCommonUI(options = {}) {
  for (const key in options) {
    const el = document.getElementById(key);
    if (!el) continue;

    if (options[key]) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }
}