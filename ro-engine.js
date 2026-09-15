// ro-engine.js - расчётный движок модуля RO-проектирования (аналог Vontron RO Design 6.1).
// Чистые функции без DOM: подключается и в браузере (ro-design.html), и в node (тесты).
// Физика: модель растворения-диффузии (solution-diffusion), поэлементный итерационный расчёт,
// температурная коррекция FilmTec, концентрационная поляризация beta=exp(0.7*Y),
// осмотическое давление van't Hoff, scaling-индексы (LSI по Ленжелье через активности
// Дэвиса, насыщения CaSO4/BaSO4/SrSO4/CaF2/SiO2).
// Единицы внутри: расход м3/ч, площадь м2, flux LMH (л/м2/ч), давление бар, концентрации мг/л.
// Коэффициенты A/B выводятся из паспортных тестовых условий мембран (RO_MEMBRANES[].test).

(function (global) {
  'use strict';

  // ---------- Ионы ----------
  // mw г/моль; z заряд (0 = не участвует в балансе); spf = относительная проницаемость
  // иона к NaCl (1.0 = как NaCl). spf - инженерные типовые значения, уточняются валидацией.
  var IONS = {
    Na:   { mw: 22.99,  z: 1,  spf: 1.0  },
    Ca:   { mw: 40.08,  z: 2,  spf: 0.4  },
    Mg:   { mw: 24.31,  z: 2,  spf: 0.4  },
    K:    { mw: 39.10,  z: 1,  spf: 1.3  },
    NH4:  { mw: 18.04,  z: 1,  spf: 2.0  },
    Ba:   { mw: 137.33, z: 2,  spf: 0.35 },
    Sr:   { mw: 87.62,  z: 2,  spf: 0.35 },
    Cl:   { mw: 35.45,  z: -1, spf: 1.0  },
    SO4:  { mw: 96.06,  z: -2, spf: 0.3  },
    HCO3: { mw: 61.02,  z: -1, spf: 1.0  },
    CO3:  { mw: 60.01,  z: -2, spf: 0.2  },
    NO3:  { mw: 62.00,  z: -1, spf: 5.0  },
    F:    { mw: 19.00,  z: -1, spf: 3.0  },
    SiO2: { mw: 60.08,  z: 0,  spf: 1.0  },
    B:    { mw: 10.81,  z: 0,  spf: 15.0 }
  };
  var ION_KEYS = Object.keys(IONS);
  var EQ_CACO3 = 50.04; // мг CaCO3 на мэкв

  function blankIons() {
    var o = {};
    ION_KEYS.forEach(function (k) { o[k] = 0; });
    return o;
  }

  function meq(ion, mgl) {
    var z = Math.abs(IONS[ion].z);
    return z === 0 ? 0 : mgl / (IONS[ion].mw / z);
  }

  function molar(ion, mgl) { return mgl / IONS[ion].mw / 1000; } // моль/л

  // Сводка анализа: суммы, TDS, баланс зарядов
  function summarize(ions) {
    var cat = 0, an = 0, tds = 0;
    ION_KEYS.forEach(function (k) {
      var v = ions[k] || 0;
      tds += v;
      if (IONS[k].z > 0) cat += meq(k, v);
      if (IONS[k].z < 0) an += meq(k, v);
    });
    var bal = (cat + an) > 0 ? (cat - an) / ((cat + an) / 2) * 100 : 0;
    return { cationsMeq: cat, anionsMeq: an, balancePct: bal, tds: tds };
  }

  // Auto Balance как в оригинале: добиваем Na или Cl до равенства зарядов
  function autoBalance(ions) {
    var out = {};
    ION_KEYS.forEach(function (k) { out[k] = ions[k] || 0; });
    var s = summarize(out);
    var d = s.cationsMeq - s.anionsMeq;
    if (d > 1e-9) out.Cl += d * (IONS.Cl.mw / 1); // не хватает анионов
    else if (d < -1e-9) out.Na += (-d) * (IONS.Na.mw / 1);
    return out;
  }

  // Режим «просто TDS»: эквивалент NaCl (как делает оригинал)
  function ionsFromTDS(tds) {
    var out = blankIons();
    out.Na = tds * IONS.Na.mw / (IONS.Na.mw + IONS.Cl.mw);
    out.Cl = tds * IONS.Cl.mw / (IONS.Na.mw + IONS.Cl.mw);
    return out;
  }

  // ---------- Осмотика и температура ----------
  function osmoticPressure(ions, tempC) { // бар, van't Hoff: pi = R*T*sum(c_i), R=0.08314 л*бар/(моль*К)
    var m = 0;
    ION_KEYS.forEach(function (k) { if (IONS[k].z !== 0) m += molar(k, ions[k] || 0); });
    return 0.08314 * (273.15 + tempC) * m;
  }

  function tcf(tempC) { // FilmTec
    var Tk = 273.15 + tempC;
    var K = tempC >= 25 ? 2640 : 3020;
    return Math.exp(K * (1 / 298.15 - 1 / Tk));
  }

  function saltTempFactor(tempC) { // проход солей растёт ~3%/градус
    return Math.pow(1.03, tempC - 25);
  }

  // ---------- Транспортные коэффициенты мембраны из паспортного теста ----------
  // mem: запись RO_MEMBRANES; mem.test: {nacl_mgl, p_bar, recovery, tempC, ph}
  function transportCoefs(mem) {
    var t = mem.test;
    var Y = t.recovery;
    var feed = ionsFromTDS(t.nacl_mgl);
    var conc = {};
    ION_KEYS.forEach(function (k) { conc[k] = (feed[k] || 0) / (1 - Y); });
    var avg = {};
    ION_KEYS.forEach(function (k) { avg[k] = ((feed[k] || 0) + conc[k]) / 2; });
    var beta = Math.exp(0.7 * Y);
    var R = mem.rejection / 100; // селективность к подаче при тесте
    var permTDS = t.nacl_mgl * (1 - R);
    var perm = ionsFromTDS(permTDS);
    var piM = osmoticPressure(avg, t.tempC) * beta;
    var piP = osmoticPressure(perm, t.tempC);
    var qPermTest = mem.flow_m3d / 24;              // м3/ч
    var qFeedTest = qPermTest / Y;                  // подача при тестовом recovery
    var dP = elementDP(mem.form, qFeedTest - qPermTest / 2);
    var ndp = t.p_bar - dP / 2 - piM + piP;
    var Jw = qPermTest * 1000 / mem.area_m2;        // LMH при тесте
    var A = Jw / ndp; // LMH/бар
    var avgTDS = t.nacl_mgl * (1 + 1 / (1 - Y)) / 2;
    var B = Jw * permTDS / (beta * avgTDS - permTDS); // LMH (для NaCl)
    return { A: A, B: B };
  }

  // ---------- Перепад давления по элементу ----------
  // FilmTec: dP[psi] = 0.01 * (Qavg[gpm])^1.7 для 8040; для 4040 сечение ~1/4 -> k*4^1.7
  function elementDP(form, qAvg_m3h) {
    var qGpm = qAvg_m3h / 0.2271247;
    var dpPsi = (form === '8040' ? 0.01 : 0.105) * Math.pow(qGpm, 1.7);
    return dpPsi * 0.0689476; // бар
  }

  // ---------- Расчёт одного элемента ----------
  // feed: {q м3/ч, p бар, ions мг/л}; возвращает потоки и качество
  function simulateElement(mem, coefs, feed, tempC, opts) {
    var ff = opts.ff;           // fouling factor (0.85 по умолчанию)
    var spi = opts.spi || 1.0;  // рост солепроницаемости (старение)
    var Aeff = coefs.A * tcf(tempC) * ff;
    var Beff = coefs.B * saltTempFactor(tempC) * spi;
    var S = mem.area_m2;
    var state = { cPerm: blankIons(), beta: 1, ndp: 0, dP: 0 };

    // g(Jw) = Aeff*NDP(Jw) - Jw: монотонно убывает по Jw -> единственный корень, бисекция
    function residual(Jw) {
      var Qp = Jw * S / 1000; // м3/ч
      var Ye = Qp / feed.q;
      var beta = Math.exp(0.7 * Ye);
      var Cp = blankIons();
      var Cavg = {};
      // Cavg <-> Cp связаны слабо (Cp << Cc): 3 внутренних прохода достаточно
      for (var n = 0; n < 3; n++) {
        ION_KEYS.forEach(function (k) {
          var cf = feed.ions[k] || 0;
          var cc = Ye < 0.999 ? (cf - Ye * (Cp[k] || 0)) / (1 - Ye) : cf;
          if (cc < 0) cc = 0;
          Cavg[k] = (cf + cc) / 2;
        });
        ION_KEYS.forEach(function (k) {
          var Bi = Beff * IONS[k].spf;
          Cp[k] = Jw > 1e-9 ? Bi * beta * Cavg[k] / (Jw + Bi) : beta * Cavg[k];
        });
      }
      var piM = osmoticPressure(Cavg, tempC) * beta;
      var piP = osmoticPressure(Cp, tempC);
      var dP = elementDP(mem.form, feed.q - Qp / 2);
      var ndp = feed.p - dP / 2 - (piM - piP); // давление пермеата ~0 (атм)
      state.cPerm = Cp; state.beta = beta; state.ndp = ndp; state.dP = dP;
      return Aeff * Math.max(-1e6, ndp) - Jw;
    }

    var JwCap = 0.9 * feed.q * 1000 / S; // жёсткий предел: пермеат <= 90% подачи
    var Jw = 0;
    if (residual(0) <= 0) {
      Jw = 0; // NDP <= 0 - элемент не производит пермеат
    } else if (residual(JwCap) >= 0) {
      Jw = JwCap; // избыточное давление - recovery ограничен гидравликой
    } else {
      var lo = 0, hi = JwCap;
      for (var it = 0; it < 50; it++) {
        Jw = (lo + hi) / 2;
        if (residual(Jw) > 0) lo = Jw; else hi = Jw;
        if (hi - lo < 1e-4 * Math.max(1, hi)) break;
      }
      residual(Jw); // финализировать state
    }
    var Cp = state.cPerm, beta = state.beta, ndp = state.ndp, dP = state.dP;
    var Qp2 = Jw * S / 1000;
    var Qc = feed.q - Qp2;
    var Cc = {};
    ION_KEYS.forEach(function (k) {
      var cf = feed.ions[k] || 0;
      Cc[k] = Qc > 1e-9 ? Math.max(0, (feed.q * cf - Qp2 * (Cp[k] || 0)) / Qc) : cf;
    });
    return {
      qPerm: Qp2, qConc: Qc, cPerm: Cp, cConc: Cc,
      pOut: feed.p - dP, flux: Jw, beta: beta, ndp: ndp, dP: dP,
      recovery: feed.q > 0 ? Qp2 / feed.q : 0
    };
  }

  // ---------- Прогон одного прохода (pass) при заданном давлении ----------
  // passCfg.stages: [{vessels, elements, membrane(имя)}]; membranesByName - словарь
  function simulatePass(passCfg, feedQ, feedIons, pressure, tempC, opts, db) {
    var stages = [];
    var q = feedQ, ions = feedIons, p = pressure;
    var permQ = 0, permMix = blankIons();
    for (var s = 0; s < passCfg.stages.length; s++) {
      var st = passCfg.stages[s];
      var mem = db.byName[st.membrane];
      var coefs = db.coefs[st.membrane];
      var vq = q / st.vessels; // подача на корпус
      var vIons = ions, vp = p;
      var elems = [];
      for (var e = 0; e < st.elements; e++) {
        var r = simulateElement(mem, coefs, { q: vq, p: vp, ions: vIons }, tempC, opts);
        elems.push(r);
        permQ += r.qPerm * st.vessels;
        ION_KEYS.forEach(function (k) { permMix[k] += r.qPerm * st.vessels * (r.cPerm[k] || 0); });
        vq = r.qConc; vIons = r.cConc; vp = r.pOut;
      }
      stages.push({ cfg: st, mem: mem, elements: elems, feedPerVessel: q / st.vessels });
      q = vq * st.vessels; ions = vIons; p = vp;
    }
    var cPerm = blankIons();
    ION_KEYS.forEach(function (k) { cPerm[k] = permQ > 1e-9 ? permMix[k] / permQ : 0; });
    return { qPerm: permQ, cPerm: cPerm, qConc: q, cConc: ions, pConc: p, stages: stages };
  }

  // Подбор давления бисекцией под целевой пермеат
  function solvePass(passCfg, feedQ, feedIons, targetPerm, tempC, opts, db) {
    var piF = osmoticPressure(feedIons, tempC);
    var lo = piF + 0.3, hi = opts.pMaxSolve || 85;
    var run = function (P) { return simulatePass(passCfg, feedQ, feedIons, P, tempC, opts, db); };
    var rHi = run(hi);
    if (rHi.qPerm < targetPerm) return { pressure: hi, result: rHi, unreachable: true };
    var res = null, P = 0;
    for (var i = 0; i < 60; i++) {
      P = (lo + hi) / 2;
      res = run(P);
      if (Math.abs(res.qPerm - targetPerm) / targetPerm < 5e-4) break;
      if (res.qPerm > targetPerm) hi = P; else lo = P;
    }
    return { pressure: P, result: res, unreachable: false };
  }

  // ---------- Карбонатное равновесие: pH пермеата и концентрата ----------
  // CO2 проходит мембрану свободно: [CO2] одинакова во всех потоках.
  function pk1(tempC) { // первая константа угольной кислоты (аппроксимация)
    return 6.35 - 0.006 * (tempC - 25);
  }
  function co2FromFeed(ions, ph, tempC) { // мг/л CO2
    var hco3M = molar('HCO3', ions.HCO3 || 0);
    var co2M = hco3M * Math.pow(10, pk1(tempC) - ph);
    return co2M * 44.01 * 1000;
  }
  function phFromHCO3CO2(hco3_mgl, co2_mgl, tempC) {
    var h = molar('HCO3', hco3_mgl), c = co2_mgl / 44.01 / 1000;
    if (h <= 1e-12 || c <= 1e-12) return null;
    return pk1(tempC) + Math.log10(h / c);
  }

  // ---------- Scaling ----------
  function ionicStrength(ions) {
    var I = 0;
    ION_KEYS.forEach(function (k) {
      var z = IONS[k].z;
      if (z !== 0) I += 0.5 * molar(k, ions[k] || 0) * z * z;
    });
    return I;
  }
  function daviesGamma(z, I, tempC) {
    var A = 0.509 + 0.0009 * (tempC - 25);
    var sq = Math.sqrt(I);
    var logg = -A * z * z * (sq / (1 + sq) - 0.3 * I);
    return Math.pow(10, logg);
  }
  function pK2carb(tempC) { var Tk = 273.15 + tempC; return 2902.39 / Tk + 0.02379 * Tk - 6.498; }
  function pKspCalcite(tempC) {
    var Tk = 273.15 + tempC;
    return -(-171.9065 - 0.077993 * Tk + 2839.319 / Tk + 71.595 * Math.log(Tk) / Math.LN10);
  }

  // ions/pH концентрата -> индексы; sat в процентах (100 = насыщение)
  function scaling(ions, ph, tempC) {
    var I = ionicStrength(ions);
    var g1 = daviesGamma(1, I, tempC), g2 = daviesGamma(2, I, tempC);
    var ca = molar('Ca', ions.Ca || 0), hco3 = molar('HCO3', ions.HCO3 || 0);
    var so4 = molar('SO4', ions.SO4 || 0), ba = molar('Ba', ions.Ba || 0);
    var sr = molar('Sr', ions.Sr || 0), f = molar('F', ions.F || 0);
    var lsi = null;
    if (ca > 1e-9 && hco3 > 1e-9 && ph !== null) {
      var pHs = pK2carb(tempC) - pKspCalcite(tempC)
        - Math.log10(ca * g2) - Math.log10(hco3 * g1);
      lsi = ph - pHs;
    }
    function sat(ip, ksp) { return ip / ksp * 100; }
    var res = {
      lsi: lsi,
      ionicStrength: I,
      sat: {
        CaSO4: sat(ca * g2 * so4 * g2, Math.pow(10, -4.58)),
        BaSO4: sat(ba * g2 * so4 * g2, Math.pow(10, -9.97)),
        SrSO4: sat(sr * g2 * so4 * g2, Math.pow(10, -6.63)),
        CaF2:  sat(ca * g2 * f * g1 * f * g1, Math.pow(10, -10.6)),
        SiO2:  (ions.SiO2 || 0) / silicaSolubility(tempC, ph) * 100
      }
    };
    res.advice = scalingAdvice(res);
    return res;
  }
  function silicaSolubility(tempC, ph) { // мг/л, аппроксимация кривой DuPont
    var base = 1.87 * tempC + 73;
    var k = (ph !== null && ph > 7.8) ? 1 + Math.min(1.5, (ph - 7.8) * 0.25) : 1;
    return base * k;
  }
  function scalingAdvice(sc) {
    var a = [];
    if (sc.lsi !== null && sc.lsi > 1.8) a.push('LSI ' + sc.lsi.toFixed(2) + ': высокий риск CaCO3 - рекомендуется колонна умягчения перед RO (или антискалант + подкисление)');
    else if (sc.lsi !== null && sc.lsi > 0) a.push('LSI ' + sc.lsi.toFixed(2) + ' > 0: осадкообразование CaCO3 - требуется антискалант');
    if (sc.sat.CaSO4 > 80) a.push('CaSO4 ' + sc.sat.CaSO4.toFixed(0) + '%: риск сульфатных отложений - антискалант, снизить recovery');
    if (sc.sat.BaSO4 > 80) a.push('BaSO4 ' + sc.sat.BaSO4.toFixed(0) + '%: барит практически нерастворим - антискалант обязателен');
    if (sc.sat.SrSO4 > 80) a.push('SrSO4 ' + sc.sat.SrSO4.toFixed(0) + '%: риск отложений - антискалант');
    if (sc.sat.CaF2 > 80) a.push('CaF2 ' + sc.sat.CaF2.toFixed(0) + '%: риск отложений фторида кальция');
    if (sc.sat.SiO2 > 90) a.push('SiO2 ' + sc.sat.SiO2.toFixed(0) + '%: кремниевые отложения - снизить recovery или спец. антискалант');
    if (!a.length) a.push('Осадкообразование в допустимых пределах - антискалант не требуется');
    return a;
  }

  // ---------- Проверка лимитов проектирования (тип воды) ----------
  function checkLimits(passResults, waterType, tempC, db) {
    var w = [];
    passResults.forEach(function (pr, pi) {
      var pn = passResults.length > 1 ? 'Проход ' + (pi + 1) + ', ' : '';
      // второй проход питается пермеатом первого - лимиты для него по типу «Пермеат RO»
      var wt = pi === 0 ? waterType : 'ro_permeate';
      pr.res.stages.forEach(function (st, si) {
        var lim = st.mem.limits[wt];
        if (!lim) return;
        var sn = pn + 'ступень ' + (si + 1);
        if (st.feedPerVessel > lim.qFeedMax_m3h)
          w.push(sn + ': подача на корпус ' + st.feedPerVessel.toFixed(2) + ' м3/ч выше максимума ' + lim.qFeedMax_m3h + ' м3/ч');
        var last = st.elements[st.elements.length - 1];
        if (last.qConc < lim.qConcMin_m3h)
          w.push(sn + ': поток концентрата ' + last.qConc.toFixed(2) + ' м3/ч ниже минимума ' + lim.qConcMin_m3h + ' м3/ч - риск осадкообразования');
        st.elements.forEach(function (el, ei) {
          if (el.qPerm > lim.qPermMax_m3h)
            w.push(sn + ', элемент ' + (ei + 1) + ': пермеат ' + el.qPerm.toFixed(2) + ' м3/ч выше лимита ' + lim.qPermMax_m3h + ' м3/ч');
          if (el.beta > 1.2)
            w.push(sn + ', элемент ' + (ei + 1) + ': beta ' + el.beta.toFixed(2) + ' > 1.20 - концентрационная поляризация');
        });
        if (pr.pressure > lim.pMax_bar)
          w.push(sn + ': давление ' + pr.pressure.toFixed(1) + ' бар выше максимума ' + lim.pMax_bar + ' бар для ' + st.mem.name);
        // средний flux по ступени против рекомендации для типа воды
        var sArea = st.cfg.vessels * st.cfg.elements * st.mem.area_m2;
        var sPerm = 0;
        st.elements.forEach(function (el) { sPerm += el.qPerm * st.cfg.vessels; });
        var avgFlux = sPerm * 1000 / sArea;
        if (avgFlux > lim.fluxMax_lmh)
          w.push(sn + ': средний flux ' + avgFlux.toFixed(1) + ' LMH выше рекомендуемого ' + lim.fluxMax_lmh + ' LMH для этого типа воды');
      });
    });
    return w;
  }

  // ---------- Главная функция проектирования ----------
  // cfg = {
  //   ions, ph, tempC, waterType,            // анализ и условия
  //   feedFlow_m3h, recovery (0..1),         // производительность (по подаче)
  //   ff (0.85), spi (1.0),                  // fouling factor, рост солепроницаемости
  //   passes: [ {stages:[{vessels,elements,membrane}], recovery? (для 2-го прохода)} ],
  //   recycleP2Conc: true                    // концентрат 2-го прохода -> в подачу 1-го
  // }
  function project(cfg, membranes) {
    var db = { byName: {}, coefs: {} };
    membranes.forEach(function (m) { db.byName[m.name] = m; db.coefs[m.name] = transportCoefs(m); });
    var opts = { ff: cfg.ff || 0.85, spi: cfg.spi || 1.0, pMaxSolve: cfg.pMaxSolve || 85 };
    var tempC = cfg.tempC, ions = cfg.ions;
    var co2 = co2FromFeed(ions, cfg.ph, tempC);

    var rawQ = cfg.feedFlow_m3h;
    var target1 = rawQ * cfg.recovery;
    var passResults = [];
    var p2 = cfg.passes.length > 1 ? cfg.passes[1] : null;
    var recycleQ = 0, recycleIons = blankIons();

    // с рециклом концентрата 2-го прохода схема сходится за несколько итераций
    var final1 = null, final2 = null;
    for (var loop = 0; loop < (p2 && cfg.recycleP2Conc ? 8 : 1); loop++) {
      var q1 = rawQ + recycleQ;
      var mix = blankIons();
      ION_KEYS.forEach(function (k) {
        mix[k] = (rawQ * (ions[k] || 0) + recycleQ * (recycleIons[k] || 0)) / q1;
      });
      // итоговый пермеат системы = пермеат 2-го прохода, значит пермеата 1-го нужно target1/recovery2
      var need1 = p2 ? target1 / (p2.recovery || 0.85) : target1;
      final1 = solvePass(cfg.passes[0], q1, mix, Math.min(need1, q1 * 0.95), tempC, opts, db);
      if (!p2) break;
      var feed2Q = final1.result.qPerm;
      var target2 = feed2Q * (p2.recovery || 0.85);
      final2 = solvePass(p2, feed2Q, final1.result.cPerm, target2, tempC, opts, db);
      var newRecQ = cfg.recycleP2Conc ? final2.result.qConc : 0;
      var conv = Math.abs(newRecQ - recycleQ) < 0.001 * Math.max(0.01, newRecQ);
      recycleQ = newRecQ; recycleIons = final2.result.cConc;
      if (conv) break;
    }
    passResults.push({ pressure: final1.pressure, res: final1.result, unreachable: final1.unreachable });
    if (final2) passResults.push({ pressure: final2.pressure, res: final2.result, unreachable: final2.unreachable });

    var last = final2 ? final2 : final1;
    var permIons = last.result.cPerm;
    var permQ = last.result.qPerm;
    // дренаж: концентрат 1-го прохода; без рецикла к нему добавляется концентрат 2-го
    var concQ = final1.result.qConc;
    var concIons = final1.result.cConc;
    if (final2 && !cfg.recycleP2Conc) {
      var c2q = final2.result.qConc;
      var blend = blankIons();
      ION_KEYS.forEach(function (k) {
        blend[k] = (concQ * (concIons[k] || 0) + c2q * (final2.result.cConc[k] || 0)) / (concQ + c2q);
      });
      concQ += c2q;
      concIons = blend;
    }

    var sums = summarize(permIons);
    var concSums = summarize(concIons);
    var phPerm = phFromHCO3CO2(permIons.HCO3 || 0, co2, tempC);
    var phConc = phFromHCO3CO2(concIons.HCO3 || 0, co2, tempC);
    var sc = scaling(concIons, phConc !== null ? phConc : cfg.ph, tempC);

    var warnings = checkLimits(passResults, cfg.waterType, tempC, db);
    passResults.forEach(function (pr, i) {
      if (pr.unreachable) warnings.unshift('Проход ' + (i + 1) + ': целевая производительность недостижима даже при ' + opts.pMaxSolve + ' бар - добавьте элементы или снизьте recovery');
    });

    return {
      passes: passResults,
      feed: { q: rawQ, ions: ions, tds: summarize(ions).tds, ph: cfg.ph },
      permeate: { q: permQ, ions: permIons, tds: sums.tds, ph: phPerm },
      concentrate: { q: concQ, ions: concIons, tds: concSums.tds, ph: phConc },
      systemRecovery: permQ / rawQ,
      scaling: sc,
      warnings: warnings,
      co2_mgl: co2
    };
  }

  var RO = {
    IONS: IONS, ION_KEYS: ION_KEYS, EQ_CACO3: EQ_CACO3,
    blankIons: blankIons, meq: meq, molar: molar,
    summarize: summarize, autoBalance: autoBalance, ionsFromTDS: ionsFromTDS,
    osmoticPressure: osmoticPressure, tcf: tcf,
    transportCoefs: transportCoefs, simulateElement: simulateElement,
    simulatePass: simulatePass, solvePass: solvePass,
    scaling: scaling, silicaSolubility: silicaSolubility,
    co2FromFeed: co2FromFeed, phFromHCO3CO2: phFromHCO3CO2,
    checkLimits: checkLimits, project: project
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = RO;
  else global.RO = RO;
})(typeof window !== 'undefined' ? window : globalThis);
