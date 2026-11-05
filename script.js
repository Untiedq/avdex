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
