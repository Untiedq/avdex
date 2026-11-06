(function () {
  "use strict";

  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (!button || !nav) return;

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("open", open);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (button.getAttribute("aria-expanded") !== "true") return;
    if (!button.contains(event.target) && !nav.contains(event.target)) setOpen(false);
  });
})();



document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#feedback-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = "Обращение с сайта AVDEX";
    const body = [
      "Имя: " + data.get("name"),
      "Телефон: " + data.get("phone"),
      "Электронная почта: " + data.get("email"),
      "Вопрос: " + (data.get("message") || "не указан"),
      "Согласие на обработку персональных данных: дано",
      "",
      "Политика обработки персональных данных: https://untiedq.github.io/avdex/personal-data.html"
    ].join("\n");
    const note = document.querySelector("#form-note");
    if (note) note.textContent = "Откроется почтовое приложение. Проверьте письмо и нажмите «Отправить», чтобы передать данные AVDEX.";
    window.location.href = "mailto:avdex@yandex.ru?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector("#cookie-banner");
  const frame = document.querySelector("#map-frame");
  const mapButton = document.querySelector("#map-load-button");
  const acceptButton = document.querySelector("#cookie-accept");
  const rejectButton = document.querySelector("#cookie-reject");
  const settingsButton = document.querySelector("#cookie-settings");
  if (!banner || !frame) return;

  const consentKey = "avdex-map-consent";
  const mapTitle = "Яндекс Карты: AVDEX, Нижний Новгород, ул. Новикова-Прибоя, 4, корп. 6";
  const mapUrl = "https://yandex.ru/map-widget/v1/?z=17&ol=biz&oid=193976392465";

  const getChoice = () => {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (_) {
      return null;
    }
  };

  const saveChoice = (choice) => {
    try {
      window.localStorage.setItem(consentKey, choice);
    } catch (_) {
      // The current choice still applies for this page view if storage is unavailable.
    }
  };

  const loadMap = () => {
    if (frame.querySelector("iframe")) return;
    const iframe = document.createElement("iframe");
    iframe.src = mapUrl;
    iframe.title = mapTitle;
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
  };

  const showBanner = () => {
    banner.hidden = false;
    acceptButton?.focus();
  };

  const hideBanner = () => {
    banner.hidden = true;
  };

  acceptButton?.addEventListener("click", () => {
    saveChoice("accepted");
    loadMap();
    hideBanner();
  });

  rejectButton?.addEventListener("click", () => {
    saveChoice("rejected");
    frame.querySelector("iframe")?.remove();
    hideBanner();
  });

  mapButton?.addEventListener("click", showBanner);
  settingsButton?.addEventListener("click", showBanner);

  if (getChoice() === "accepted") {
    loadMap();
  } else if (getChoice() !== "rejected") {
    showBanner();
  }
});
