(function () {
  var G = (window.Game = window.Game || {});

  var HEARTS = { beginner: 0, intermediate: 5, advanced: 3 };
  var FALL_MS = { beginner: 16000, intermediate: 12000, advanced: 10000 };
  var SPAWN_MS = { beginner: 3200, intermediate: 2500, advanced: 2100 };

  G.rules = {
    TIERS: ['beginner', 'intermediate', 'advanced'],
    MODES: ['zh', 'en'],
    LEVELS: 5,
    DAILY_CARDS: 8,

    comboMultiplier: function (combo) {
      if (combo >= 10) return 3;
      if (combo >= 5) return 2;
      return 1;
    },

    accuracy: function (correct, total) {
      return total === 0 ? 1 : correct / total;
    },

    starsFor: function (accuracy) {
      if (accuracy >= 0.95) return 3;
      if (accuracy >= 0.8) return 2;
      return 1;
    },

    heartsFor: function (tier) {
      return HEARTS[tier] || 0;
    },

    levelConfig: function (tier, level) {
      var speedUp = Math.pow(0.94, level - 1);
      return {
        cards: 10 + level * 2,
        fallMs: Math.round(FALL_MS[tier] * speedUp),
        spawnMs: Math.round(SPAWN_MS[tier] * speedUp)
      };
    },

    levelKey: function (tier, mode, level) {
      return tier + '-' + mode + '-' + level;
    }
  };
})();
