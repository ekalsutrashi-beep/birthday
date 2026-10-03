(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const state = { day: '', time: '' };
  const fx = $('#fx');
  const rnd = (a, b) => a + Math.random() * (b - a);

  // page navigation
  function go(id) {
    $$('.page').forEach(p => p.classList.toggle('active', p.id === id));
    document.body.classList.toggle('celebrate', id === 'p2');
    window.scrollTo(0, 0);
    if (id === 'p2') burst(30);
  }
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  // confetti / hearts / sparkles (clipped inside fixed .fx layer)
  function burst(n = 60) {
    const bits = ['🎉', '❤️', '💖', '✨', '🎈', '🌸', '💜'];
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i');
      e.textContent = bits[i % bits.length];
      e.style.left = rnd(2, 94) + '%';
      e.style.fontSize = rnd(16, 30) + 'px';
      e.style.setProperty('--dx', rnd(-40, 40) + 'px');
      e.style.animationDuration = rnd(2.5, 4.5) + 's';
      e.style.animationDelay = rnd(0, 0.8) + 's';
      fx.appendChild(e);
      setTimeout(() => e.remove(), 5500);
    }
  }

  // ambient floating hearts + balloons
  const bg = $('#bgFloat');
  ['💗', '✨', '💜', '🤍', '💖'].forEach((h, k) => {
    for (let i = 0; i < 3; i++) {
      const e = document.createElement('i');
      e.textContent = h;
      e.style.left = rnd(0, 92) + '%';
      e.style.fontSize = rnd(14, 26) + 'px';
      e.style.animationDuration = rnd(14, 26) + 's';
      e.style.animationDelay = -rnd(0, 20) + 's';
      bg.appendChild(e);
    }
  });
  const cols = ['#f48fb9', '#c9a8f5', '#f9c6dc', '#b9a2f0'];
  for (let i = 0; i < 8; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.background = cols[i % 4];
    // keep balloons in the outer edges so they never cover content
    b.style.setProperty('--s', (innerWidth < 600 ? rnd(30, 45) : rnd(40, 65)) + 'px');
    b.style[i % 2 ? 'right' : 'left'] = rnd(0, 3) + '%';
    b.style.animationDuration = rnd(16, 28) + 's';
    b.style.animationDelay = -rnd(0, 20) + 's';
    $('#balloons').appendChild(b);
  }

  // cake
  const cake = $('#cake');
  cake.addEventListener('click', () => {
    cake.classList.remove('pop'); void cake.offsetWidth; cake.classList.add('pop');
    burst(60);
  });

  // memory polaroids: tap to lift on touch
  $$('.memories .polaroid').forEach(p => p.addEventListener('click', () => p.classList.toggle('up')));

  // NO button: moves inside viewport with 10px margin
  const no = $('#no'), noMsg = $('#noMsg'), sad = $('#sad');
  const lines = ['Are you sure? 🥺', 'Think again 😭', 'Really? 😂', 'Nice try 😜', 'Party se bach nahi sakti! 🎂'];
  const faces = ['🥺', '😭', '💔', '😢'];
  let tries = 0, ox = 0, oy = 0;
  function dodge(e) {
    if (e) e.preventDefault();
    sad.textContent = faces[tries % faces.length];
    noMsg.textContent = lines[Math.min(tries, lines.length - 1)];
    tries++;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight, m = 10;
    const max = vw < 600 ? rnd(60, 90) : rnd(120, 180);
    const r = no.getBoundingClientRect();
    const bx = r.left - ox, by = r.top - oy; // resting position
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    let nx = clamp(rnd(-max, max), m - bx, vw - m - r.width - bx);
    let ny = clamp(rnd(-max, max), m - by, vh - m - r.height - by);
    ox = nx; oy = ny;
    no.style.transform = `translate(${nx}px,${ny}px)`;
  }
  no.addEventListener('pointerdown', dodge);
  no.addEventListener('click', e => e.preventDefault());
  no.addEventListener('mouseenter', () => { if (tries > 0 && matchMedia('(hover:hover)').matches) dodge(); });
  window.addEventListener('resize', () => { ox = oy = 0; no.style.transform = ''; });

  // YES
  $('#yes').addEventListener('click', () => {
    burst(90);
    $('#yay').textContent = "YAY! I knew you'd say YES! 😂💖";
    no.style.visibility = 'hidden';
    setTimeout(() => go('p4'), 2200);
  });

  // day + time
  $$('[data-day]').forEach(b => b.addEventListener('click', () => { state.day = b.dataset.day; go('p5'); }));
  $$('[data-time]').forEach(b => b.addEventListener('click', () => {
    state.time = b.dataset.time;
    $('#outDay').textContent = state.day || 'Same Day';
    $('#outTime').textContent = state.time;
    go('p6'); burst(80);
  }));

  // copy
  $('#copy').addEventListener('click', async () => {
    const text = `Birthday Celebration 🎂\nBirthday Girl: Iqra Mam\nCelebration: Yes\nDay: ${state.day || 'Same Day'}\nTime: ${state.time}`;
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    $('#copied').textContent = 'Copied! Now send it to me 💌';
  });
})();
