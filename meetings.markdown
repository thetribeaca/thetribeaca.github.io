---
title: Meetings
date: 2026-03-22 20:44:00 Z
---

<p>Here are upcoming meetings in your local time zone: </p>
<style>
.tabs button {
  padding:10px 16px;
  margin-right:10px;
  border:none;
  background:#eee;
  cursor:pointer;
  border-radius:8px;
}
.tabs button.active { background:#007bff; color:white; }

.filters { margin:10px 0; display:flex; gap:10px; }

select { padding:8px; border-radius:6px; }

#app {
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:16px;
}

.card {
  background:white;
  border-radius:12px;
  padding:16px;
  box-shadow:0 2px 6px rgba(0,0,0,0.08);
}

.title { font-weight:600; }
.meta { font-size:13px; color:#555; }

.badges { display:flex; gap:6px; margin:6px 0; }

.badge {
  padding:4px 8px;
  font-size:12px;
  border-radius:6px;
}

.online { background:#e7f1ff; color:#007bff; }
.phone { background:#fff4e5; color:#d98200; }
.inperson { background:#e8f8f0; color:#1c7c54; }

.open { background:#e8f8f0; color:#1c7c54; }
.closed { background:#fdecea; color:#c0392b; }

.meeting-btn {
  display:inline-block;
  margin-top:10px;
  padding:10px;
  background:#007bff;
  color:white;
  border-radius:8px;
  text-decoration:none;
}

.section { margin-top:6px; }

.loader { display:flex; justify-content:center; padding:40px; }

.spinner {
  width:40px;height:40px;
  border:4px solid #ddd;
  border-top:4px solid #007bff;
  border-radius:50%;
  animation:spin 1s linear infinite;
}

@keyframes spin { 100%{transform:rotate(360deg);} }
</style>
<div class="tabs">
  <button id="tab-tribe" onclick="showTab('tribe')">Tribe Meetings</button>
  <button id="tab-aca" onclick="showTab('aca')">Other ACA Meetings</button>
</div>

<div id="app"></div>
<script src="/assets/lib/meetings.js"></script>
<p style="color:#ccc; font-size: 9px;">Meetings Finder 0.5</p>
