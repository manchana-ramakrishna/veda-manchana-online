(() => {
  "use strict";

  const BIRTHDAY = new Date("2026-08-27T00:00:00");
  const WISH_KEY = "veda-birthday-wishes-v1";

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const noteEl = document.getElementById("timer-note");
  const nav = document.getElementById("site-nav");
  const wishForm = document.getElementById("wish-form");
  const wishList = document.getElementById("wish-list");

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  function setTick(el, value) {
    if (!el) return;
    const next = pad(value);
    if (el.textContent === next) return;
    el.classList.add("is-tick");
    el.textContent = next;
    window.setTimeout(() => el.classList.remove("is-tick"), 220);
  }

  function updateCountdown() {
    const diff = BIRTHDAY.getTime() - Date.now();

    if (diff <= 0) {
      setTick(daysEl, 0);
      setTick(hoursEl, 0);
      setTick(minutesEl, 0);
      setTick(secondsEl, 0);
      if (noteEl) noteEl.hidden = false;
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    setTick(daysEl, Math.floor(totalSeconds / 86400));
    setTick(hoursEl, Math.floor((totalSeconds % 86400) / 3600));
    setTick(minutesEl, Math.floor((totalSeconds % 3600) / 60));
    setTick(secondsEl, totalSeconds % 60);
  }

  function initReveal() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
      observer.observe(node);
    });
  }

  function loadWishes() {
    try {
      const raw = localStorage.getItem(WISH_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveWishes(wishes) {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishes));
  }

  function formatTime(iso) {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderWishes() {
    if (!wishList) return;
    const wishes = loadWishes();
    wishList.innerHTML = wishes
      .map(
        (wish) => `
        <li class="wish">
          <p class="wish__name">${escapeHtml(wish.name)}</p>
          <p class="wish__message">${escapeHtml(wish.message)}</p>
          <span class="wish__time">${escapeHtml(formatTime(wish.at))}</span>
        </li>`
      )
      .join("");
  }

  function initWishes() {
    renderWishes();
    if (!wishForm) return;

    wishForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(wishForm);
      const name = String(data.get("name") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !message) return;

      const wishes = loadWishes();
      wishes.unshift({
        name: name.slice(0, 40),
        message: message.slice(0, 280),
        at: new Date().toISOString(),
      });
      saveWishes(wishes.slice(0, 50));
      wishForm.reset();
      renderWishes();
    });
  }

  function initNav() {
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  initNav();
  initReveal();
  initWishes();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
