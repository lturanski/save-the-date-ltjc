(function () {
  "use strict";
  const config = window.SAVE_THE_DATE || {};
  const byId = (id) => document.getElementById(id);
  const envelopeScene = byId("envelope-scene");
  const openInvitation = byId("open-invitation");
  const revealInvitation = () => {
    if (envelopeScene.classList.contains("is-opening")) return;
    envelopeScene.classList.add("is-opening");
    openInvitation.disabled = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      document.body.classList.add("invitation-open");
      envelopeScene.classList.add("is-finished");
      byId("invitation").focus({ preventScroll: true });
    }, reducedMotion ? 20 : 1250);
  };
  openInvitation.addEventListener("click", revealInvitation);
  const names = config.names || "Your Name & Your Partner";
  byId("names").textContent = names;
  document.title = `${names} · Save the date`;
  byId("location").textContent = config.location || "Location to come";
  byId("date").textContent = config.dateLabel || "Wedding date to come";

  // UTC is used only to calculate date-only values; the event is all-day everywhere.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(config.date || "")
    ? new Date(`${config.date}T00:00:00Z`) : null;
  if (date && !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === config.date) {
    byId("date").textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    }).format(date);
  }

  function formURL(raw, embed = false) {
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.username || url.password) return null;
      const full = url.hostname === "docs.google.com" && /^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[^/]+\/viewform\/?$/.test(url.pathname);
      const short = !embed && url.hostname === "forms.gle" && url.pathname.length > 1;
      return full || short ? url : null;
    } catch { return null; }
  }
  const embed = formURL(config.formEmbedUrl, true);
  const link = formURL(config.formUrl) || (embed ? new URL(embed.href) : null);
  if (link) {
    link.searchParams.delete("embedded");
    byId("form-link").href = link.href;
    byId("form-link").hidden = false;
    byId("form-note").hidden = false;
    byId("form-pending").hidden = true;
  }
  if (embed) {
    embed.searchParams.set("embedded", "true");
    const frame = document.createElement("iframe");
    frame.src = embed.href;
    frame.title = "Wedding invitation mailing address form";
    frame.loading = "lazy";
    byId("embed-container").append(frame);
    byId("embed-container").hidden = false;
  }
})();
