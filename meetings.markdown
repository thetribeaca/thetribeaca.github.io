---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>\
<p style="color:#ccc; font-size: 9px;">Meetings Finder 0.1</p>\
<div id="meetings"></div>

<script>
// Points to the Google Sheet containing meetings list
// https://docs.google.com/spreadsheets/d/1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc/edit?usp=sharing

const SHEET_ID = "1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc";
const SHEET_NAME = "Sheet1";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

function formatLocalDateTime(dateString) {
const date = new Date(dateString);

return new Intl.DateTimeFormat(undefined, {
weekday: "long",
year: "numeric",
month: "long",
day: "numeric",
hour: "2-digit",
minute: "2-digit"
}).format(date);
}

async function loadData() {
try {
const res = await fetch(URL);
const data = await res.json();

    const app = document.getElementById("meetings");
    
    data.forEach(row => {
      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.margin = "10px";
    
      // 👇 change "DateTime" to your actual column name
      const localTime = formatLocalDateTime(row.DateTime);
    
      card.innerHTML = `
        <h3>${row.Title || "Untitled meeting"}</h3>
        <p><strong>When:</strong> ${localTime}</p>
      `;
    
      app.appendChild(card);
    });

} catch (err) {
console.error("Error loading sheet:", err);
}
}

loadData();
</script>