(function () {
  var G = (window.Game = window.Game || {});

  // 標準注音鍵盤配置：key 為 KeyboardEvent.code，value 為注音符號（Space 為一聲）
  var ZHUYIN = {
    Digit1: 'ㄅ', KeyQ: 'ㄆ', KeyA: 'ㄇ', KeyZ: 'ㄈ',
    Digit2: 'ㄉ', KeyW: 'ㄊ', KeyS: 'ㄋ', KeyX: 'ㄌ',
    Digit3: 'ˇ', KeyE: 'ㄍ', KeyD: 'ㄎ', KeyC: 'ㄏ',
    Digit4: 'ˋ', KeyR: 'ㄐ', KeyF: 'ㄑ', KeyV: 'ㄒ',
    Digit5: 'ㄓ', KeyT: 'ㄔ', KeyG: 'ㄕ', KeyB: 'ㄖ',
    Digit6: 'ˊ', KeyY: 'ㄗ', KeyH: 'ㄘ', KeyN: 'ㄙ',
    Digit7: '˙', KeyU: 'ㄧ', KeyJ: 'ㄨ', KeyM: 'ㄩ',
    Digit8: 'ㄚ', KeyI: 'ㄛ', KeyK: 'ㄜ', Comma: 'ㄝ',
    Digit9: 'ㄞ', KeyO: 'ㄠ', KeyL: 'ㄟ', Period: 'ㄡ',
    Digit0: 'ㄢ', KeyP: 'ㄣ', Semicolon: 'ㄤ', Slash: 'ㄥ',
    Minus: 'ㄦ', Space: 'ˉ'
  };

  var TONE_CODES = { 'ˉ': 'Space', 'ˊ': 'Digit6', 'ˇ': 'Digit3', 'ˋ': 'Digit4', '˙': 'Digit7' };

  var ZH_ROWS = [
    ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
    ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
  ];

  var EN_ROWS = [
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL'],
    ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM']
  ];

  var FINGER = {};
  function assign(codes, name) { codes.forEach(function (c) { FINGER[c] = name; }); }
  assign(['KeyQ', 'KeyA', 'KeyZ'], '左手小指');
  assign(['KeyW', 'KeyS', 'KeyX'], '左手無名指');
  assign(['KeyE', 'KeyD', 'KeyC'], '左手中指');
  assign(['KeyR', 'KeyF', 'KeyV', 'KeyT', 'KeyG', 'KeyB'], '左手食指');
  assign(['KeyY', 'KeyH', 'KeyN', 'KeyU', 'KeyJ', 'KeyM'], '右手食指');
  assign(['KeyI', 'KeyK'], '右手中指');
  assign(['KeyO', 'KeyL'], '右手無名指');
  assign(['KeyP'], '右手小指');
  assign(['Space'], '大拇指');

  var SYMBOL_TO_CODE = {};
  Object.keys(ZHUYIN).forEach(function (code) {
    if (code !== 'Space') SYMBOL_TO_CODE[ZHUYIN[code]] = code;
  });

  var LABELS = { Comma: ',', Period: '.', Semicolon: ';', Slash: '/', Minus: '-', Space: '空白' };

  function keyLabel(code) {
    if (LABELS[code]) return LABELS[code];
    if (code.indexOf('Digit') === 0) return code.slice(5);
    return code.slice(3).toLowerCase();
  }

  var LETTER_CODES = {};
  for (var i = 0; i < 26; i++) LETTER_CODES['Key' + String.fromCharCode(65 + i)] = true;

  G.keymap = {
    zhuyin: ZHUYIN,
    toneCodes: TONE_CODES,
    zhRows: ZH_ROWS,
    enRows: EN_ROWS,
    symbolToCode: SYMBOL_TO_CODE,
    keyLabel: keyLabel,
    finger: function (code) { return FINGER[code] || ''; },

    // 各模式可接受的實體按鍵
    isValidCode: function (mode, code) {
      if (mode === 'zh') return Object.prototype.hasOwnProperty.call(ZHUYIN, code);
      return code === 'Space' || LETTER_CODES[code] === true;
    },

    isTone: function (code) {
      return code === 'Space' || code === 'Digit3' || code === 'Digit4' || code === 'Digit6' || code === 'Digit7';
    },

    // 字卡上顯示的單一按鍵字元
    keyChar: function (mode, code) {
      if (mode === 'zh') return ZHUYIN[code];
      return code === 'Space' ? '·' : code.slice(3).toLowerCase();
    }
  };
})();
