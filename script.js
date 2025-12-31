document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("story-container");
  const progressBar = document.getElementById("progressBar");
  const screens = document.querySelectorAll(".screen");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let lightboxOpen = false;

  /* =====================
     Progress Bar
     ===================== */
  container.addEventListener("scroll", () => {
    const max = container.scrollHeight - container.clientHeight;
    progressBar.style.width = `${(container.scrollTop / max) * 100}%`;
  });

  /* =====================
     Tap to Advance
     ===================== */
  container.addEventListener("click", () => {
    if (lightboxOpen) return;

    const next = Math.round(container.scrollTop / container.clientHeight) + 1;

    if (next < screens.length) {
      container.scrollTo({
        top: next * container.clientHeight,
        behavior: "smooth",
      });
    }
  });

  /* =====================
     Reveal Animations
     ===================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target.querySelector(".reveal");
        if (el && entry.isIntersecting) el.classList.add("active");
      });
    },
    { threshold: 0.5 }
  );

  screens.forEach((screen) => observer.observe(screen));

  /* =====================
     Image Lightbox
     ===================== */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.classList.remove("hidden");
      lightboxOpen = true;
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
    lightboxOpen = false;
  });

  /* =====================
     New Year Countdown
     ===================== */

  const dEl = document.getElementById("days");
  const hEl = document.getElementById("hours");
  const mEl = document.getElementById("minutes");
  const sEl = document.getElementById("seconds");

  // SET TARGET TIME (local device time)
  // Philippines is UTC +8
  // Jan 1, 2026 00:00:0s0 PHT = Dec 31, 2025 16:00:00 UTC
  const newYear = Date.UTC(2025, 11, 31, 16, 0, 0);

  const countdownTimer = setInterval(() => {
    const now = Date.now();
    const diff = newYear - now;

    if (diff <= 0) {
      clearInterval(countdownTimer);

      // Jump to final screen
      const finalIndex = screens.length - 1;
      container.scrollTo({
        top: finalIndex * container.clientHeight,
        behavior: "smooth",
      });

      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(minutes).padStart(2, "0");
    sEl.textContent = String(seconds).padStart(2, "0");
  }, 1000);
});
