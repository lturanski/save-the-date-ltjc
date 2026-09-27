(function () {
  "use strict";
  const config = window.SAVE_THE_DATE || {};
  const byId = (id) => document.getElementById(id);
  const names = config.names || "Your Name & Your Partner";
  byId("names").textContent = names;
  document.title = `${names} · Save the date`;
  byId("location").textContent = config.location || "Location to come";
  byId("message").textContent = config.message || "Formal invitation to follow.";
  byId("date").textContent = config.dateLabel || "Wedding date to come";

  // UTC is used only to calculate date-only values; the event is all-day everywhere.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(config.date || "")
    ? new Date(`${config.date}T00:00:00Z`) : null;
  if (date && !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === config.date) {
    byId("date").textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    }).format(date);
    const compact = (value) => value.toISOString().slice(0, 10).replaceAll("-", "");
    const start = compact(date);
    const end = compact(new Date(date.valueOf() + 86400000));
    const title = `${names} — Wedding`;
    const description = config.message || "Formal invitation to follow.";
    const params = new URLSearchParams({ action: "TEMPLATE", text: title,
      dates: `${start}/${end}`, details: description, location: config.location || "" });
    byId("google-calendar").href = `https://calendar.google.com/calendar/render?${params}`;
    const escape = (value) => String(value).replaceAll("\\", "\\\\").replace(/\r?\n|\r/g, "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");
    // Fold by UTF-8 bytes so long names and emoji produce valid iCalendar lines.
    const fold = (line) => {
      let output = "", bytes = 0;
      for (const char of line) {
        const size = new TextEncoder().encode(char).length;
        if (bytes + size > 75) { output += "\r\n "; bytes = 1; }
        output += char; bytes += size;
      }
      return output;
    };
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Save the Date//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT", `UID:${start}-${encodeURIComponent(names)}@save-the-date`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${escape(title)}`,
      `LOCATION:${escape(config.location || "")}`, `DESCRIPTION:${escape(description)}`,
      "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR"].map(fold).join("\r\n") + "\r\n";
    byId("calendar-download").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    byId("calendar-actions").hidden = false;
    byId("calendar-pending").hidden = true;
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
