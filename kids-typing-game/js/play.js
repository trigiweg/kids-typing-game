(function () {
  var G = (window.Game = window.Game || {});
  var K = G.keymap;
  var R = G.rules;

  var ctx = null;

  // 簡單音效：不載入任何音檔，用 Web Audio 產生短音
  function beep(freq, ms, type, vol) {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
      }
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.value = vol || 0.06;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      o.stop(ctx.currentTime + ms / 1000);
    } catch (e) { /* 沒有音效也能玩 */ }
  }

  var SOUND = {
    correct: function () { beep(660, 80, 'triangle'); },
    clear: function () { beep(880, 90, 'triangle'); setTimeout(function () { beep(1175, 120, 'triangle'); }, 80); },
    wrong: function () { beep(200, 120, 'sine', 0.04); },
    miss: function () { beep(160, 200, 'sine', 0.04); },
    win: function () { [660, 784, 988, 1319].forEach(function (f, i) { setTimeout(function () { beep(f, 160, 'triangle'); }, i * 120); }); }
  };

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';

  var st = null;

  function $(id) { return document.getElementById(id); }

  function areaSize() {
    var a = $('play-area');
    return { w: a.clientWidth, h: a.clientHeight };
  }

  function buildCard(card, mode, colorIndex) {
    var el = document.createElement('div');
    el.className = 'card c' + (colorIndex % 3);
    var chars = document.createElement('div');
    chars.className = 'chars';
    card.q.keys.forEach(function (code) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = K.keyChar(mode, code);
      chars.appendChild(s);
    });
    el.appendChild(chars);
    if (card.q.hint) {
      var h = document.createElement('div');
      h.className = 'hint-char';
      h.textContent = card.q.hint;
      el.appendChild(h);
    }
    card.el = el;
    card.chEls = chars.children;
    return el;
  }

  function placeCard(card) {
    var a = areaSize();
    var w = card.el.offsetWidth;
    var max = Math.max(0, a.w - w - 16);
    var x = 8;
    for (var tries = 0; tries < 5; tries++) {
      x = 8 + Math.random() * max;
      var clash = st.session.live.some(function (c) {
        return c !== card && c.y < card.el.offsetHeight + 12 && Math.abs(c.x - x) < w + 12;
      });
      if (!clash) break;
    }
    card.x = x;
    card.height = card.el.offsetHeight;
  }

  function spawn() {
    var q = st.queue[st.spawned];
    var card = st.session.addCard(q);
    var el = buildCard(card, st.cfg.mode, st.spawned);
    $('play-area').appendChild(el);
    card.born = st.t;
    card.y = 0;
    placeCard(card);
    el.style.transform = 'translate(' + card.x + 'px,0px)';
    st.spawned += 1;
    updateHint();
  }

  function updateHud() {
    var s = st.session;
    $('hud-combo').textContent = '連擊 ' + s.combo + (R.comboMultiplier(s.combo) > 1 ? '　×' + R.comboMultiplier(s.combo) : '');
    $('hud-score').textContent = s.score.toLocaleString('en-US');
    var hearts = $('hud-hearts');
    if (s.maxHearts === 0) {
      hearts.hidden = true;
    } else {
      hearts.hidden = false;
      hearts.setAttribute('aria-label', '愛心剩 ' + s.hearts + ' 顆');
      var html = '';
      for (var i = 0; i < s.maxHearts; i++) html += '<span class="heart' + (i < s.hearts ? '' : ' lost') + '">' + HEART + '</span>';
      hearts.innerHTML = html;
    }
    $('hud-cleared').textContent = '已消除 ' + s.cleared;
  }

  function updateHint() {
    var code = st.session.expected();
    G.keyboard.highlight(code);
    var hint = $('next-hint');
    if (!code) { hint.textContent = ''; return; }
    var label = code === 'Space' ? '空白鍵' : K.keyLabel(code);
    var text = '下一個按 ' + label;
    if (st.cfg.mode === 'en') text += '（' + K.finger(code) + '）';
    hint.textContent = text;
  }

  function paintProgress(card) {
    for (var i = 0; i < card.chEls.length; i++) {
      card.chEls[i].classList.toggle('done', i < card.pos);
    }
  }

  function setActive(card) {
    st.session.live.forEach(function (c) { c.el.classList.toggle('active', c === card); });
  }

  function handle(code) {
    if (!st || st.paused || st.ended) return null;
    var s = st.session;
    var res = s.press(code);
    if (res.type === 'wrong') {
      G.keyboard.flash(code, 'bad');
      SOUND.wrong();
      if (res.card) {
        res.card.el.classList.remove('shake');
        void res.card.el.offsetWidth;
        res.card.el.classList.add('shake');
      }
    } else {
      G.keyboard.flash(code, 'good');
      paintProgress(res.card);
      setActive(res.type === 'clear' ? null : res.card);
      if (res.type === 'clear') {
        SOUND.clear();
        res.card.el.classList.add('pop');
        var el = res.card.el;
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
      } else {
        SOUND.correct();
      }
    }
    updateHud();
    updateHint();
    checkEnd();
    return res;
  }

  function checkEnd() {
    if (st.ended) return;
    if (st.session.over) finish(false);
    else if (st.spawned >= st.queue.length && st.session.live.length === 0) finish(true);
  }

  function finish(cleared) {
    st.ended = true;
    cancelAnimationFrame(st.raf);
    G.input.detach();
    document.body.classList.remove('playing');
    var s = st.session;
    var result = {
      cleared: cleared,
      stars: cleared ? R.starsFor(s.accuracy()) : 0,
      accuracy: s.accuracy(),
      bestCombo: s.best,
      score: s.score,
      cfg: st.cfg
    };
    var done = st.onEnd;
    setTimeout(function () { SOUND[cleared ? 'win' : 'miss'](); done(result); }, 260);
  }

  function tick(now) {
    if (!st || st.ended) return;
    var dt = Math.min(now - st.last, 100);
    st.last = now;
    if (!st.paused) {
      st.t += dt;
      if (st.spawned < st.queue.length && st.t >= st.nextSpawn) {
        spawn();
        st.nextSpawn = st.t + st.cfg.spawnMs;
      }
      var a = areaSize();
      var missed = [];
      st.session.live.slice().forEach(function (card) {
        var travel = Math.max(0, a.h - card.height);
        card.y = ((st.t - card.born) / st.cfg.fallMs) * travel;
        card.el.style.transform = 'translate(' + Math.min(card.x, Math.max(0, a.w - card.el.offsetWidth - 8)) + 'px,' + card.y + 'px)';
        if (st.t - card.born >= st.cfg.fallMs) missed.push(card);
      });
      missed.forEach(function (card) {
        st.session.miss(card);
        if (card.el.parentNode) card.el.parentNode.removeChild(card.el);
        SOUND.miss();
        updateHud();
        updateHint();
      });
      if (missed.length) checkEnd();
    }
    if (!st.ended) st.raf = requestAnimationFrame(tick);
  }

  function setPaused(p) {
    if (!st || st.ended) return;
    st.paused = p;
    $('pause-overlay').hidden = !p;
  }

  function onVisibility() {
    if (document.hidden) setPaused(true);
  }

  var P = {
    start: function (cfg, onEnd, onLeave) {
      P.stop();
      st = {
        cfg: cfg,
        onEnd: onEnd,
        onLeave: onLeave,
        session: G.session.create({ hearts: cfg.hearts }),
        queue: cfg.cards,
        spawned: 0,
        t: 0,
        nextSpawn: 0,
        last: performance.now(),
        paused: false,
        ended: false,
        raf: 0
      };
      $('play-area').innerHTML = '';
      $('pause-overlay').hidden = true;
      $('level-title').textContent = cfg.title;
      G.keyboard.render($('keyboard'), cfg.mode, cfg.tier);
      G.input.attach(handle, cfg.mode);
      document.body.classList.add('playing');
      document.addEventListener('visibilitychange', onVisibility);
      updateHud();
      updateHint();
      st.raf = requestAnimationFrame(tick);
    },

    stop: function () {
      if (st) {
        st.ended = true;
        cancelAnimationFrame(st.raf);
      }
      G.input.detach();
      document.body.classList.remove('playing');
      document.removeEventListener('visibilitychange', onVisibility);
      st = null;
    },

    pause: function () { setPaused(true); },
    resume: function () { setPaused(false); },
    leave: function () {
      var cb = st && st.onLeave;
      P.stop();
      if (cb) cb();
    },
    sound: SOUND
  };

  G.play = P;
})();
