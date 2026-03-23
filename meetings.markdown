---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>
<p style="color:#ccc; font-size: 9px;">Meetings Finder 0.5</p>
<div id="app"></div>
<style>
.timezone { color: #aaa }
</style>

<script>
// Use the ID of the Google Sheet of The Tribe Meetings
const SHEET_ID = "1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc";
const SHEET_NAME = "Sheet1";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// --- Helpers ---
const DAYS_MAP = {
sun: 0, sunday: 0,
mon: 1, monday: 1,
tue: 2, tuesday: 2,
wed: 3, wednesday: 3,
thu: 4, thursday: 4,
fri: 5, friday: 5,
sat: 6, saturday: 6
};

function parseTime(time) {
if (!time) return null;

const clean = time.toString().trim().replace(".", ":");
const parts = clean.split(":");

const hours = parseInt(parts\[0\], 10);
const minutes = parts\[1\] ? parseInt(parts\[1\], 10) : 0;

if (isNaN(hours) || isNaN(minutes)) return null;

return { hours, minutes };
}

function getNextOccurrence(dayInput, timeInput) {
if (!dayInput || !timeInput) return null;

const now = new Date();
const dayKey = dayInput.toString().trim().toLowerCase();
const targetDay = DAYS_MAP\[dayKey\];

if (targetDay === undefined) return null;

const parsedTime = parseTime(timeInput);
if (!parsedTime) return null;

const { hours, minutes } = parsedTime;

const result = new Date(Date.UTC(
now.getUTCFullYear(),
now.getUTCMonth(),
now.getUTCDate(),
hours,
minutes
\));

const currentDay = result.getUTCDay();
let diff = targetDay - currentDay;

if (diff < 0 || (diff === 0 && result <= now)) {
diff \+= 7;
}

result.setUTCDate(result.getUTCDate() \+ diff);

return result;
}

function formatLocalMeeting(day, time) {
  const date = getNextOccurrence(day, time);
  if (!date) return "Check data";

  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });

  const parts = formatter.formatToParts(date);

  const weekday = parts.find(p => p.type === "weekday")?.value;
  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;
  const tz = parts.find(p => p.type === "timeZoneName")?.value;

  return `${weekday} ${hour}:${minute} (${tz})`;
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
    
      // Styling
      card.style.border = "1px solid #ccc";
      card.style.padding = "12px";
      card.style.margin = "10px 0";
      card.style.borderRadius = "8px";
    
      // --- Data mapping ---
      const title = row["Meeting Name"] || "Meeting";
      const day = row.Day;
      const time = row["Time (GMT)"];
      const meetingType = row["Meeting Type"];
      const format = row["Meeting Format"];
      const meetingURL = row["Meeting URL"];
      const address = row.Address;
    
      const localTime = formatLocalMeeting(day, time);
    
      // --- Conditional UI ---
      let locationHTML = "";
    
      if (format && format.toLowerCase().includes("zoom")) {
        locationHTML = `
          <a href="${meetingURL}" target="_blank"
             style="
               display:inline-block;
               margin-top:10px;
               padding:8px 12px;
               background:#007bff;
               color:white;
               text-decoration:none;
               border-radius:6px;
               font-size:14px;
             ">
            Join Meeting
          </a>
        `;
      } else {
        locationHTML = `
          <p style="margin-top:8px;">
            📍 ${address || ""}
          </p>
        `;
      }
    
      // --- Render ---
      card.innerHTML = `
        <h3 style="margin:0 0 6px 0;">${title}</h3>
        <p style="margin:0;"><strong>When:</strong> ${localTime}  <span class="timezone">(${timezone} time)</span></p>
        <p style="margin:4px 0;"><strong>Type:</strong> ${meetingType}</p>
        <p style="margin:4px 0;"><strong>Format:</strong> ${format}</p>
        ${locationHTML}
        <p style="margin:6px 0 0 0; font-size:12px; color:#666;">
         
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