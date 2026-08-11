const weddingDate = new Date("2026-08-23T12:05:00+05:30").getTime();
const invite = document.querySelector("[data-invite]");
const openInviteButton = document.querySelector("[data-open-invite]");
const music = document.querySelector("#music");
const countdown = document.querySelector("#countdown");
const petalField = document.querySelector(".petal-field");
const lightTrail = document.querySelector(".light-trail");
const form = document.querySelector("#form");
const guestInput = document.querySelector("#guests");
const guestValue = document.querySelector("#guestValue");
const nameInput = document.querySelector("#name");
const messageInput = document.querySelector("#message");
const formMessage = document.querySelector("#msg");
const rsvpModal = document.querySelector("[data-rsvp-modal]");
const rsvpModalCloseButtons = document.querySelectorAll("[data-close-rsvp-modal]");
const rsvpSummaryName = document.querySelector("[data-rsvp-summary-name]");
const rsvpSummaryAttending = document.querySelector("[data-rsvp-summary-attending]");
const rsvpSummaryGuests = document.querySelector("[data-rsvp-summary-guests]");
const rsvpSummaryMessage = document.querySelector("[data-rsvp-summary-message]");
const rsvpSummaryMessageRow = document.querySelector("[data-rsvp-summary-message-row]");
const videoModal = document.querySelector("[data-video-modal]");
const videoFormLink = document.querySelector("[data-video-form-link]");
const videoModalCloseButtons = document.querySelectorAll("[data-close-video-modal]");
const eventTabs = document.querySelectorAll("[data-event-tab]");
const eventTabList = document.querySelector("[role='tablist'][aria-label='Wedding events']");
const eventPanel = document.querySelector("[data-event-panel]");
const slides = [...document.querySelectorAll("[data-slide]")];
const galleryDots = document.querySelector("[data-gallery-dots]");
const galleryTrack = document.querySelector("[data-gallery-track]");
let activeSlide = 0;
let touchStartX = 0;
let touchStartY = 0;
let resumeMusicOnVisible = false;

const events = {
  wedding: {
    kicker: "Wedding Ceremony",
    title: "Girideepam Convention Centre",
    location: "Inside Mar Ivanios Vidya Nagar Main Gate, Nalanchira, Trivandrum",
    detail: "Sunday, 23 August 2026 at 12:05 PM",
    mapUrl: "https://www.google.com/maps?q=Girideepam+Convention+Centre"
  },
  reception: {
    kicker: "Reception",
    title: "RDR Convention Centre",
    location: "Edapazhanji, Trivandrum",
    detail: "Monday, 24 August 2026 at 5:30 PM",
    mapUrl: "https://www.google.com/maps?q=RDR+Convention+Centre"
  },
  sangeeth: {
    kicker: "Sangeeth",
    title: "BM Convention Centre",
    location: "Ambalathara, Trivandrum",
    detail: "Friday, 21 August 2026 at 4:00 PM",
    mapUrl: "https://maps.app.goo.gl/STb2p3m6F3wfmBWU6?g_st=iw"
  }
};

const videoFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd532EJfObF-dDajoLiJIW6bGWpgQ9JrgJq_1UTQ7hAuQ9g2A/viewform";

function startInviteMusic() {
  if (!music || !music.paused || document.hidden) {
    return;
  }

  music.volume = 0.34;
  music.play().catch(() => {
    // Browsers only allow audio after a user gesture.
  });
}

function pauseInviteMusic() {
  if (!music || music.paused) {
    return;
  }

  music.pause();
}

function handlePageVisibilityChange() {
  if (!music) {
    return;
  }

  if (document.hidden) {
    resumeMusicOnVisible = !music.paused;
    pauseInviteMusic();
    return;
  }

  if (resumeMusicOnVisible && invite.classList.contains("is-open")) {
    resumeMusicOnVisible = false;
    startInviteMusic();
  }
}

function handlePageHide() {
  if (!music) {
    return;
  }

  resumeMusicOnVisible = !music.paused;
  pauseInviteMusic();
}

function openInvite() {
  invite.classList.add("is-open");
  startInviteMusic();
}

function updateCountdown() {
  const remaining = Math.max(0, weddingDate - Date.now());
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;
  const values = [
    Math.floor(remaining / day),
    Math.floor((remaining % day) / hour),
    Math.floor((remaining % hour) / minute),
    Math.floor((remaining % minute) / 1000)
  ];

  countdown.querySelectorAll("strong").forEach((item, index) => {
    item.textContent = values[index].toString().padStart(index === 0 ? 1 : 2, "0");
  });
}

