(function () {
  var G = (window.Game = window.Game || {});
  var K = G.keymap;

  var TONES = { 'ˊ': 1, 'ˇ': 1, 'ˋ': 1, '˙': 1 };

  // 注音字串轉按鍵序列。withTone 為 true 時，每個音節以空白（一聲）或聲調鍵結尾。
  function zhKeys(text, withTone) {
    var keys = [];
    text.split(' ').forEach(function (syllable) {
      var hasTone = false;
      syllable.split('').forEach(function (ch) {
        if (TONES[ch]) {
          hasTone = true;
          if (withTone) keys.push(K.toneCodes[ch]);
        } else {
          keys.push(K.symbolToCode[ch]);
        }
      });
      if (withTone && !hasTone) keys.push('Space');
    });
    return keys;
  }

  function enKeys(text) {
    return text.split('').map(function (ch) {
      return ch === ' ' ? 'Space' : 'Key' + ch.toUpperCase();
    });
  }

  function build(prefix, rows, keysOf) {
    var seen = {};
    var out = [];
    rows.forEach(function (row) {
      var q = keysOf(row);
      var sig = q.keys.join(',');
      if (seen[sig]) return;
      seen[sig] = true;
      q.id = prefix + '-' + out.length;
      out.push(q);
    });
    return out;
  }

  // ---- 初級 中文：單一注音符號，最後加上簡單的兩符號音節 ----
  var BEGINNER_ZH = ('ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ').split('')
    .concat(['ㄅㄚ', 'ㄆㄚ', 'ㄇㄚ', 'ㄈㄚ', 'ㄉㄚ', 'ㄊㄚ', 'ㄋㄚ', 'ㄌㄚ', 'ㄍㄚ', 'ㄎㄚ', 'ㄏㄚ', 'ㄅㄧ', 'ㄇㄧ']);

  // ---- 中級 中文：單字注音（不含聲調），[字, 注音] ----
  var INTERMEDIATE_ZH = [
    ['媽', 'ㄇㄚ'], ['爸', 'ㄅㄚ'], ['哥', 'ㄍㄜ'], ['姐', 'ㄐㄧㄝ'], ['弟', 'ㄉㄧ'], ['妹', 'ㄇㄟ'],
    ['水', 'ㄕㄨㄟ'], ['火', 'ㄏㄨㄛ'], ['山', 'ㄕㄢ'], ['天', 'ㄊㄧㄢ'], ['月', 'ㄩㄝ'], ['日', 'ㄖ'],
    ['口', 'ㄎㄡ'], ['手', 'ㄕㄡ'], ['目', 'ㄇㄨ'], ['耳', 'ㄦ'], ['花', 'ㄏㄨㄚ'], ['草', 'ㄘㄠ'],
    ['書', 'ㄕㄨ'], ['魚', 'ㄩ'], ['鳥', 'ㄋㄧㄠ'], ['狗', 'ㄍㄡ'], ['貓', 'ㄇㄠ'], ['牛', 'ㄋㄧㄡ'],
    ['羊', 'ㄧㄤ'], ['雞', 'ㄐㄧ'], ['米', 'ㄇㄧ'], ['麵', 'ㄇㄧㄢ'], ['茶', 'ㄔㄚ'], ['筆', 'ㄅㄧ'],
    ['門', 'ㄇㄣ'], ['窗', 'ㄔㄨㄤ'], ['燈', 'ㄉㄥ'], ['家', 'ㄐㄧㄚ'], ['學', 'ㄒㄩㄝ'], ['校', 'ㄒㄧㄠ'],
    ['老', 'ㄌㄠ'], ['師', 'ㄕ'], ['友', 'ㄧㄡ'], ['愛', 'ㄞ'], ['樂', 'ㄌㄜ'], ['紅', 'ㄏㄨㄥ'],
    ['黃', 'ㄏㄨㄤ'], ['藍', 'ㄌㄢ'], ['綠', 'ㄌㄩ'], ['白', 'ㄅㄞ'], ['黑', 'ㄏㄟ'], ['大', 'ㄉㄚ'],
    ['雲', 'ㄩㄣ'], ['風', 'ㄈㄥ'], ['星', 'ㄒㄧㄥ'], ['太', 'ㄊㄞ'], ['河', 'ㄏㄜ'], ['海', 'ㄏㄞ'],
    ['島', 'ㄉㄠ'], ['森', 'ㄙㄣ'], ['林', 'ㄌㄧㄣ'], ['春', 'ㄔㄨㄣ'], ['夏', 'ㄒㄧㄚ'], ['秋', 'ㄑㄧㄡ'],
    ['冬', 'ㄉㄨㄥ']
  ];

  // ---- 高級 中文：詞語注音（含聲調，音節以空白分開，一聲不標記） ----
  var ADVANCED_ZH = [
    ['學校', 'ㄒㄩㄝˊ ㄒㄧㄠˋ'], ['老師', 'ㄌㄠˇ ㄕ'], ['朋友', 'ㄆㄥˊ ㄧㄡˇ'], ['家人', 'ㄐㄧㄚ ㄖㄣˊ'],
    ['媽媽', 'ㄇㄚ ㄇㄚ'], ['太陽', 'ㄊㄞˋ ㄧㄤˊ'], ['月亮', 'ㄩㄝˋ ㄌㄧㄤˋ'], ['星星', 'ㄒㄧㄥ ㄒㄧㄥ'],
    ['白雲', 'ㄅㄞˊ ㄩㄣˊ'], ['大雨', 'ㄉㄚˋ ㄩˇ'], ['小鳥', 'ㄒㄧㄠˇ ㄋㄧㄠˇ'], ['小狗', 'ㄒㄧㄠˇ ㄍㄡˇ'],
    ['花朵', 'ㄏㄨㄚ ㄉㄨㄛˇ'], ['蘋果', 'ㄆㄧㄥˊ ㄍㄨㄛˇ'], ['香蕉', 'ㄒㄧㄤ ㄐㄧㄠ'], ['西瓜', 'ㄒㄧ ㄍㄨㄚ'],
    ['牛奶', 'ㄋㄧㄡˊ ㄋㄞˇ'], ['麵包', 'ㄇㄧㄢˋ ㄅㄠ'], ['開心', 'ㄎㄞ ㄒㄧㄣ'], ['快樂', 'ㄎㄨㄞˋ ㄌㄜˋ'],
    ['讀書', 'ㄉㄨˊ ㄕㄨ'], ['寫字', 'ㄒㄧㄝˇ ㄗˋ'], ['唱歌', 'ㄔㄤˋ ㄍㄜ'], ['跳舞', 'ㄊㄧㄠˋ ㄨˇ'],
    ['游泳', 'ㄧㄡˊ ㄩㄥˇ'], ['跑步', 'ㄆㄠˇ ㄅㄨˋ'], ['籃球', 'ㄌㄢˊ ㄑㄧㄡˊ'], ['足球', 'ㄗㄨˊ ㄑㄧㄡˊ'],
    ['電腦', 'ㄉㄧㄢˋ ㄋㄠˇ'], ['電視', 'ㄉㄧㄢˋ ㄕˋ'], ['手機', 'ㄕㄡˇ ㄐㄧ'], ['鉛筆', 'ㄑㄧㄢ ㄅㄧˇ'],
    ['課本', 'ㄎㄜˋ ㄅㄣˇ'], ['教室', 'ㄐㄧㄠˋ ㄕˋ'], ['操場', 'ㄘㄠ ㄔㄤˇ'], ['圖書', 'ㄊㄨˊ ㄕㄨ'],
    ['早安', 'ㄗㄠˇ ㄢ'], ['晚安', 'ㄨㄢˇ ㄢ'], ['謝謝', 'ㄒㄧㄝˋ ㄒㄧㄝˋ'], ['再見', 'ㄗㄞˋ ㄐㄧㄢˋ'],
    ['你好', 'ㄋㄧˇ ㄏㄠˇ'], ['台灣', 'ㄊㄞˊ ㄨㄢ'], ['中國', 'ㄓㄨㄥ ㄍㄨㄛˊ'], ['世界', 'ㄕˋ ㄐㄧㄝˋ'],
    ['地球', 'ㄉㄧˋ ㄑㄧㄡˊ'], ['宇宙', 'ㄩˇ ㄓㄡˋ'], ['火箭', 'ㄏㄨㄛˇ ㄐㄧㄢˋ'], ['勇者', 'ㄩㄥˇ ㄓㄜˇ'],
    ['冒險', 'ㄇㄠˋ ㄒㄧㄢˇ'], ['打字', 'ㄉㄚˇ ㄗˋ'], ['練習', 'ㄌㄧㄢˋ ㄒㄧˊ'], ['加油', 'ㄐㄧㄚ ㄧㄡˊ'],
    ['進步', 'ㄐㄧㄣˋ ㄅㄨˋ'], ['努力', 'ㄋㄨˇ ㄌㄧˋ'], ['成功', 'ㄔㄥˊ ㄍㄨㄥ']
  ];

  // ---- 英文 ----
  var BEGINNER_EN = 'fjdksla ghrutyeiwoqpvbcnmxz'.replace(' ', '').split('').concat((
    'cat dog sun red big hat pig cow bee fox man run sit cup bag pen box bed bus car egg ant bat cap day eye ' +
    'fan hen ice jam key leg map net owl pot rat sky toy van web zoo').split(' '));

  var INTERMEDIATE_EN = (
    'apple banana orange school teacher friend happy water green yellow purple table chair window door book ' +
    'pencil bag ruler paper music dance sing play jump walk read write draw swim bread milk juice candy ' +
    'cookie rabbit monkey tiger panda horse sheep zebra flower garden rain snow cloud river mountain ocean ' +
    'island summer winter').split(' ');

  var ADVANCED_EN = [
    'i like cats', 'good morning', 'thank you', 'how are you', 'see you', 'my name is', 'nice to meet you',
    'i am a student', 'this is my book', 'open the door', 'close the window', 'let us play', 'i love school',
    'we can do it', 'happy birthday', 'have a nice day', 'what is this', 'where is my bag', 'i can swim',
    'she is my friend', 'he likes apples', 'the sun is hot', 'it is a sunny day', 'the cat is cute',
    'i have a dog', 'please sit down', 'stand up please', 'read a book', 'draw a picture', 'sing a song',
    'elephant', 'butterfly', 'beautiful', 'wonderful', 'chocolate', 'vegetable', 'homework', 'computer',
    'telephone', 'dinosaur', 'adventure', 'favorite', 'birthday', 'football', 'umbrella', 'sandwich',
    'strawberry', 'pineapple', 'rainbow', 'playground', 'friendship', 'excellent'
  ];

  function enRows(list) {
    return list.map(function (w) { return w; });
  }

  G.bank = {
    'beginner-zh': build('bz', BEGINNER_ZH, function (s) { return { display: s, hint: '', keys: zhKeys(s, false) }; }),
    'intermediate-zh': build('iz', INTERMEDIATE_ZH, function (r) { return { display: r[1], hint: r[0], keys: zhKeys(r[1], false) }; }),
    'advanced-zh': build('az', ADVANCED_ZH, function (r) { return { display: r[1], hint: r[0], keys: zhKeys(r[1], true) }; }),
    'beginner-en': build('be', enRows(BEGINNER_EN), function (w) { return { display: w, hint: '', keys: enKeys(w) }; }),
    'intermediate-en': build('ie', enRows(INTERMEDIATE_EN), function (w) { return { display: w, hint: '', keys: enKeys(w) }; }),
    'advanced-en': build('ae', enRows(ADVANCED_EN), function (w) { return { display: w, hint: '', keys: enKeys(w) }; })
  };

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 依關卡取題：低關卡只從題庫前段取，越高關卡範圍越大
  G.pickQuestions = function (tier, mode, level, count) {
    var bank = G.bank[tier + '-' + mode];
    var size = level === 'daily' ? bank.length : Math.min(bank.length, 12 + level * 10);
    var pool = shuffle(bank.slice(0, size));
    var out = [];
    while (out.length < count) {
      out = out.concat(pool.length ? shuffle(pool) : []);
    }
    return out.slice(0, count);
  };
})();
