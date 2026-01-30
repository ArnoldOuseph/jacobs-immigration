/* =========================
   Jacobs Immigration - JS
   Matches your index.html
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  headerShadow();
  scrollProgress();
  mobileNav();
  smoothScroll();
  heroSlider();
  revealOnScroll();
  animateCounters();
  accordion();
  activeNavOnScroll();
});

/* ---- Footer year ---- */
function setYear(){
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---- Sticky header shadow ---- */
function headerShadow(){
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-solid", window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- Scroll progress bar ---- */
function scrollProgress(){
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- Mobile nav toggle ---- */
function mobileNav(){
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close on link click
  nav.querySelectorAll(".nav__link").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---- Smooth scroll with header offset ---- */
function smoothScroll(){
  const header = document.querySelector(".site-header");

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      // ✅ FIX: Back to top should go to absolute top
      if (href === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight + 10 : 90;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}

/* ---- Hero slider: fade + kenburns zoom ---- */
function heroSlider(){
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero__slide"));
  const dots = Array.from(document.querySelectorAll(".dotbtn"));
  if (!slides.length) return;

  let index = 0;
  const intervalMs = 3000; // change to 2500 if you want faster
  let timer = null;

  const restartKenBurns = (slideEl) => {
    // Forces CSS animation to restart every time this slide becomes active
    slideEl.style.animation = "none";
    slideEl.offsetHeight; // trigger reflow
    slideEl.style.animation = "";
  };

  const setActive = (i) => {
    index = (i + slides.length) % slides.length;

    slides.forEach((s) => s.classList.remove("is-active"));
    dots.forEach((d) => d.classList.remove("is-active"));

    const activeSlide = slides[index];
    activeSlide.classList.add("is-active");
    restartKenBurns(activeSlide);

    if (dots[index]) dots[index].classList.add("is-active");
  };

  const scheduleNext = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setActive(index + 1);
      scheduleNext();
    }, intervalMs);
  };

  // Dot click
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.dataset.dot);
      if (!Number.isFinite(i)) return;
      setActive(i);
      scheduleNext();
    });
  });

  // Start
  setActive(0);
  scheduleNext();
}

/* ---- Reveal on scroll (matches .reveal class) ---- */
function revealOnScroll(){
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((el) => io.observe(el));
}

/* ---- Counters (Stats) ---- */
function animateCounters(){
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.getAttribute("data-count") || "0");
      countUp(el, target, 1100);
      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  nums.forEach((el) => io.observe(el));
}

function countUp(el, target, duration){
  const start = 0;
  const t0 = performance.now();

  const tick = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(start + (target - start) * eased);
    el.textContent = val.toLocaleString();

    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* ---- FAQ Accordion (your markup) ---- */
function accordion(){
  const acc = document.querySelector("[data-accordion]");
  if (!acc) return;

  const buttons = Array.from(acc.querySelectorAll(".acc-item"));
  const panels = Array.from(acc.querySelectorAll(".acc-panel"));

  buttons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // close all
      buttons.forEach((b) => b.setAttribute("aria-expanded", "false"));
      panels.forEach((p) => (p.style.maxHeight = null));

      // open this if it was closed
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        const panel = panels[idx];
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // Keep heights correct on resize
  window.addEventListener("resize", () => {
    buttons.forEach((btn, idx) => {
      if (btn.getAttribute("aria-expanded") === "true") {
        const panel = panels[idx];
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

/* ---- Active nav link based on section in view ---- */
function activeNavOnScroll(){
  const links = Array.from(document.querySelectorAll(".nav__link"));
  if (!links.length) return;

  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  };

  const io = new IntersectionObserver((entries) => {
    // pick the most visible
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id){
      setActive(visible.target.id);
    }
  }, { threshold: [0.20, 0.35, 0.55] });

  sections.forEach((sec) => io.observe(sec));
}
