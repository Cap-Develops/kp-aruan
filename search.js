(function () {
  // Стоп-слова русского языка — не влияют на релевантность
  var STOP = { 'для':1,'в':1,'на':1,'с':1,'со':1,'по':1,'и':1,'или':1,'к':1,'ко':1,'у':1,'из':1,'от':1,'до':1,'при':1,'без':1,'над':1,'под':1,'о':1,'об':1,'не':1,'это':1,'то':1,'же':1,'бы':1,'вот':1,'как':1,'но':1,'что':1,'а':1 };

  // Суффиксы — от длинных к коротким (порядок важен)
  var SUFFIXES = ['ирования','ирование','изации','ость','ению','ение','ности','ному','ного','ными','ными','ных','ной','ным','ную','ная','ного','ным','тель','ник','ция','ций','ние','нию','нии','ния','ий','ая','ое','ые','ых','ый','ом','ем','ен','их','им','ие','ии','ия','ей','ам','ах','ов','ев','ью','ом','а','е','и','у','ю','ь','ы' ];

  function stem(w) {
    for (var i = 0; i < SUFFIXES.length; i++) {
      var s = SUFFIXES[i];
      if (w.length > s.length + 2 && w.slice(-s.length) === s) {
        return w.slice(0, -s.length);
      }
    }
    return w;
  }

  function tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .split(/[\s\/,\.\(\)]+/)
      .filter(function (t) { return t.length > 1 && !STOP[t]; });
  }

  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 99;
    var m = a.length, n = b.length, i, j;
    var d = [];
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = a[i-1] === b[j-1]
          ? d[i-1][j-1]
          : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
      }
    }
    return d[m][n];
  }

  // Оценка совпадения одного токена запроса с полем
  function fieldScore(qt, qs, fieldText, weight) {
    var tokens = tokenize(fieldText);
    var best = 0;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      var ts = stem(t);
      var score = 0;
      if (t === qt)               { score = weight * 2.0; }   // точное слово
      else if (ts === qs)         { score = weight * 1.5; }   // совпадение корня
      else if (t.indexOf(qt) === 0 || qt.indexOf(t) === 0) { score = weight * 1.2; } // префикс
      else if (qt.length >= 4 && levenshtein(qs, ts) === 1) { score = weight * 0.7; } // опечатка
      if (score > best) best = score;
    }
    return best;
  }

  function search(query, items) {
    if (!query || !query.trim()) return items;
    var qLow = query.toLowerCase().trim();
    var qTokens = tokenize(qLow);
    var qStems  = qTokens.map(stem);
    if (!qTokens.length) return items;

    var results = [];
    for (var idx = 0; idx < items.length; idx++) {
      var item = items[idx];
      var score = 0;

      // Бонус за вхождение всего запроса в name
      var nameLow = (item.name || '').toLowerCase();
      if (nameLow === qLow)                  { score += 500; }
      else if (nameLow.indexOf(qLow) === 0)  { score += 150; }
      else if (nameLow.indexOf(qLow) >= 0)   { score +=  60; }

      // Поп-токенный скоринг с весами полей
      var matchedCount = 0;
      for (var ti = 0; ti < qTokens.length; ti++) {
        var qt = qTokens[ti];
        var qs = qStems[ti];

        var ns  = fieldScore(qt, qs, item.name,         10);
        var cs  = fieldScore(qt, qs, item.category,      3);
        var ps  = fieldScore(qt, qs, item.productivity,  5);
        var sp  = fieldScore(qt, qs, item.specs,         2);
        var br  = fieldScore(qt, qs, item.brand,         2);

        var tokenTotal = ns + cs + ps + sp + br;
        score += tokenTotal;
        if (tokenTotal > 0) matchedCount++;
      }

      // Мультитокенный бонус: больше совпавших слов запроса = выше
      if (qTokens.length > 1 && matchedCount > 0) {
        score *= (0.6 + 0.4 * matchedCount / qTokens.length);
      }

      if (score > 0) results.push({ item: item, score: score });
    }

    results.sort(function (a, b) { return b.score - a.score; });
    return results.map(function (r) { return r.item; });
  }

  window.SearchEngine = { search: search };
})();
