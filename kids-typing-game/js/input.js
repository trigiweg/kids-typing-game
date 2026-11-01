(function () {
  var G = (window.Game = window.Game || {});
  var K = G.keymap;

  var target = null;
  var mode = 'zh';

  // 實體鍵盤與螢幕鍵盤共用同一個入口：handle(code)
  var I = {
    attach: function (fn, m) {
      target = fn;
      mode = m;
    },

    detach: function () {
      target = null;
    },

    handle: function (code) {
      return target ? target(code) : null;
    },

    // 螢幕鍵盤點擊
    tap: function (code) {
      return I.handle(code);
    },

    // 實體按鍵事件：以 event.code 判斷，不受系統輸入法影響
    fromEvent: function (e) {
      if (!target || e.ctrlKey || e.metaKey || e.altKey) return null;
      if (!K.isValidCode(mode, e.code)) return null;
      if (e.preventDefault) e.preventDefault();
      if (e.repeat) return null;
      return I.handle(e.code);
    }
  };

  document.addEventListener('keydown', function (e) { I.fromEvent(e); }, true);
  document.addEventListener('keyup', function (e) {
    if (target && K.isValidCode(mode, e.code)) e.preventDefault();
  }, true);

  G.input = I;
})();
