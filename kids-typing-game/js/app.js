(function () {
  var G = window.Game;
  var R = G.rules;
  var S = G.storage;

  var TIER_NAME = { beginner: '初級', intermediate: '中級', advanced: '高級' };
  var MODE_NAME = { zh: '中文注音', en: 'English' };
  var THEME_NAME = { space: '太空', ocean: '海底', animals: '動物' };
  var STICKERS = [
    ['小火箭', '小星星', '月亮', '小行星', '太空人'],
    ['小魚', '海龜', '水母', '海星', '鯨魚'],
    ['小貓', '小狗', '兔子', '小熊', '小鳥']
  ];
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"__CLS__><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21.1l1.5-7L2 9.3l7-.8z"/></svg>';

  var state = { tier: 'intermediate', mode: 'zh', last: null };

  function $(id) { return document.getElementById(id); }
  function all(sel) { return document.querySelectorAll(sel); }

  function show(name) {
    var screens = all('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.toggle('active', screens[i].id === 'screen-' + name);
    window.scrollTo(0, 0);
  }

  function star(cls) { return STAR.replace('__CLS__', cls ? ' class="' + cls + '"' : ''); }

  function stickerName(n) {
    var set = Math.min(STICKERS.length - 1, Math.floor((n - 1) / S.SET_SIZE));
    return STICKERS[set][(n - 1) % S.SET_SIZE];
  }

  // ---- 首頁 ----
  function renderHome() {
    var d = S.get();
    document.body.setAttribute('data-theme', d.theme);
    $('stat-stickers').textContent = '貼紙 ' + d.stickers;
    $('stat-combo').textContent = '最佳連擊 ' + d.bestCombo;
    $('notice').hidden = !S.isVolatile();

    var tiers = all('.tier');
    for (var i = 0; i < tiers.length; i++) tiers[i].setAttribute('aria-pressed', tiers[i].getAttribute('data-tier') === state.tier);
    var modes = all('.mode');
    for (var j = 0; j < modes.length; j++) modes[j].setAttribute('aria-pressed', modes[j].getAttribute('data-mode') === state.mode);

    var done = S.dailyDone();
    $('daily-text').textContent = done ? '今天的挑戰完成了！明天再來拿貼紙。' : '完成今天的挑戰，多拿 1 張貼紙。每天只能拿一次。';
    $('btn-daily').textContent = done ? '再玩一次' : '去挑戰';

    var box = $('themes');
    box.innerHTML = '';
    S.THEMES.forEach(function (id, idx) {
      var unlocked = d.themes.indexOf(id) >= 0;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme';
      b.disabled = !unlocked;
      b.setAttribute('aria-pressed', d.theme === id);
      b.textContent = THEME_NAME[id] + (unlocked ? '' : '（再 ' + (idx * S.SET_SIZE - d.stickers) + ' 張）');
      b.addEventListener('click', function () {
        S.setTheme(id);
        renderHome();
      });
      box.appendChild(b);
    });
  }

  // ---- 關卡地圖 ----
  function levelUnlocked(level) {
    return level === 1 || S.starsOf(R.levelKey(state.tier, state.mode, level - 1)) >= 1;
  }

  function renderMap() {
    $('map-title').textContent = TIER_NAME[state.tier] + '・' + MODE_NAME[state.mode];
    var box = $('levels');
    box.innerHTML = '';
    for (var lv = 1; lv <= R.LEVELS; lv++) {
      (function (level) {
        var stars = S.starsOf(R.levelKey(state.tier, state.mode, level));
        var open = levelUnlocked(level);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'level' + (stars > 0 ? ' cleared' : '');
        b.setAttribute('aria-disabled', open ? 'false' : 'true');
        var html = '<span class="level-num">' + level + '</span>';
        if (open) {
          html += '<span class="level-stars" aria-label="' + stars + ' 顆星">';
          for (var s = 1; s <= 3; s++) html += star(s <= stars ? '' : 'off');
          html += '</span>';
        } else {
          html += '<span class="level-lock">先通過第 ' + (level - 1) + ' 關</span>';
        }
        b.innerHTML = html;
        b.addEventListener('click', function () {
          if (!open) return;
          startLevel(level);
        });
        box.appendChild(b);
      })(lv);
    }
    show('map');
  }

  // ---- 遊戲 ----
  function startLevel(level) {
    var tier = state.tier;
    var mode = state.mode;
    var daily = level === 'daily';
    var lc = R.levelConfig(tier, daily ? 3 : level);
    var count = daily ? R.DAILY_CARDS : lc.cards;
    var cfg = {
      tier: tier,
      mode: mode,
      level: level,
      title: daily ? '今日挑戰' : TIER_NAME[tier] + '・第 ' + level + ' 關',
      hearts: daily ? 0 : R.heartsFor(tier),
      fallMs: lc.fallMs,
      spawnMs: lc.spawnMs,
      cards: G.pickQuestions(tier, mode, level, count)
    };
    state.last = cfg;
    show('play');
    G.play.start(cfg, showResult, function () { daily ? goHome() : renderMap(); });
  }

  // ---- 結算 ----
  function showResult(res) {
    var cfg = res.cfg;
    var daily = cfg.level === 'daily';
    S.recordCombo(res.bestCombo);
    $('result-level').textContent = cfg.title;
    var starsBox = $('result-stars');
    var msg = $('result-msg');
    var sticker = $('res-sticker');
    var next = $('res-next');
    var mapBtn = $('res-map');
    msg.hidden = true;
    sticker.hidden = true;

    $('res-acc').textContent = Math.round(res.accuracy * 100) + '%';
    $('res-combo').textContent = res.bestCombo;
    $('res-score').textContent = res.score.toLocaleString('en-US');
    mapBtn.textContent = daily ? '回首頁' : '回關卡地圖';

    if (res.cleared) {
      $('result-title').textContent = '過關了！';
      var shownStars = daily ? 3 : res.stars;
      starsBox.setAttribute('aria-label', shownStars + ' 顆星');
      starsBox.innerHTML = [1, 2, 3].map(function (n) {
        var cls = (n === 2 ? 'big' : '') + (n <= shownStars ? '' : ' off');
        return star(cls.trim());
      }).join('');

      var award = false;
      if (daily) {
        award = S.claimDaily();
        if (!award) { msg.textContent = '今天已經拿過挑戰貼紙了，明天再來！'; msg.hidden = false; }
      } else {
        S.recordLevel(R.levelKey(cfg.tier, cfg.mode, cfg.level), res.stars);
        award = true;
      }
      if (award) {
        var r = S.addSticker();
        sticker.hidden = false;
        var left = S.stickersToNextTheme();
        var name = stickerName(r.stickers);
        $('sticker-name').innerHTML = r.unlocked
          ? name + '<br>解鎖新主題：' + THEME_NAME[r.unlocked]
          : name + (left > 0 ? '<br>再 ' + left + ' 張換新主題' : '');
      }
      var hasNext = !daily && cfg.level < R.LEVELS;
      next.hidden = !hasNext;
    } else {
      $('result-title').textContent = '再試一次！';
      starsBox.setAttribute('aria-label', '0 顆星');
      starsBox.innerHTML = '';
      msg.textContent = '你已經很棒了！貼紙都還在，再挑戰一次吧。';
      msg.hidden = false;
      next.hidden = true;
    }
    show('result');
  }

  function goHome() {
    renderHome();
    show('home');
  }

  // ---- 事件 ----
  function bind() {
    var tiers = all('.tier');
    for (var i = 0; i < tiers.length; i++) {
      tiers[i].addEventListener('click', function () {
        state.tier = this.getAttribute('data-tier');
        renderHome();
      });
    }
    var modes = all('.mode');
    for (var j = 0; j < modes.length; j++) {
      modes[j].addEventListener('click', function () {
        state.mode = this.getAttribute('data-mode');
        renderHome();
      });
    }
    $('btn-start').addEventListener('click', renderMap);
    $('btn-daily').addEventListener('click', function () { startLevel('daily'); });
    $('map-back').addEventListener('click', goHome);
    $('btn-pause').addEventListener('click', function () { G.play.pause(); });
    $('btn-resume').addEventListener('click', function () { G.play.resume(); });
    $('btn-leave').addEventListener('click', function () { G.play.leave(); });
    $('res-map').addEventListener('click', function () { state.last && state.last.level === 'daily' ? goHome() : renderMap(); });
    $('res-retry').addEventListener('click', function () { if (state.last) startLevel(state.last.level); });
    $('res-next').addEventListener('click', function () { if (state.last) startLevel(state.last.level + 1); });
    $('btn-reset').addEventListener('click', function () {
      if (window.confirm('要清除所有貼紙和星星，重新開始嗎？')) {
        S.reset();
        goHome();
      }
    });
  }

  S.load();
  bind();
  renderHome();
})();
