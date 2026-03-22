---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>

<div id="meetings"></div>

<script>\
const SHEET_ID = "1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc";\
const SHEET_NAME = "Sheet1"; // change if needed

const URL = \`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}\`;

async function loadData() {\
  try {\
    const res = await fetch(URL);\
    const data = await res.json();

    const app = document.getElementById("meetings");

    data.forEach(row => {\
      const card = document.createElement("div");\
      card.style.border = "1px solid #ccc";\
      card.style.padding = "10px";\
      card.style.margin = "10px";

      // 👇 change column names to match your sheet headers\
      card.innerHTML = \`\
        <h3>${row.Name || "No name"}</h3>\
        <p>${row.Description || ""}</p>\
      \`;

      app.appendChild(card);\
    });

  } catch (err) {\
    console.error("Error loading sheet:", err);\
  }\
}

loadData();\
</script>