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
  const placeholder = document.querySelector("#map-placeholder");
  const mapButton = document.querySelector("#map-load-button");
  const mapCheckbox = document.querySelector("#cookie-map-consent");
  const metricaCheckbox = document.querySelector("#cookie-metrica-consent");
  const saveButton = document.querySelector("#cookie-save");
  const rejectButton = document.querySelector("#cookie-reject");
  const settingsButton = document.querySelector("#cookie-settings");
  if (!banner || !frame || !placeholder || !mapCheckbox || !metricaCheckbox) return;

  const metricaId = 114113321;
  const mapConsentKey = "avdex-map-consent";
  const metricaConsentKey = "avdex-metrica-consent";
  const mapTitle = "Яндекс Карты: AVDEX, Нижний Новгород, ул. Новикова-Прибоя, 4, корп. 6";
  const mapUrl = "https://yandex.ru/map-widget/v1/?z=17&ol=biz&oid=193976392465";

  const getChoice = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const saveChoice = (key, choice) => {
    try {
      window.localStorage.setItem(key, choice);
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
    placeholder.hidden = true;
    frame.appendChild(iframe);
  };

  const removeMap = () => {
    frame.querySelector("iframe")?.remove();
    placeholder.hidden = false;
  };

  const loadMetrica = () => {
    if (window.__avdexMetricaLoaded) return;
    window["disableYaCounter" + metricaId] = false;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = window.ym.l || Date.now();

    const script = document.createElement("script");
    const firstScript = document.getElementsByTagName("script")[0];
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    firstScript.parentNode.insertBefore(script, firstScript);

    window.ym(metricaId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
    window.__avdexMetricaLoaded = true;
  };

  const syncCheckboxes = () => {
    mapCheckbox.checked = getChoice(mapConsentKey) === "accepted";
    metricaCheckbox.checked = getChoice(metricaConsentKey) === "accepted";
  };

  const showBanner = (selectMap = false) => {
    syncCheckboxes();
    if (selectMap) mapCheckbox.checked = true;
    banner.hidden = false;
    saveButton?.focus();
  };

  const hideBanner = () => {
    banner.hidden = true;
  };

  const savePreferences = () => {
    const oldMetricaChoice = getChoice(metricaConsentKey);
    const allowMap = mapCheckbox.checked;
    const allowMetrica = metricaCheckbox.checked;

    saveChoice(mapConsentKey, allowMap ? "accepted" : "rejected");
    saveChoice(metricaConsentKey, allowMetrica ? "accepted" : "rejected");

    if (allowMap) loadMap();
    else removeMap();

    if (allowMetrica) {
      loadMetrica();
    } else if (oldMetricaChoice === "accepted") {
      window["disableYaCounter" + metricaId] = true;
      window.location.reload();
      return;
    }

    hideBanner();
  };

  saveButton?.addEventListener("click", savePreferences);

  rejectButton?.addEventListener("click", () => {
    const oldMetricaChoice = getChoice(metricaConsentKey);
    mapCheckbox.checked = false;
    metricaCheckbox.checked = false;
    saveChoice(mapConsentKey, "rejected");
    saveChoice(metricaConsentKey, "rejected");
    removeMap();

    if (oldMetricaChoice === "accepted") {
      window["disableYaCounter" + metricaId] = true;
      window.location.reload();
      return;
    }
    hideBanner();
  });

  mapButton?.addEventListener("click", () => showBanner(true));
  settingsButton?.addEventListener("click", () => showBanner());

  const mapChoice = getChoice(mapConsentKey);
  const metricaChoice = getChoice(metricaConsentKey);
  if (mapChoice === "accepted") loadMap();
  if (metricaChoice === "accepted") loadMetrica();

  if (mapChoice === null || metricaChoice === null) showBanner();
});
