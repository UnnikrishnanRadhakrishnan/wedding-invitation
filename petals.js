const weddingDate = new Date("2026-08-23T12:05:00+05:30").getTime();
const invite = document.querySelector("[data-invite]");
const openInviteButton = document.querySelector("[data-open-invite]");
const countdown = document.querySelector("#countdown");
const petalField = document.querySelector(".petal-field");
const lightTrail = document.querySelector(".light-trail");
const form = document.querySelector("#form");
const guestInput = document.querySelector("#guests");
const guestValue = document.querySelector("#guestValue");
const nameInput = document.querySelector("#name");
const messageInput = document.querySelector("#message");
const previewName = document.querySelector("[data-preview-name]");
const previewAttending = document.querySelector("[data-preview-attending]");
const previewMessage = document.querySelector("[data-preview-message]");
const formMessage = document.querySelector("#msg");
const eventTabs = document.querySelectorAll("[data-event-tab]");
const eventPanel = document.querySelector("[data-event-panel]");
const mapFrame = document.querySelector("[data-map]");
const slides = [...document.querySelectorAll("[data-slide]")];
const galleryDots = document.querySelector("[data-gallery-dots]");
const galleryTrack = document.querySelector("[data-gallery-track]");
let activeSlide = 0;
let touchStartX = 0;
let touchStartY = 0;

const events = {
  wedding: {
    kicker: "Wedding Ceremony",
    title: "Girideepam Convention Centre",
    detail: "Sunday, 23 August 2026 at 12:05 PM",
    query: "Girideepam+Convention+Centre"
  },
  reception: {
    kicker: "Reception",
    title: "RDR Convention Centre",
    detail: "Monday, 24 August 2026 at 5:30 PM",
    query: "RDR+Convention+Centre"
  }
};

function openInvite() {
  invite.classList.add("is-open");
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
  eventTabs.forEach((tab) => {
    const isActive = tab.dataset.eventTab === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  eventPanel.innerHTML = `
    <div>
      <p class="event-kicker">${event.kicker}</p>
      <h3>${event.title}</h3>
      <p>${event.detail}</p>
    </div>
    <a class="map-link" href="https://www.google.com/maps?q=${event.query}" target="_blank" rel="noopener">Open map</a>
  `;
  mapFrame.src = `https://www.google.com/maps?q=${event.query}&output=embed`;
}

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
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

function updatePreview() {
  const name = nameInput.value.trim() || "Your name";
  const attending = form.elements.attending.value;
  const guestCount = Number(guestInput.value);
  const message = messageInput.value.trim() || "Write a little note and it will appear here.";
  const guestLabel = guestCount === 1 ? "1 guest" : `${guestCount} guests`;

  guestValue.textContent = guestCount;
  previewName.textContent = name;
  previewAttending.textContent = attending === "Yes"
    ? `Will attend with ${guestLabel}.`
    : "Cannot attend, but sends warm wishes.";
  previewMessage.textContent = message;
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
    form.reset();
    guestInput.value = "1";
    updatePreview();
  } catch (error) {
    formMessage.textContent = "Could not send RSVP. Please try again.";
    formMessage.style.color = "#a13545";
  }
}

function watchSections() {
  const dockLinks = [...document.querySelectorAll(".section-dock a")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    dockLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    threshold: [0.36, 0.6]
  });

  sections.forEach((section) => observer.observe(section));
}

openInviteButton.addEventListener("click", openInvite);
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
form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);
form.addEventListener("submit", submitRsvp);

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
updatePreview();
watchSections();
setInterval(updateCountdown, 1000);
setTimeout(openInvite, 1200);
