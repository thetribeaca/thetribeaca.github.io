---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone:</p>

<script>

const SHARE_ID = "shrBSJGAVD8dwmzoX";

async function loadMeetings() {\
  const url = \`https://airtable.com/v0.3/view/${SHARE_ID}?pageSize=100\`;

  const res = await fetch(url);\
  const data = await res.json();

  const container = document.getElementById("meetings");\
  container.innerHTML = "";

  // Map column IDs → names\
  const columnMap = {};\
  data.columns.forEach(col => {\
    columnMap\[col.id\] = col.name;\
  });

  // Extract meetings\
  const meetings = data.records.map(record => {\
    const cells = record.cellValuesByColumnId;

    let dateValue = null;

    for (const colId in cells) {\
      const name = columnMap\[colId\].toLowerCase();

      // 👇 THIS matches your Airtable structure\
      if (name.includes("time") || name.includes("date")) {\
        dateValue = cells\[colId\];\
        break;\
      }\
    }

    if (!dateValue) return null;

    const date = new Date(dateValue);\
    if (isNaN(date)) return null;

    return date;\
  })\
  .filter(Boolean)\
  .sort((a, b) => a - b); // sort upcoming first

  // Render\
  meetings.forEach(date => {\
    const formatted = new Intl.DateTimeFormat(undefined, {\
      weekday: "long",\
      month: "long",\
      day: "numeric",\
      hour: "2-digit",\
      minute: "2-digit",\
    }).format(date);

    const el = document.createElement("div");\
    el.textContent = formatted;

    container.appendChild(el);\
  });\
}

loadMeetings();

</script>