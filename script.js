const letterChart = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  O: 6,
  P: 7,
  Q: 8,
  R: 9,
  S: 1,
  T: 2,
  U: 3,
  V: 4,
  W: 5,
  X: 6,
  Y: 7,
  Z: 8,
};

const form = document.getElementById('reading-form');
const resultsSection = document.getElementById('results');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.querySelector('.progress');
const numbersGrid = document.getElementById('numbersGrid');
const interpretationContent = document.getElementById('interpretationContent');
const compatibilityContent = document.getElementById('compatibilityContent');
const calcList = document.getElementById('calcList');
const summaryName = document.getElementById('summaryName');
const summaryPill = document.getElementById('summaryPill');
const lifePathMain = document.getElementById('lifePathMain');
const lifePathText = document.getElementById('lifePathText');
const destinyMain = document.getElementById('destinyMain');
const soulMain = document.getElementById('soulMain');
const personalityMain = document.getElementById('personalityMain');
const langToggle = document.getElementById('langToggle');
const pageTitle = document.getElementById('pageTitle');
const starsLayer = document.getElementById('stars');
const birthMonthSelect = document.getElementById('birthMonth');
const birthDaySelect = document.getElementById('birthDay');
const birthYearSelect = document.getElementById('birthYear');

let translations = null;
let currentLang = localStorage.getItem('numeros-language') || 'en';
let currentResult = null;

function createStars() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 70; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    fragment.appendChild(star);
  }
  starsLayer.appendChild(fragment);
}

function reduceSingle(value) {
  const masterNumbers = [11, 22, 33];
  let total = value;
  while (total > 9 && !masterNumbers.includes(total)) {
    total = String(total)
      .split('')
      .reduce((acc, digit) => acc + Number(digit), 0);
  }
  return total;
}

function reduceToSingleDigit(value) {
  let total = Math.abs(value);
  while (total > 9) {
    total = String(total)
      .split('')
      .reduce((acc, digit) => acc + Number(digit), 0);
  }
  return total;
}

function reduceForLifePath(month, day, year) {
  const monthReduced = reduceSingle(month);
  const dayReduced = reduceSingle(day);
  const yearReduced = reduceSingle(year);
  const combined = reduceSingle(monthReduced + dayReduced + yearReduced);
  return {
    monthReduced,
    dayReduced,
    yearReduced,
    combined,
  };
}

function getLetterValue(letter) {
  return letterChart[letter.toUpperCase()] || 0;
}

function calculateNameNumber(name) {
  const normalizedName = removeDiacritics(name);
  const letters = normalizedName.replace(/[^a-z]/gi, '');
  const total = letters.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  const reduced = reduceSingle(total);
  return { total, reduced, letters, normalizedName };
}

function calculateSoulUrge(name) {
  const normalizedName = removeDiacritics(name);
  const vowels = normalizedName.replace(/[^aeiou]/gi, '');
  const total = vowels.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  return { total, reduced: reduceSingle(total), letters: vowels, normalizedName };
}

function calculatePersonality(name) {
  const normalizedName = removeDiacritics(name);
  const consonants = normalizedName.replace(/[aeiou\s]/gi, '');
  const total = consonants.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  return { total, reduced: reduceSingle(total), letters: consonants, normalizedName };
}

