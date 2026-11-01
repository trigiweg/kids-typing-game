(function () {
  var G = (window.Game = window.Game || {});
  var K = G.keymap;

  var root = null;

  function makeKey(code, mode, tier) {
    var b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.className = 'k';
    b.setAttribute('data-code', code);
    var main = document.createElement('span');
    var sub = document.createElement('span');
    sub.className = 'k-sub';
    if (mode === 'zh') {
      main.className = 'k-main';
      main.textContent = code === 'Space' ? '一聲' : K.zhuyin[code];
      sub.textContent = K.keyLabel(code);
      if (K.isTone(code) && tier !== 'advanced') b.className += ' dim';
    } else {
      main.className = 'k-main k-latin';
      main.textContent = K.keyLabel(code);
    }
    b.setAttribute('aria-label', main.textContent + (mode === 'zh' ? '，按鍵 ' + K.keyLabel(code) : ''));
    b.appendChild(main);
    if (mode === 'zh') b.appendChild(sub);
    // 觸控與滑鼠一律在按下時輸入，並避免聚焦、縮放與選取文字
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      G.input.tap(code);
    });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    return b;
  }

  G.keyboard = {
    render: function (container, mode, tier) {
      root = container;
      container.innerHTML = '';
      var rows = mode === 'zh' ? K.zhRows : K.enRows;
      rows.forEach(function (row) {
        var r = document.createElement('div');
        r.className = 'k-row';
        row.forEach(function (code) { r.appendChild(makeKey(code, mode, tier)); });
        container.appendChild(r);
      });
      if (tier === 'advanced') {
        var sr = document.createElement('div');
        sr.className = 'k-row';
        var space = makeKey('Space', mode, tier);
        space.className += ' k-space';
        sr.appendChild(space);
        container.appendChild(sr);
      }
    },

    highlight: function (code) {
      if (!root) return;
      var on = root.querySelectorAll('.k.on');
      for (var i = 0; i < on.length; i++) on[i].classList.remove('on');
      if (!code) return;
      var k = root.querySelector('[data-code="' + code + '"]');
      if (k) k.classList.add('on');
    },

    flash: function (code, kind) {
      if (!root) return;
      var k = root.querySelector('[data-code="' + code + '"]');
      if (!k) return;
      var cls = kind === 'bad' ? 'bad' : 'good';
      k.classList.add(cls);
      setTimeout(function () { k.classList.remove(cls); }, 180);
    }
  };
})();
