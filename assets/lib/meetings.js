// ================= CONFIG =================
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
const app = document.getElementById("app");

function setActive(tab){
  document.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
  document.getElementById("tab-"+tab).classList.add("active");
}

function loader(){
  app.innerHTML=`<div class="loader"><div class="spinner"></div></div>`;
}

// ================= TIME =================
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

// ================= HELPERS =================
function stripHTML(html){
  return html.replace(/<[^>]+>/g," ");
}

function extractPhoneDetails(text){
  const phoneMatch = text.match(/(\+?\d[\d\s\-()]{7,}\d)/);
  const codeMatch = text.match(/(code|pass|pin|access code)[:\s]*([\d#]+)/i);

  return {
    phone: phoneMatch?.[1],
    code: codeMatch?.[2]
  };
}

function extractEmail(text){
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function getTypeClass(type){
  if (!type) return "inperson";
  if (type.includes("online")) return "online";
  if (type.includes("telephone")) return "phone";
  return "inperson";
}

// ================= RENDER =================
function render(list){

  list.sort((a,b)=>a.date - b.date);

  app.innerHTML="";

  list.forEach(m=>{
    const el=document.createElement("div");
    el.className="card";

    const typeClass = getTypeClass((m.type||"").toLowerCase());

    let actions = "";

    if (m.link) {
      actions += `<a href="${m.link}" target="_blank" class="btn">Join Meeting</a>`;
    }
    else if (m.email) {
      actions += `<a href="mailto:${m.email}" class="btn">Email Organiser for Meeting Link</a>`;
    }

    if (m.phone) {
      actions += `<div class="section">☎ ${m.phone} ${m.code ? `(Code: ${m.code})` : ""}</div>`;
    }

    if (m.address) {
      actions += `<div class="section">📍 ${m.address}</div>`;
    }

    el.innerHTML=`
      <div class="title">${m.title}</div>
      <div class="meta">${m.time}</div>

      <div class="badges">
        <div class="badge ${typeClass}">${m.type || "in-person"}</div>
        ${m.openClosed ? `<div class="badge ${m.openClosed==="Open"?"open":"closed"}">${m.openClosed}</div>` : ""}
      </div>

      ${actions}
    `;

    app.appendChild(el);
  });
}

// ================= TRIBE =================
async function loadTribe(){
  setActive("tribe");
  loader();

  const res=await fetch(SHEET_URL);
  const data=await res.json();

  const list=data.map(r=>{
    const d=nextDate(r.Day, parseTime24(r["Time (GMT)"]));

    const formatText = (r["Meeting Format"] || "").toLowerCase();

    let type = "in-person";
    let isOnline = false;

    if (formatText.includes("zoom")) {
      type = "online";
      isOnline = true;
    } else if (formatText.includes("phone")) {
      type = "telephone";
    }

    return {
      title:r["Meeting Name"],
      time:format(d),
      date:d,
      link: isOnline ? r["Meeting URL"] : null,
      address: !isOnline ? r.Address : null,
      type
    };
  });

  render(list);
}

// ================= ACA =================
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
    const day=DAYS[parseInt(m.DayCode)];
    const time=parseTime24(m.Time_Local);
    const d=nextDate(day,time);

    const text=stripHTML([m.Location,m.Notes].join(" "));

    const { phone, code } = extractPhoneDetails(text);
    const email = extractEmail(text);
    const link = (text.match(/https?:\/\/[^\s]+/)||[])[0];

    return {
      title:m.MeetName,
      time:format(d),
      date:d,
      link,
      email,
      phone,
      code,
      address:[m.Address,m.City,m.Country].filter(Boolean).join(", "),
      type:m.m_type,
      openClosed:m.OpenClosed === "O" ? "Open" : "Closed"
    };
  });

  render(list);
}

// ================= INIT =================
loadTribe();

function showTab(t){
  if(t==="tribe") loadTribe();
  if(t==="aca") loadACA();
}
