---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>
<p style="color:#ccc; font-size: 9px;">Meetings Finder 0.2</p>
<div id="app"></div>

<script>
const SHEET_ID = "1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc";
const SHEET_NAME = "Sheet1"; // change if needed

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// --- Helpers ---
const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

function getNextOccurrence(dayName, timeString) {
  if (!dayName || !timeString) return null;

  const now = new Date();
  const targetDayIndex = DAYS.indexOf(dayName.trim());

  if (targetDayIndex === -1) {
    console.warn("Invalid day:", dayName);
    return null;
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn("Invalid time:", timeString);
    return null;
  }

  // Create base UTC date for today at given time
  const result = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hours,
    minutes
  ));

  const currentDay = result.getUTCDay();
  let diff = targetDayIndex - currentDay;

  // If it's earlier today or already passed → next week
  if (diff < 0 || (diff === 0 && result <= now)) {
    diff += 7;
  }

  result.setUTCDate(result.getUTCDate() + diff);

  return result;
}

function formatLocalMeeting(day, time) {
  const date = getNextOccurrence(day, time);
  if (!date) return "Invalid date";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

// --- Main ---
async function loadData() {
  try {
    const res = await fetch(URL);
    const data = await res.json();

    const app = document.getElementById("app");
    app.innerHTML = "";

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    data.forEach(row => {
      const card = document.createElement("div");

      // Basic styling
      card.style.border = "1px solid #ccc";
      card.style.padding = "12px";
      card.style.margin = "10px 0";
      card.style.borderRadius = "8px";

      // 👇 adjust these to match your sheet column names
      const title = row.Title || row.Name || "Meeting";
      const day = row.Day;
      const time = row.Time;

      const localTime = formatLocalMeeting(day, time);

      card.innerHTML = `
        <h3 style="margin:0 0 8px 0;">${title}</h3>
        <p style="margin:0;">
          <strong>When:</strong> ${localTime}
        </p>
        <p style="margin:4px 0 0 0; font-size:12px; color:#666;">
          (${timezone})
        </p>
      `;

      app.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading sheet:", err);
  }
}

loadData();
</script>