---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>\
<p style="color:#ccc; font-size: 9px;">Meetings Finder 0.1</p>\
<div id="meetings"></div>

<script>
const SHEET_ID="1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc",SHEET_NAME="Sheet1",URL=`https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;function formatLocalDateTime(e){const t=new Date(e);return new Intl.DateTimeFormat(void 0,{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(t)}async function loadData(){try{const e=await fetch(URL),t=await e.json(),n=document.getElementById("meetings");t.forEach(e=>{const t=document.createElement("div");t.style.border="1px solid #ccc",t.style.padding="10px",t.style.margin="10px";const o=formatLocalDateTime(e.DateTime);t.innerHTML=`\n        <h3>${e.Title||"Untitled meeting"}</h3>\n        <p><strong>When:</strong> ${o}</p>\n      `,n.appendChild(t)})}catch(e){console.error("Error loading sheet:",e)}}loadData();
</script>