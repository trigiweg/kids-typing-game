(function () {
  var G = (window.Game = window.Game || {});
  var KEY = 'kids-typing-game:v1';
  var THEMES = ['space', 'ocean', 'animals'];
  var SET_SIZE = 5;

  var backend = null;
  var warned = false;
  var data = null;

  function getBackend() {
    if (backend) return backend;
    return window.localStorage;
  }

  function blank() {
    return { version: 1, stars: {}, stickers: 0, themes: ['space'], bestCombo: 0, dailyDate: '', theme: 'space' };
  }

  function themesFor(stickers) {
    var list = [];
    for (var i = 0; i < THEMES.length; i++) {
      if (stickers >= i * SET_SIZE) list.push(THEMES[i]);
    }
    return list;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  var S = {
    THEMES: THEMES,
    SET_SIZE: SET_SIZE,

    // 測試時可替換儲存空間，或用 null 還原
    setBackend: function (b) { backend = b; },

    today: function () {
      var d = new Date();
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    },

    load: function () {
      warned = false;
      var raw = null;
      try {
        raw = getBackend().getItem(KEY);
      } catch (e) {
        warned = true;
      }
      var d = blank();
      if (raw) {
        try {
          var p = JSON.parse(raw);
          if (p && p.version === 1) {
            d.stars = p.stars || {};
            d.stickers = p.stickers | 0;
            d.bestCombo = p.bestCombo | 0;
            d.dailyDate = p.dailyDate || '';
            d.theme = p.theme || 'space';
          }
        } catch (e) { /* 資料壞掉就從頭開始 */ }
      }
      d.themes = themesFor(d.stickers);
      if (d.themes.indexOf(d.theme) < 0) d.theme = 'space';
      data = d;
      return data;
    },

    get: function () { return data || S.load(); },

    save: function () {
      try {
        getBackend().setItem(KEY, JSON.stringify(S.get()));
      } catch (e) {
        warned = true;
      }
    },

    // 儲存空間不可用時為 true，畫面要提示進度不會儲存
    isVolatile: function () { return warned; },

    reset: function () {
      try { getBackend().removeItem(KEY); } catch (e) { warned = true; }
      data = blank();
      return data;
    },

    starsOf: function (key) { return S.get().stars[key] || 0; },

    recordLevel: function (key, stars) {
      var d = S.get();
      if (stars > (d.stars[key] || 0)) d.stars[key] = stars;
      S.save();
    },

    recordCombo: function (n) {
      var d = S.get();
      if (n > d.bestCombo) d.bestCombo = n;
      S.save();
    },

    addSticker: function () {
      var d = S.get();
      var before = d.themes.length;
      d.stickers += 1;
      d.themes = themesFor(d.stickers);
      S.save();
      return { stickers: d.stickers, unlocked: d.themes.length > before ? d.themes[d.themes.length - 1] : null };
    },

    // 距離下一個主題還差幾張貼紙；全部解鎖則為 0
    stickersToNextTheme: function () {
      var d = S.get();
      if (d.themes.length >= THEMES.length) return 0;
      return d.themes.length * SET_SIZE - d.stickers;
    },

    setTheme: function (id) {
      var d = S.get();
      if (d.themes.indexOf(id) >= 0) {
        d.theme = id;
        S.save();
      }
    },

    // 每日挑戰：同一個本機日期只發一次貼紙。回傳 true 表示這次有發。
    claimDaily: function () {
      var d = S.get();
      var today = S.today();
      if (d.dailyDate === today) return false;
      d.dailyDate = today;
      S.save();
      return true;
    },

    dailyDone: function () { return S.get().dailyDate === S.today(); }
  };

  G.storage = S;
})();