function createPetals() {
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const petalCount = isMobile ? 22 : 42;
  const driftRange = isMobile ? 14 : 34;

  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.setProperty("--x", `${Math.random() * 100}vw`);
    petal.style.setProperty("--drift", `${Math.random() * driftRange - driftRange / 2}vw`);
    petal.style.setProperty("--size", `${0.55 + Math.random() * 0.75}rem`);
    petal.style.setProperty("--opacity", `${0.3 + Math.random() * 0.48}`);
    petal.style.setProperty("--rotate", `${Math.random() * 360}deg`);
    petal.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
    petal.style.setProperty("--delay", `${Math.random() * -14}s`);
    petalField.appendChild(petal);
  }
}

function createSpark(x, y) {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.setProperty("--dx", `${Math.random() * 54 - 27}px`);
  spark.style.setProperty("--dy", `${Math.random() * 54 - 27}px`);
  lightTrail.appendChild(spark);
  spark.addEventListener("animationend", () => spark.remove(), { once: true });
}

function updateEvent(key) {
  const event = events[key];
  document.querySelectorAll("[data-event-tab]").forEach((tab) => {
    const isActive = tab.dataset.eventTab === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  eventPanel.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow event-kicker">${event.kicker}</p>
      <h3>${event.title}</h3>
      <p><i>${event.location}</i></p>
      <p>${event.detail}</p>
      <a class="map-link" href="${event.mapUrl}" target="_blank" rel="noopener">Open map</a>
    </div>
  `;
}

function hasSangeethAccess() {
  const params = new URLSearchParams(window.location.search);
  const invite = params.get("invite");
  const event = params.get("event");
  return window.location.hash === "#sangeeth"
    || invite === "sangeeth"
    || event === "sangeeth"
    || params.has("sangeeth");
}

function revealSangeethEvent() {
  if (!hasSangeethAccess() || !eventTabList) {
    return;
  }

  const sangeethTab = document.createElement("button");
  sangeethTab.type = "button";
  sangeethTab.className = "event-tab";
  sangeethTab.setAttribute("role", "tab");
  sangeethTab.setAttribute("aria-selected", "false");
  sangeethTab.dataset.eventTab = "sangeeth";
  sangeethTab.textContent = "Sangeeth";
  sangeethTab.addEventListener("click", () => updateEvent("sangeeth"));
  eventTabList.appendChild(sangeethTab);

  if (window.location.hash === "#sangeeth" || new URLSearchParams(window.location.search).get("event") === "sangeeth") {
    updateEvent("sangeeth");
    document.querySelector("#events").scrollIntoView({ block: "start" });
  }
}

function updateGalleryFrame() {
  const activeImage = slides[activeSlide]?.querySelector(".memory-photo");

  if (!activeImage) {
    return;
  }

  if (activeImage.naturalWidth && activeImage.naturalHeight) {
    galleryTrack.style.setProperty("--gallery-aspect", activeImage.naturalWidth / activeImage.naturalHeight);
    return;
  }

  activeImage.addEventListener("load", () => {
    if (slides[activeSlide]?.contains(activeImage)) {
      galleryTrack.style.setProperty("--gallery-aspect", activeImage.naturalWidth / activeImage.naturalHeight);
    }
  }, { once: true });
}

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  updateGalleryFrame();
  galleryDots.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    dot.setAttribute("aria-current", dotIndex === activeSlide ? "true" : "false");
  });
}

function buildGalleryDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show moment ${index + 1}`);
    dot.addEventListener("click", () => setSlide(index));
    galleryDots.appendChild(dot);
  });
  setSlide(0);
}

function updateGuestReadout() {
  guestValue.textContent = guestInput.value;
}

function openRsvpModal(data) {
  const guestCount = Number(data.guests);
  const guestLabel = guestCount === 1 ? "1 guest" : `${guestCount} guests`;

  rsvpSummaryName.textContent = data.name;
  rsvpSummaryAttending.textContent = data.attending === "Yes"
    ? "Yes, attending"
    : "No, unable to attend";
  rsvpSummaryGuests.textContent = guestLabel;
  rsvpSummaryMessage.textContent = data.message;
  rsvpSummaryMessageRow.hidden = !data.message;
  rsvpModal.classList.add("is-open");
  rsvpModal.setAttribute("aria-hidden", "false");
  rsvpModal.querySelector("button[data-close-rsvp-modal]").focus();
}