function formatName(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function removeDiacritics(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function showLoading() {
  progressContainer.classList.add('is-visible');
  progressBar.style.width = '0%';
  let progress = 0;
  const interval = window.setInterval(() => {
    progress += Math.random() * 16 + 8;
    if (progress >= 94) {
      progress = 94;
      window.clearInterval(interval);
    }
    progressBar.style.width = `${progress}%`;
  }, 120);
  return interval;
}

function stopLoading(intervalId) {
  window.clearInterval(intervalId);
  progressBar.style.width = '100%';
  window.setTimeout(() => {
    progressContainer.classList.remove('is-visible');
    progressBar.style.width = '0%';
  }, 450);
}

function t(path, fallback = '') {
  if (!translations) return fallback;
  const langData = translations[currentLang] || translations.en || {};
  return path.split('.').reduce((acc, key) => acc?.[key], langData) ?? fallback;
}

function populateDateSelects() {
  const months = t('months', []);
  const monthPlaceholder = t('monthPlaceholder', 'Month');
  const dayPlaceholder = t('dayPlaceholder', 'Day');
  const yearPlaceholder = t('yearPlaceholder', 'Year');
  const currentMonth = birthMonthSelect.value;
  const currentDay = birthDaySelect.value;
  const currentYear = birthYearSelect.value;

  birthMonthSelect.innerHTML = `<option value="" disabled>${monthPlaceholder}</option>` + months
    .map((month, index) => `<option value="${index + 1}">${month}</option>`)
    .join('');
  birthDaySelect.innerHTML = `<option value="" disabled>${dayPlaceholder}</option>` + Array.from({ length: 31 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('');

  const currentYearValue = new Date().getFullYear();
  birthYearSelect.innerHTML = `<option value="" disabled>${yearPlaceholder}</option>` + Array.from({ length: 130 }, (_, index) => {
    const year = currentYearValue + 1 - index;
    return `<option value="${year}">${year}</option>`;
  }).join('');

  if (months.length) {
    birthMonthSelect.value = currentMonth || '';
  }
  birthDaySelect.value = currentDay || '';
  birthYearSelect.value = currentYear || '';
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('numeros-language', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const text = t(element.dataset.i18n, element.textContent);
    if (text) {
      element.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const placeholder = t(element.dataset.i18nPlaceholder, element.placeholder);
    if (placeholder) {
      element.placeholder = placeholder;
    }
  });

  populateDateSelects();

  const chips = langToggle.querySelectorAll('.lang-toggle__chip');
  chips.forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.lang === lang);
  });

  if (pageTitle) {
    pageTitle.textContent = lang === 'vi'
      ? 'Numeros | Máy tính numerology huyền bí'
      : 'Numeros | Mystical Numerology Calculator';
    document.title = pageTitle.textContent;
  }

  if (!currentResult) {
    summaryName.textContent = t('summaryTitle', 'Reading summary');
    summaryPill.textContent = t('summaryPillWaiting', 'Awaiting cosmic pattern');
    lifePathText.textContent = t('lifePathSummaryText', 'Your life path reveals your mission.');
  } else {
    displayResult(currentResult);
  }
}

async function loadTranslations() {
  try {
    const response = await fetch('translations.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load translations');
    translations = await response.json();
  } catch (error) {
    console.warn('Translations could not be loaded, using defaults.', error);
    translations = { en: {}, vi: {} };
  }

  setLanguage(currentLang);
}

function getInterpretation(number) {
  return {
    title: t(`interpretations.${number}.title`, 'The Path'),
    description: t(`interpretations.${number}.description`, ''),
    compatibility: t(`interpretations.${number}.compatibility`, ''),
  };
}

function getPinnacleMeaning(value) {
  const interpretation = getInterpretation(value);
  return interpretation.description || t('pinnacleNumberDescriptions.' + value, '');
}

function getChallengeMeaning(value) {
  return t('challengeNumberDescriptions.' + value, '');
}

function buildInterpretation(number) {
  const data = getInterpretation(number);
  return `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <p><strong>${t('compatibilityLabel', 'Compatibility')}:</strong> ${data.compatibility}</p>
  `;
}

function renderNumbers(result) {
  const cards = [
    {
      title: t('numberCards.lifePathTitle', 'Life Path'),
      value: result.lifePath,
      text: t('numberCards.lifePathText', 'Month {month} • Day {day} • Year {year}')
        .replace('{month}', result.lifePathDetails.monthReduced)
        .replace('{day}', result.lifePathDetails.dayReduced)
        .replace('{year}', result.lifePathDetails.yearReduced),
    },
    {
      title: t('numberCards.destinyTitle', 'Destiny / Expression'),
      value: result.destiny.reduced,
      text: t('numberCards.destinyText', 'Calculated from {count} letters in your birth name.')
        .replace('{count}', result.destiny.letters.length),
    },
    {
      title: t('numberCards.soulTitle', 'Soul Urge'),
      value: result.soul.reduced,
      text: t('numberCards.soulText', 'From the vowels in {name}.').replace('{name}', result.nameInput),
    },
    {
      title: t('numberCards.personalityTitle', 'Personality'),
      value: result.personality.reduced,
      text: t('numberCards.personalityText', 'From the consonants in {name}.').replace('{name}', result.nameInput),
    },
  ];

  numbersGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="number-card">
          <h3>${card.title}</h3>
          <p class="number-value">${card.value}</p>
          <p>${card.text}</p>
        </article>
      `,
    )
    .join('');
}

function renderCalculationSteps(result) {
  const firstPinnacle = reduceSingle(result.month + result.day);
  const secondPinnacle = reduceSingle(result.day + result.year);
  const thirdPinnacle = reduceSingle(firstPinnacle + secondPinnacle);
  const fourthPinnacle = reduceSingle(result.month + result.year);

  // First Pinnacle starts at age (36 - Life Path - 9)
  const firstStart = (36 - result.lifePath) - 9;
  const firstEnd = firstStart + 9;
  const secondPinnacleStart = firstEnd;
  const secondPinnacleEnd = secondPinnacleStart + 9;
  const thirdPinnacleStart = secondPinnacleEnd;
  const thirdPinnacleEnd = thirdPinnacleStart + 9;
  const fourthPinnacleStart = thirdPinnacleEnd;

  function renderPinnacleAge(item) {
    if (item.index === 0) {
      return t('pinnacleAgeRange.first', 'starts at age {start}, active until {end}')
        .replace('{start}', item.startAge)
        .replace('{end}', item.endAge);
    } else if (item.index === 3) {
      return t('pinnacleAgeRange.last', 'starts at age {start}, onward')
        .replace('{start}', item.startAge);
    }
    return t('pinnacleAgeRange.next', 'starts at age {start}')
      .replace('{start}', item.startAge);
  }

  const firstChallenge = reduceToSingleDigit(Math.abs(result.month - result.day));
  const secondChallenge = reduceToSingleDigit(Math.abs(result.day - result.year));
  const thirdChallenge = reduceToSingleDigit(Math.abs(firstChallenge - secondChallenge));
  const fourthChallenge = reduceToSingleDigit(Math.abs(result.month - result.year));

  const pinnacleItems = [
  {
      label: t('pinnacleLabels.first', 'First Pinnacle'),
      formula: `${result.month} + ${result.day}`,
      value: firstPinnacle,
      meaning: getPinnacleMeaning(firstPinnacle),
      startAge: firstStart,     // ← make sure it's firstStart
      endAge: firstEnd,         // ← make sure it's firstEnd
      index: 0,
    },
    {
      label: t('pinnacleLabels.second', 'Second Pinnacle'),
      formula: `${result.day} + ${result.year}`,
      value: secondPinnacle,
      meaning: getPinnacleMeaning(secondPinnacle),
      startAge: secondPinnacleStart,
      endAge: secondPinnacleEnd,
      index: 1,
    },
    {
      label: t('pinnacleLabels.third', 'Third Pinnacle'),
      formula: `${firstPinnacle} + ${secondPinnacle}`,
      value: thirdPinnacle,
      meaning: getPinnacleMeaning(thirdPinnacle),
      startAge: thirdPinnacleStart,
      endAge: thirdPinnacleEnd,
      index: 2,
    },
    {
      label: t('pinnacleLabels.fourth', 'Fourth Pinnacle'),
      formula: `${result.month} + ${result.year}`,
      value: fourthPinnacle,
      meaning: getPinnacleMeaning(fourthPinnacle),
      startAge: fourthPinnacleStart,
      index: 3,
    },
  ];

  const challengeItems = [
    {
      label: t('challengeLabels.first', 'First Challenge'),
      formula: `|${result.month} - ${result.day}|`,
      value: firstChallenge,
      meaning: getChallengeMeaning(firstChallenge),
    },
    {
      label: t('challengeLabels.second', 'Second Challenge'),
      formula: `|${result.day} - ${result.year}|`,
      value: secondChallenge,
      meaning: getChallengeMeaning(secondChallenge),
    },
    {
      label: t('challengeLabels.third', 'Third Challenge'),
      formula: `|${firstChallenge} - ${secondChallenge}|`,
      value: thirdChallenge,
      meaning: getChallengeMeaning(thirdChallenge),
    },
    {
      label: t('challengeLabels.fourth', 'Fourth Challenge'),
      formula: `|${result.month} - ${result.year}|`,
      value: fourthChallenge,
      meaning: getChallengeMeaning(fourthChallenge),
    },
  ];

  const renderBreakdown = (items) => items
    .map(
      (item) => {
        let ageHtml = '';
        if (item.startAge !== undefined) {
          ageHtml = ` <span class="calc-age">(${renderPinnacleAge(item)})</span>`;
        }
        return `
          <p><strong>${item.label}:</strong> ${item.formula} = <span class="calc-value">${item.value}</span>${ageHtml}</p>
          <p class="calc-meaning">${item.meaning}</p>
        `;
      },
    )
    .join('');

  calcList.innerHTML = `
    <div class="calc-group">
      <h3>${t('calculationLabels.lifePath', 'Life path')}</h3>
      <p><strong>${t('calculationLabels.lifePath', 'Life path')}:</strong> ${result.lifePathDetails.monthReduced} + ${result.lifePathDetails.dayReduced} + ${result.lifePathDetails.yearReduced} = <span class="calc-value">${result.lifePathDetails.combined}</span></p>
      <p><strong>${t('calculationLabels.destiny', 'Destiny')}:</strong> ${result.destiny.letters} → ${result.destiny.total} → <span class="calc-value">${result.destiny.reduced}</span></p>
      <p><strong>${t('calculationLabels.soul', 'Soul urge')}:</strong> ${result.soul.letters || '—'} → ${result.soul.total} → <span class="calc-value">${result.soul.reduced}</span></p>
      <p><strong>${t('calculationLabels.personality', 'Personality')}:</strong> ${result.personality.letters || '—'} → ${result.personality.total} → <span class="calc-value">${result.personality.reduced}</span></p>
    </div>
    <div class="calc-group">
      <h3>${t('pinnaclesTitle', 'Pinnacles')}</h3>
      ${renderBreakdown(pinnacleItems)}
    </div>
    <div class="calc-group">
      <h3>${t('challengesTitle', 'Challenges')}</h3>
      ${renderBreakdown(challengeItems)}
    </div>
  `;
}

function renderCompatibility(result) {
  const lifePath = result.lifePath;
  let pairings = [];
  if (lifePath === 1) pairings = [3, 5, 7];
  else if (lifePath === 2) pairings = [1, 4, 8];
  else if (lifePath === 3) pairings = [1, 5, 9];
  else if (lifePath === 4) pairings = [2, 6, 8];
  else if (lifePath === 5) pairings = [1, 3, 7];
  else if (lifePath === 6) pairings = [2, 4, 9];
  else if (lifePath === 7) pairings = [1, 5, 7];
  else if (lifePath === 8) pairings = [2, 4, 6];
  else if (lifePath === 9) pairings = [3, 6, 7];
  else if (lifePath === 11) pairings = [2, 7, 9];
  else if (lifePath === 22) pairings = [4, 6, 8];
  else pairings = [3, 6, 9];

  compatibilityContent.innerHTML = `
    <p>${t('compatibilityIntro', 'Your life path {number} resonates especially with {pairings}.')
      .replace('{number}', lifePath)
      .replace('{pairings}', pairings.join(', '))}</p>
    <p>${t('compatibilityNote', 'This is a brief energetic pairing, not a fixed destiny. The deeper your self-awareness, the more meaningful the connection becomes.')}</p>
  `;
}

function updateSummary(result) {
  const displayName = result.currentName && result.currentName !== result.nameInput
    ? `${result.nameInput} / ${result.currentName}`
    : result.nameInput;

  summaryName.textContent = `${displayName} • ${result.birthDate}`;
  summaryPill.textContent = getInterpretation(result.lifePath).title;
  lifePathMain.textContent = result.lifePath;
  lifePathText.textContent = getInterpretation(result.lifePath).description;
  destinyMain.textContent = result.destiny.reduced;
  soulMain.textContent = result.soul.reduced;
  personalityMain.textContent = result.personality.reduced;
}

function displayResult(result) {
  currentResult = result;
  updateSummary(result);
  renderNumbers(result);
  interpretationContent.innerHTML = buildInterpretation(result.lifePath);
  renderCompatibility(result);
  renderCalculationSteps(result);
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.14);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.3);
  context.close();
}

function getSelectedBirthDate() {
  const year = Number(birthYearSelect.value);
  const month = Number(birthMonthSelect.value);
  const day = Number(birthDaySelect.value);
  return { year, month, day };
}

function handleSubmit(event) {
  event.preventDefault();
  const fullName = formatName(document.getElementById('fullName').value);
  const currentName = formatName(document.getElementById('currentName').value || fullName);
  const { year, month, day } = getSelectedBirthDate();

  if (!fullName || !month || !day || !year) {
    window.alert(t('alerts.missingFields', 'Please provide your full birth name and birth date.'));
    return;
  }

  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (day > lastDayOfMonth) {
    window.alert(t('alerts.invalidDate', 'Please choose a valid calendar date.'));
    return;
  }

  const today = new Date();
  const selectedDate = new Date(year, month - 1, day);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (selectedDate > todayStart) {
    window.alert(t('alerts.futureDate', 'Birth date cannot be in the future.'));
    return;
  }

  const loadingTimer = showLoading();
  playChime();

  window.setTimeout(() => {
    stopLoading(loadingTimer);

    const destiny = calculateNameNumber(fullName);
    const soul = calculateSoulUrge(fullName);
    const personality = calculatePersonality(fullName);
    const lifePathDetails = reduceForLifePath(month, day, year);
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const result = {
      nameInput: fullName,
      currentName,
      birthDate,
      month,
      day,
      year,
      lifePath: lifePathDetails.combined,
      lifePathDetails,
      destiny,
      soul,
      personality,
    };

    displayResult(result);
  }, 900);
}

function toggleLanguage() {
  const nextLang = currentLang === 'en' ? 'vi' : 'en';
  setLanguage(nextLang);
}

form.addEventListener('submit', handleSubmit);
langToggle.addEventListener('click', toggleLanguage);

createStars();
loadTranslations();
