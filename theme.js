(function () {
  const storageKey = "retailDomainTheme";
  const root = document.documentElement;

  const saved = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));

  function paint(btn) {
    const dark = root.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "☀" : "☾";
    btn.title = dark ? "Switch to light mode" : "Switch to dark mode";
    btn.setAttribute("aria-label", btn.title);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    if (document.querySelector(".lesson-nav-footer")) {
      btn.classList.add("above-footer");
    }
    paint(btn);
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(storageKey, next);
      paint(btn);
    });
    document.body.appendChild(btn);
  });
})();
