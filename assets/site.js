/* ============ FLEXILYTICS — shared site scripts ============ */

window.__ambientMode = 'on';
window.__motionMode = 'calm';

/* nav scroll state */
(function nav(){
  const el = document.getElementById('topbar');
  if(!el) return;
  addEventListener('scroll', () => el.classList.toggle('scrolled', scrollY > 8));
})();

/* reveal on intersection (with fallback for sandbox/iframe contexts where IO can stall) */
(function reveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), {threshold:.12});
  els.forEach(el => io.observe(el));
  // Fallback: any .reveal already in (or near) the viewport after 400ms gets shown unconditionally.
  setTimeout(() => {
    const vh = window.innerHeight || 800;
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh + 200 && r.bottom > -200) {
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  }, 400);
  // Safety net: after 2s, reveal everything remaining (no design should stay hidden indefinitely).
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 2000);
})();

/* ambient canvas — drifting dot field (page-wide) */
(function ambient(){
  const c = document.getElementById('ambient');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, dots = [], DPR = Math.min(2, devicePixelRatio || 1);
  function size(){
    w = c.width = innerWidth * DPR;
    h = c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
  }
  function seed(){
    const N = Math.round(innerWidth * innerHeight / 9500);
    dots = [];
    for(let i=0;i<N;i++){
      dots.push({
        x: Math.random()*w, y: Math.random()*h,
        r: (Math.random()*1.2 + 0.3) * DPR,
        vx: (Math.random()-.5) * 0.15 * DPR,
        vy: (Math.random()-.5) * 0.15 * DPR,
        o: Math.random()*0.5 + 0.1,
        tw: Math.random()*Math.PI*2
      });
    }
  }
  size(); seed();
  addEventListener('resize', () => { size(); seed(); });

  let mx = 0.5, my = 0.5, sy0 = 0;
  addEventListener('mousemove', e => { mx = e.clientX/innerWidth; my = e.clientY/innerHeight; });
  addEventListener('scroll', () => { sy0 = scrollY; });

  function frame(){
    if(window.__ambientMode === 'off'){ ctx.clearRect(0,0,w,h); requestAnimationFrame(frame); return; }
    ctx.clearRect(0,0,w,h);
    const speed = window.__motionMode === 'calm' ? 0.4 : window.__motionMode === 'flow' ? 1 : 1.6;
    const ox = (mx - 0.5) * 40 * DPR;
    const oy = (my - 0.5) * 40 * DPR;
    for(const d of dots){
      d.x += d.vx * speed; d.y += d.vy * speed; d.tw += 0.015 * speed;
      if(d.x < 0) d.x = w; if(d.x > w) d.x = 0;
      if(d.y < 0) d.y = h; if(d.y > h) d.y = 0;
      const tw = 0.6 + Math.sin(d.tw)*0.4;
      ctx.fillStyle = `rgba(143,188,255,${d.o*tw})`;
      ctx.beginPath();
      ctx.arc(d.x + ox*d.o - sy0*0.1*d.o*DPR*0.1, d.y + oy*d.o, d.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* tweaks panel — site-wide */
(function tweaks(){
  const tw = document.getElementById('tweaks');
  if(!tw) return;
  function syncSeg(id, v){ document.querySelectorAll('#'+id+' button').forEach(b => b.classList.toggle('active', b.dataset.v === v)); }
  function persist(){ try { parent && parent.postMessage({type:'__edit_mode_set_keys', edits:{motion:window.__motionMode, ambient:window.__ambientMode}}, '*'); } catch(e){} }
  const ms = document.getElementById('motionSeg');
  const as = document.getElementById('ambientSeg');
  if(ms) ms.addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; window.__motionMode = b.dataset.v; syncSeg('motionSeg', window.__motionMode); persist(); });
  if(as) as.addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; window.__ambientMode = b.dataset.v; syncSeg('ambientSeg', window.__ambientMode); persist(); });
  if(ms) syncSeg('motionSeg', window.__motionMode);
  if(as) syncSeg('ambientSeg', window.__ambientMode);

  addEventListener('message', ev => {
    const d = ev.data || {};
    if(d.type === '__activate_edit_mode') tw.classList.add('open');
    if(d.type === '__deactivate_edit_mode') tw.classList.remove('open');
  });
  const closeBtn = document.getElementById('tweaksClose');
  if(closeBtn) closeBtn.addEventListener('click', () => { tw.classList.remove('open'); try { parent && parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e){} });
  try { parent && parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
})();
