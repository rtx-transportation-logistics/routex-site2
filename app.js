/* ============================================================
   RouteX Transportation — shared site logic
   Шапка, футер и AI-чат внедряются на каждую страницу из одного
   места: правишь здесь — меняется везде.
   ============================================================ */

// ===== НАСТРОЙКИ =====
// Вариант A (рекомендуется): зарегистрируйся на formspree.io и вставь
// endpoint сюда — все формы И передача чата человеку будут приходить
// на почту автоматически. Пример: 'https://formspree.io/f/abcdwxyz'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykrezpw';
const CONTACT_EMAIL = 'info@routextransportationllc.com';
const PHONE_DISPLAY = '+1 (346) 443-9457';
const PHONE_TEL = '+13464439457';

// ===== ШАПКА =====
const NAV = [
  ['index.html','Home'],
  ['services.html','Services'],
  ['drivers.html','Drivers'],
  ['about.html','About'],
  ['contact.html','Contact'],
];
const CUR = (location.pathname.split('/').pop() || 'index.html');

document.getElementById('site-header').innerHTML = `
<header id="hdr">
  <div class="container">
    <div class="nav-inner">
      <a href="index.html" class="logo">
        <div class="logo-mark">RX</div>
        <span class="logo-text">ROUTE<span class="x">X</span> <span class="logo-sub">TRANSPORTATION</span></span>
      </a>
      <nav class="desktop">
        ${NAV.map(([href,label])=>`<a class="nav-link ${CUR===href?'active':''} ${href==='drivers.html'?'':''}" href="${href}" ${href==='drivers.html'?'style="color:var(--lime);"':''}>${label}</a>`).join('')}
      </nav>
      <div class="nav-cta">
        <a class="btn-lime btn-cta display" style="display:inline-block;" href="index.html#quote">Get a Quote</a>
      </div>
      <button class="mobile-toggle" onclick="toggleMenu()" aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mmenu">
    <div class="container">
      ${NAV.map(([href,label])=>`<a class="link" style="text-transform:uppercase;font-size:14px;letter-spacing:.1em;color:${href==='drivers.html'?'var(--lime)':'rgba(255,255,255,.7)'};" href="${href}">${label}</a>`).join('')}
      <a class="btn-lime display" style="width:100%;padding:12px;text-align:center;display:block;" href="index.html#quote">Get a Quote</a>
    </div>
  </div>
</header>`;

// ===== ФУТЕР =====
document.getElementById('site-footer').innerHTML = `
<footer>
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="logo">
          <div class="logo-mark">RX</div>
          <span class="logo-text">ROUTE<span class="x">X</span> <span class="logo-sub" style="font-size:10px;">TRANSPORTATION</span></span>
        </div>
        <p>RouteX Transportation LLC — professional freight and expedite shipping services. We move freight. We move fast.</p>
      </div>
      <div>
        <h4 class="foot-h">Company</h4>
        <ul class="foot-links">
          <li><a href="about.html">About Us</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="drivers.html">Drivers — Apply</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="index.html#quote">Get a Quote</a></li>
        </ul>
      </div>
      <div>
        <h4 class="foot-h">Services</h4>
        <ul class="foot-links">
          <li><a href="services.html">Ground Expedite</a></li>
          <li><a href="services.html">Dedicated Transport</a></li>
          <li><a href="services.html">High-Value Freight</a></li>
        </ul>
      </div>
      <div>
        <h4 class="foot-h">Contact</h4>
        <div class="foot-contact"><span style="color:#C8FF00;">📞</span><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></div>
        <div class="foot-contact"><span style="color:#C8FF00;">✉</span><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div>
        <div class="foot-contact"><span style="color:#C8FF00;">📍</span><span style="color:rgba(255,255,255,.3);font-size:12px;">10060 Brecksville Rd, Brecksville, OH 44141</span></div>
      </div>
    </div>
  </div>
  <div class="foot-bottom">
    <div class="container">
      <p>© 2026 RouteX Transportation LLC. All rights reserved.</p>
      <div class="links">
        <a href="privacy-policy.html" style="color:rgba(255,255,255,.2);font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Privacy Policy</a>
        <a href="terms.html" style="color:rgba(255,255,255,.2);font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Terms &amp; Conditions</a>
      </div>
    </div>
  </div>
</footer>`;

// ===== ОБЩЕЕ =====
window.addEventListener('scroll',()=>{const h=document.getElementById('hdr');if(h)h.classList.toggle('scrolled',window.scrollY>20)},{passive:true});
function toggleMenu(){document.getElementById('mmenu').classList.toggle('open');}
let tt;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),4500);}

