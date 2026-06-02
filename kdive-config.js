/**
 * KDive — единый источник данных.
 * Меняй здесь → обновится везде: главная + страница тура.
 */
const KDIVE_CONFIG = {

  tours: {

    redSeaNorth2026: {
      id:       "redSeaNorth2026",
      name:     "Север Красного моря",
      location: "Шарм-эль-Шейх",
      country:  "🇪🇬",
      dates:    "15–22 августа 2026",
      spots:    "SS Thistlegorm · Ras Mohamed · Tiran Island",
      spotsTotal: 12,
      spotsLeft:  6,
      status:   "active",
      url:      "dive-safari-v4-retro-light.html",

      cabins: {
        lower: 1190,
        upper: 1340,
        king:  1490,
        extra: 800,
      },
      fromCabin: "lower", // каюта для отображения "от X €"

      earlyBird: {
        enabled:  false,
        discount: 0.10,
        deadline: "2026-06-01",
      },
    },

    redSeaNorthWrecks2026: {
      id:       "redSeaNorthWrecks2026",
      name:     "Север — Рифы и рэки",
      location: "Шарм-эль-Шейх",
      country:  "🇪🇬",
      dates:    "Сентябрь 2026",
      spots:    "Thistlegorm · Abunuhas · Tiran Island · Ras Mohammed",
      spotsTotal: 12,
      spotsLeft:  12,
      status:   "soon",
      url:      "safari-north-wrecks.html",

      cabins: { lower: 1190, upper: 1340, king: 1490, extra: 800 },
      fromCabin: "lower",
      earlyBird: { enabled: false, discount: 0.10, deadline: "2026-08-01" },
    },

    redSeaSharks2026: {
      id:       "redSeaSharks2026",
      name:     "Юг — Sharks Obsession",
      location: "Хургада",
      country:  "🇪🇬",
      dates:    "17–24 октября 2026",
      spots:    "Brothers Islands · Daedalus Reef · Elphinstone Reef",
      spotsTotal: 12,
      spotsLeft:  12,
      status:   "soon",
      url:      "safari-south-sharks.html",

      cabins: { lower: 1280, upper: 1340, king: 1490, extra: 800 },
      fromCabin: "lower",
      earlyBird: { enabled: false, discount: 0.10, deadline: "2026-09-01" },
    },

  }

};

// ─── Хелперы ──────────────────────────────────────────

function _isEarlyBird(tour) {
  const eb = tour.earlyBird;
  if (!eb || !eb.enabled) return false;
  const today    = new Date(); today.setHours(0,0,0,0);
  const deadline = new Date(eb.deadline);
  return today <= deadline;
}

function _calcPrice(base, discount) {
  return Math.round(base * (1 - discount));
}

function _deadlineLabel(deadline) {
  return new Date(deadline).toLocaleDateString("ru", { day: "numeric", month: "long" });
}

// ─── Рендер ───────────────────────────────────────────

function kdiveRender() {

  // data-kdive-badge="tourId"
  // → показывает "−10% до 1 июня" или скрывает
  document.querySelectorAll("[data-kdive-badge]").forEach(el => {
    const tour = KDIVE_CONFIG.tours[el.dataset.kdiveBadge];
    if (!tour) return;
    if (_isEarlyBird(tour)) {
      const pct  = Math.round(tour.earlyBird.discount * 100);
      const date = _deadlineLabel(tour.earlyBird.deadline);
      el.textContent = `−${pct}% до ${date}`;
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // data-kdive-cabin-price="tourId:cabin"  (lower | upper | king | extra)
  // → текущая цена каюты (со скидкой если EB активен)
  document.querySelectorAll("[data-kdive-cabin-price]").forEach(el => {
    const [id, cabin] = el.dataset.kdiveCabinPrice.split(":");
    const tour = KDIVE_CONFIG.tours[id];
    if (!tour || !tour.cabins[cabin]) return;
    const base = tour.cabins[cabin];
    const eb   = _isEarlyBird(tour);
    const price = eb ? _calcPrice(base, tour.earlyBird.discount) : base;
    el.textContent = price.toLocaleString("ru");
  });

  // data-kdive-cabin-original="tourId:cabin"
  // → зачёркнутая цена (скрыта если early bird не активен)
  document.querySelectorAll("[data-kdive-cabin-original]").forEach(el => {
    const [id, cabin] = el.dataset.kdiveCabinOriginal.split(":");
    const tour = KDIVE_CONFIG.tours[id];
    if (!tour || !tour.cabins[cabin]) return;
    const eb = _isEarlyBird(tour);
    if (eb) {
      el.textContent = tour.cabins[cabin].toLocaleString("ru") + " €";
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // data-kdive-price-from="tourId"
  // → "от X €" для карточки на главной (fromCabin или lower)
  document.querySelectorAll("[data-kdive-price-from]").forEach(el => {
    const tour = KDIVE_CONFIG.tours[el.dataset.kdivePriceFrom];
    if (!tour) return;
    const cabinKey = tour.fromCabin || "lower";
    const base  = tour.cabins[cabinKey];
    const eb    = _isEarlyBird(tour);
    const price = eb ? _calcPrice(base, tour.earlyBird.discount) : base;
    el.textContent = "от " + price.toLocaleString("ru") + " €";
  });

  // data-kdive-spots="tourId"
  // → "Осталось X мест из Y"
  document.querySelectorAll("[data-kdive-spots]").forEach(el => {
    const tour = KDIVE_CONFIG.tours[el.dataset.kdiveSpots];
    if (!tour) return;
    el.innerHTML = `Осталось <b>${tour.spotsLeft}</b> из ${tour.spotsTotal}`;
  });

  // data-kdive-spots-num="tourId"
  // → просто число (для <span id="available-slots"> на лендингах)
  document.querySelectorAll("[data-kdive-spots-num]").forEach(el => {
    const tour = KDIVE_CONFIG.tours[el.dataset.kdiveSpotsNum];
    if (!tour) return;
    el.textContent = tour.spotsLeft;
  });

}

document.addEventListener("DOMContentLoaded", kdiveRender);
