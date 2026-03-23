// ================= INIT CONTAINER =================
document.body.insertAdjacentHTML("afterbegin", `
  <div id="meeting-widget">
    <h2>Meetings</h2>
    <div class="tabs">
      <button id="tab-tribe">Tribe Meetings</button>
      <button id="tab-aca">Other ACA Meetings</button>
    </div>
    <div id="app"></div>
  </div>
`);

// ================= INJECT STYLES =================
const style = document.createElement("style");
style.innerHTML = `
#meeting-widget {
  font-family: Arial;
  max-width: 1000px;
  margin: 20px auto;
}

.tabs button {
  padding:10px 16px;
  margin-right:10px;
  border:none;
  background:#eee;
  cursor:pointer;
  border-radius:8px;
}
.tabs button.active { background:#007bff; color:white; }

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

.badges { display:flex; gap:6px; margin:6px 0; }

.badge {
  padding:4px 8px;
  font-size:12px;
  border-radius:6px;
}

.online { background:#e7f1ff; color:#007bff; }
.phone { background:#fff4e5; color:#d98200; }
.inperson { background:#e8f8f0; color:#1c7c54; }

.btn {
  display:inline-block;
  margin-top:10px;
  padding:10px;
  background:#007bff;
  color:white;
  border-radius:8px;
  text-decoration:none;
}

.loader {
  display:flex;
  justify-content:center;
  padding:40px;
}

.spinner {
  width:40px;height:40px;
  border:4px solid #ddd;
  border-top:4px solid #007bff;
  border-radius:50%;
  animation:spin 1s linear infinite;
}

@keyframes spin { 100%{transform:rotate(360deg);} }
`;
document.head.appendChild(style);

// ================= CONFIG =================
const app = document.getElementById("app");

const SHEET_URL = "https://opensheet.elk.sh/1ft7eIPFohcfdsEKpcEesLNj3tGU1gyKVOVd8Mmb0tLc/Sheet1";

const ACA_BODY = `{
  "page": 1,
  "countryFromIP": "",
  "m_type": ["all", "meeting", "online", "telephone"],
  "Timezone": "America/New_York",
  "LangValue": "",
  "SearchText": "",
  "Country": "",
  "State": "",
  "searchLocation": "",
  "radius": 30,
  "I_GID": "",
  "R_GID": "",
  "showEditLink": false
}`;

// ================= UI =================
function setActive(tab){
  document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));
  document.getElementById("tab-"+tab).classList.add("active");
}

function loader(){
  app.innerHTML=`<div class="loader"><div class="spinner"></div></div>`;
}

// ================= HELPERS =================
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function parseTime24(t){
  const d=new Date(`1970-01-01 ${t}`);
  return isNaN(d)?null:d.toISOString().substring(11,16);
}

function nextDate(day,time){
  if(!day||!time) return null;
  const now=new Date();
  const [h,m]=time.split(":").map(Number);

  const d=new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    h,m
  ));

  let diff=DAYS.indexOf(day)-d.getUTCDay();
  if(diff<0||(diff===0&&d<=now)) diff+=7;
  d.setUTCDate(d.getUTCDate()+diff);
  return d;
}

function format(date){
  const parts=new Intl.DateTimeFormat(undefined,{
    weekday:"long",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
    timeZoneName:"short"
  }).formatToParts(date);

  const g=t=>parts.find(p=>p.type===t)?.value;
  return `${g("weekday")} ${g("hour")}:${g("minute")} (${g("timeZoneName")})`;
}

function stripHTML(html){
  return html.replace(/<[^>]+>/g," ");
}

function extractPhone(text){
  return text.match(/(\+?\d[\d\s\-()]{7,}\d)/)?.[1];
}

function extractEmail(text){
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

// ================= RENDER =================
function render(list){
  list.sort((a,b)=>a.date - b.date);
  app.innerHTML="";

  list.forEach(m=>{
    const el=document.createElement("div");
    el.className="card";

    let actions = "";

    if (m.link) {
      actions += `<a href="${m.link}" target="_blank" class="btn">Join Meeting</a>`;
    } else if (m.email) {
      actions += `<a href="mailto:${m.email}" class="btn">Email Organiser</a>`;
    }

    if (m.phone) {
      actions += `<div>☎ ${m.phone}</div>`;
    }

    if (m.address) {
      actions += `<div>📍 ${m.address}</div>`;
    }

    el.innerHTML=`
      <div>${m.title}</div>
      <div>${m.time}</div>
      <div class="badges">
        <div class="badge ${m.type}">${m.type}</div>
      </div>
      ${actions}
    `;

    app.appendChild(el);
  });
}

// ================= DATA LOADERS =================
async function loadTribe(){
  setActive("tribe");
  loader();

  const res=await fetch(SHEET_URL);
  const data=await res.json();

  const list=data.map(r=>{
    const d=nextDate(r.Day, parseTime24(r["Time (GMT)"]));
    const isOnline = (r["Meeting Format"]||"").toLowerCase().includes("zoom");

    return {
      title:r["Meeting Name"],
      time:format(d),
      date:d,
      link: isOnline ? r["Meeting URL"] : null,
      address: !isOnline ? r.Address : null,
      type: isOnline ? "online" : "inperson"
    };
  });

  render(list);
}

async function loadACA(){
  setActive("aca");
  loader();

  const res=await fetch(
    "https://adultchildren.org/wp-json/wsom/v1/meeting-search",
    {
      method:"POST",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body: ACA_BODY
    }
  );

  const json=await res.json();

  const list=(json.results||[]).map(m=>{
    const d=nextDate(DAYS[m.DayCode], parseTime24(m.Time_Local));
    const text=stripHTML([m.Location,m.Notes].join(" "));

    return {
      title:m.MeetName,
      time:format(d),
      date:d,
      link: text.match(/https?:\/\/[^\s]+/)?.[0],
      email: extractEmail(text),
      phone: extractPhone(text),
      address:[m.Address,m.City,m.Country].filter(Boolean).join(", "),
      type:m.m_type
    };
  });

  render(list);
}

// ================= EVENTS =================
document.getElementById("tab-tribe").onclick = loadTribe;
document.getElementById("tab-aca").onclick = loadACA;

// ================= INIT =================
loadTribe();