// ===== ФОРМЫ =====
// Каждая форма: onsubmit="return submitForm(event)" + data-subject + data-success
async function submitForm(e){
  e.preventDefault();
  const form = e.target;
  const subj = form.dataset.subject || 'Website request — RouteX';
  const okMsg = form.dataset.success || 'Request sent!';
  const data = Object.fromEntries(new FormData(form).entries());
  if (FORMSPREE_ENDPOINT) {
    try {
      const r = await fetch(FORMSPREE_ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({_subject:subj,...data})});
      if (r.ok) { toast(okMsg); form.reset(); }
      else toast(`Something went wrong. Please call us at ${PHONE_DISPLAY}.`);
    } catch { toast(`Network error. Please call us at ${PHONE_DISPLAY}.`); }
  } else {
    const body = encodeURIComponent(Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${body}`;
    toast('Opening your email app to send the request…');
    form.reset();
  }
  return false;
}

// ===== ДИНАМИЧЕСКИЕ БЛОКИ (рендерятся, если контейнер есть на странице) =====
const ICONS={
  pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  radio:'<circle cx="12" cy="12" r="2"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  dollar:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  truck:'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h-5"/><path d="M20 18h2v-5l-3.5-5H14v10h1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'
};

const ADV=[
  {stat:'48 States',title:'Nationwide Coverage',icon:'pin',desc:"Coast to coast, border to border. RouteX operates across all 48 contiguous states with cross-border capability to Canada and Mexico."},
  {stat:'<15 Min',title:'Under 15-Min Confirmation',icon:'zap',desc:"From the moment you submit a load, our dispatch team begins matching — average driver confirmation in under 15 minutes, around the clock."},
  {stat:'Always On',title:'24/7/365 Live Dispatch',icon:'radio',desc:"No voicemail. No after-hours delays. Our dispatch team is live 24 hours a day, 365 days a year — nights, weekends, and holidays included."},
  {stat:'Zero Transfers',title:'Direct, No-Stop Routing',icon:'clock',desc:"Every load moves on dedicated equipment with direct routing. No terminals, no transfers, no consolidation."},
  {stat:'Live GPS',title:'Real-Time Visibility',icon:'shield',desc:"Live GPS updates, accurate ETAs, and proactive status notifications from pickup to proof of delivery."}
];
const advEl=document.getElementById('advgrid');
if(advEl) advEl.innerHTML=ADV.map(a=>`
  <div class="adv-card"><div class="side"></div>
    <div class="badge display">${a.stat}</div>
    <div class="adv-body">
      <div class="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8FF00" stroke-width="2">${ICONS[a.icon]}</svg></div>
      <div><h3 class="card-title">${a.title}</h3><p class="card-text">${a.desc}</p></div>
    </div>
  </div>`).join('');

const FLEET=[
  {num:'01',tag:'Fastest',name:'Sprinter Van',cap:'Up to 3 skids',w:'Up to 3,500 lbs',d:"12' L × 4.4' W × 6' H",best:'Small, time-critical freight and urgent shipments'},
  {num:'02',tag:'Most Popular',name:'Small Straight Truck',cap:'4–6 skids',w:'Up to 10,000 lbs',d:"16' L × 8' W × 8' H",best:'Medium-sized freight requiring long-haul transport'},
  {num:'03',tag:'Full Capacity',name:'Large Straight Truck',cap:'Up to 12 skids',w:'Up to 26,000 lbs',d:"26' L × 8' W × 8' H",best:'High-value or specialized freight needing direct delivery'},
  {num:'04',tag:'FTL Expedite',name:'Tractor-Trailer',cap:'Full truckload',w:'Up to 44,000 lbs',d:"53' L × 8.5' W × 9' H",best:'Large-volume, time-critical full truckload shipments'}
];
const fleetEl=document.getElementById('fleetgrid');
if(fleetEl) fleetEl.innerHTML=FLEET.map(v=>`
  <div class="fleet-card"><div class="topbar"></div>
    <div class="fleet-num">${v.num}</div>
    <div class="fleet-tag">${v.tag}</div>
    <h3 class="fleet-h">${v.name}</h3>
    <div class="spec"><span class="k">Capacity</span><span class="v">${v.cap}</span></div>
    <div class="spec"><span class="k">Max Weight</span><span class="v">${v.w}</span></div>
    <div class="spec"><span class="k">Dimensions</span><span class="v">${v.d}</span></div>
    <div class="bestfor"><span class="bk">Best For</span><p>${v.best}</p></div>
  </div>`).join('');

const IND=[
  {t:'Trade Shows & Exhibits',d:'Exhibit materials, displays, and time-sensitive event freight delivered on your show schedule.'},
  {t:'Automotive & EV',d:'Automotive parts, EV components, and production-critical materials keeping assembly lines moving.'},
  {t:'Life Sciences & Pharma',d:'Medical devices, pharmaceuticals, and temperature-sensitive healthcare freight with full compliance.'},
  {t:'Aerospace & Manufacturing',d:'High-value aircraft parts, machinery, and precision components requiring careful, direct handling.'},
  {t:'Corporate & Tech',d:'High-value electronics, IT equipment, server hardware, and corporate assets moved securely.'},
  {t:'Construction & Engineering',d:'Construction equipment, tools, and project-specific materials delivered to job sites on time.'},
  {t:'Military & Government',d:'Secure, regulated government freight and controlled equipment with full chain-of-custody.'},
  {t:'General Manufacturing',d:"Finished goods, components, and palletized freight for manufacturers who can't afford downtime."}
];
const indEl=document.getElementById('indgrid');
if(indEl) indEl.innerHTML=IND.map((x,i)=>`
  <div class="ind-card"><div class="topbar"></div>
    <div class="ind-idx">${String(i+1).padStart(2,'0')}</div>
    <h3 class="ind-h">${x.t}</h3>
    <p class="t">${x.d}</p>
  </div>`).join('');

// ===== AI-ЧАТ (на всех страницах) =====
document.body.insertAdjacentHTML('beforeend', `
<button class="chat-fab" id="chatFab" onclick="toggleChat()" aria-label="Chat with us">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
</button>
<div class="chat-panel" id="chatPanel">
  <div class="chat-head">
    <div class="t">
      <div class="dot"></div>
      <div>
        <div class="nm display">RouteX <span style="color:var(--lime)">Assistant</span></div>
        <div class="st">AI dispatch helper · online 24/7</div>
      </div>
    </div>
    <button onclick="toggleChat()" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="chat-msgs" id="chatMsgs">
    <div class="msg ai">Hi! I'm the RouteX AI assistant. Ask me about our expedite services, fleet, coverage, or driver opportunities. Need a person? Tap "Talk to a human" below. 🚚</div>
  </div>
  <div class="chat-input">
    <input id="chatText" type="text" placeholder="Type your question..." maxlength="500" onkeydown="if(event.key==='Enter')sendChat()" />
    <button id="chatSend" class="display" onclick="sendChat()">Send</button>
  </div>
  <button class="handoff-btn" onclick="toggleHandoff()">👤 Talk to a human</button>
  <div class="handoff-form" id="handoffForm">
    <p class="hint">Leave your contact — a live dispatcher will reach out shortly. Your chat history will be attached.</p>
    <input id="hoName" type="text" placeholder="Your name *" maxlength="80" />
    <input id="hoContact" type="text" placeholder="Phone or email *" maxlength="120" />
    <button class="btn-lime display" style="padding:10px;" onclick="sendHandoff()">Request a callback</button>
  </div>
</div>
<div id="toast"></div>`);

const chatHistory = [];
function toggleChat(){
  const p = document.getElementById('chatPanel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) document.getElementById('chatText').focus();
}
function toggleHandoff(){ document.getElementById('handoffForm').classList.toggle('open'); }
function addMsg(role, text, typing){
  const box = document.getElementById('chatMsgs');
  const div = document.createElement('div');
  div.className = 'msg ' + (role==='user'?'me':'ai') + (typing?' typing':'');
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
async function sendChat(){
  const input = document.getElementById('chatText');
  const btn = document.getElementById('chatSend');
  const text = input.value.trim();
  if (!text || btn.disabled) return;
  input.value=''; btn.disabled = true;
  addMsg('user', text);
  chatHistory.push({role:'user', content:text});
  const typingEl = addMsg('ai','Typing…',true);
  try {
    const r = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ messages: chatHistory.slice(-12) })
    });
    if (!r.ok) throw new Error('api');
    const data = await r.json();
    const reply = data.reply || `Sorry, something went wrong. Please call ${PHONE_DISPLAY}.`;
    typingEl.remove();
    addMsg('ai', reply);
    chatHistory.push({role:'assistant', content:reply});
  } catch {
    typingEl.remove();
    addMsg('ai', `AI chat is not connected yet — it activates after deployment with an API key (see README). Meanwhile, call us 24/7 at ${PHONE_DISPLAY}, or tap "Talk to a human" to request a callback.`);
  } finally {
    btn.disabled = false; input.focus();
  }
}
// Передача человеку: контакты + вся переписка уходят на email
async function sendHandoff(){
  const name = document.getElementById('hoName').value.trim();
  const contact = document.getElementById('hoContact').value.trim();
  if (!name || !contact) { toast('Please enter your name and phone/email.'); return; }
  const transcript = chatHistory.map(m=>(m.role==='user'?'Visitor: ':'AI: ')+m.content).join('\n') || '(no messages yet)';
  const payload = { form_type:'Chat handoff — human requested', name, contact, page: location.href, transcript };
  const subj = 'CHAT HANDOFF — visitor wants a human';
  if (FORMSPREE_ENDPOINT) {
    try {
      const r = await fetch(FORMSPREE_ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({_subject:subj,...payload})});
      if (!r.ok) throw new Error();
    } catch { toast(`Network error. Please call ${PHONE_DISPLAY}.`); return; }
  } else {
    const body = encodeURIComponent(Object.entries(payload).map(([k,v])=>`${k}: ${v}`).join('\n'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${body}`;
  }
  document.getElementById('handoffForm').classList.remove('open');
  document.getElementById('hoName').value=''; document.getElementById('hoContact').value='';
  addMsg('ai', `Thanks, ${name}! Your request and chat history were sent to our team. A live dispatcher will contact you shortly. For urgent loads, call ${PHONE_DISPLAY} right now.`);
}
