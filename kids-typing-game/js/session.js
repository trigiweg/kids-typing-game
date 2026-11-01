(function () {
  var G = (window.Game = window.Game || {});
  var R = G.rules;

  // 一局遊戲的規則狀態，不碰 DOM。畫面層（play.js）負責顯示與掉落。
  function Session(opts) {
    this.maxHearts = opts.hearts | 0;
    this.hearts = this.maxHearts;
    this.live = [];
    this.locked = null;
    this.correct = 0;
    this.total = 0;
    this.combo = 0;
    this.best = 0;
    this.score = 0;
    this.cleared = 0;
    this.missed = 0;
    this.over = false;
    this.nextId = 1;
  }

  Session.prototype.addCard = function (question) {
    var card = { id: this.nextId++, q: question, pos: 0, y: 0 };
    this.live.push(card);
    return card;
  };

  Session.prototype.expected = function () {
    if (this.locked) return this.locked.q.keys[this.locked.pos];
    var low = this.lowest();
    return low ? low.q.keys[0] : null;
  };

  Session.prototype.lowest = function () {
    var low = null;
    this.live.forEach(function (c) { if (!low || c.y > low.y) low = c; });
    return low;
  };

  Session.prototype.accept = function (card) {
    this.correct += 1;
    card.pos += 1;
    if (card.pos < card.q.keys.length) return { type: 'correct', card: card };
    this.live.splice(this.live.indexOf(card), 1);
    this.locked = null;
    this.combo += 1;
    if (this.combo > this.best) this.best = this.combo;
    this.score += 10 * card.q.keys.length * R.comboMultiplier(this.combo);
    this.cleared += 1;
    return { type: 'clear', card: card };
  };

  Session.prototype.press = function (code) {
    this.total += 1;
    if (this.locked) {
      if (this.locked.q.keys[this.locked.pos] === code) return this.accept(this.locked);
      this.combo = 0;
      return { type: 'wrong', card: this.locked };
    }
    var target = null;
    this.live.forEach(function (c) {
      if (c.pos === 0 && c.q.keys[0] === code && (!target || c.y > target.y)) target = c;
    });
    if (!target) {
      this.combo = 0;
      return { type: 'wrong', card: null };
    }
    this.locked = target;
    return this.accept(target);
  };

  Session.prototype.miss = function (card) {
    var i = this.live.indexOf(card);
    if (i < 0) return null;
    this.live.splice(i, 1);
    if (this.locked === card) this.locked = null;
    this.missed += 1;
    this.combo = 0;
    if (this.maxHearts > 0) {
      this.hearts -= 1;
      if (this.hearts <= 0) this.over = true;
    }
    return { hearts: this.hearts };
  };

  Session.prototype.accuracy = function () {
    return R.accuracy(this.correct, this.total);
  };

  G.session = { create: function (opts) { return new Session(opts); } };
})();