function closeRsvpModal() {
  rsvpModal.classList.remove("is-open");
  rsvpModal.setAttribute("aria-hidden", "true");
}

function openVideoModal() {
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  videoFormLink.focus();
}

function closeVideoModal() {
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
}

async function submitRsvp(event) {
  event.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    attending: form.elements.attending.value,
    guests: guestInput.value,
    message: messageInput.value.trim()
  };

  if (!data.name) {
    formMessage.textContent = "Please add your name.";
    formMessage.style.color = "#a13545";
    return;
  }

  formMessage.textContent = "Sending RSVP...";
  formMessage.style.color = "#627a64";

  try {
    await fetch("https://script.google.com/macros/s/AKfycbz0SwZYu0QGE9Eqm-fXWdZJtjq0jtkeGTpnREvuaTPnYqS6xSCDBU4yH79-u2PCd1jf/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    formMessage.textContent = "Thank you. Your RSVP has been recorded.";
    formMessage.style.color = "#0f6b70";
    const shouldPromptForVideo = data.attending === "No";
    const shouldShowRsvpModal = data.attending === "Yes";
    form.reset();
    guestInput.value = "1";
    updateGuestReadout();
    if (shouldShowRsvpModal) {
      openRsvpModal(data);
    }
    if (shouldPromptForVideo) {
      openVideoModal();
    }
  } catch (error) {
    formMessage.textContent = "Could not send RSVP. Please try again.";
    formMessage.style.color = "#a13545";
  }
}

function watchSections() {
  const dockLinks = [...document.querySelectorAll(".section-dock a")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const dock = document.querySelector(".section-dock");
  let pendingFrame = null;

  function setActiveLink(sectionId) {
    dockLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
    });
  }

  function updateActiveSection() {
    pendingFrame = null;
    const activationPoint = window.scrollY + (dock?.offsetHeight || 0) + 36;
    let activeSection = sections[0];

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      if (sectionTop <= activationPoint) {
        activeSection = section;
      }
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeSection = sections[sections.length - 1];
    }

    setActiveLink(activeSection.id);
  }

  function requestActiveSectionUpdate() {
    if (pendingFrame) {
      return;
    }

    pendingFrame = requestAnimationFrame(updateActiveSection);
  }

  updateActiveSection();
  window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", requestActiveSectionUpdate);
  window.addEventListener("load", updateActiveSection);
}

openInviteButton.addEventListener("click", openInvite);
document.addEventListener("click", startInviteMusic, { once: true });
document.addEventListener("touchstart", startInviteMusic, { once: true, passive: true });
document.addEventListener("visibilitychange", handlePageVisibilityChange);
window.addEventListener("pagehide", handlePageHide);
window.addEventListener("pageshow", handlePageVisibilityChange);
document.querySelector("[data-gallery-prev]").addEventListener("click", () => setSlide(activeSlide - 1));
document.querySelector("[data-gallery-next]").addEventListener("click", () => setSlide(activeSlide + 1));
galleryTrack.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });
galleryTrack.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    setSlide(activeSlide + (deltaX < 0 ? 1 : -1));
  }
}, { passive: true });
eventTabs.forEach((tab) => tab.addEventListener("click", () => updateEvent(tab.dataset.eventTab)));
revealSangeethEvent();
guestInput.addEventListener("input", updateGuestReadout);
form.addEventListener("submit", submitRsvp);
if (videoFormUrl) {
  videoFormLink.href = videoFormUrl;
} else {
  videoFormLink.removeAttribute("href");
  videoFormLink.classList.add("is-disabled");
  videoFormLink.textContent = "Upload form coming soon";
}
videoModalCloseButtons.forEach((button) => button.addEventListener("click", closeVideoModal));
rsvpModalCloseButtons.forEach((button) => button.addEventListener("click", closeRsvpModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && rsvpModal.classList.contains("is-open")) {
    closeRsvpModal();
  }
  if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
    closeVideoModal();
  }
});

let lastSpark = 0;
window.addEventListener("pointermove", (event) => {
  const now = performance.now();
  if (now - lastSpark > 55) {
    createSpark(event.clientX, event.clientY);
    lastSpark = now;
  }
});

createPetals();
buildGalleryDots();
updateCountdown();
updateGuestReadout();
watchSections();
startInviteMusic();
setInterval(updateCountdown, 1000);
setTimeout(openInvite, 1200);
