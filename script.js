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

const interpretations = {
  1: {
    title: 'The Pioneer',
    description:
      'You carry the spark of initiation. Your path favors courage, independence, and the courage to move first when others hesitate.',
    compatibility: 'Best paired with life paths 3, 5, and 7 for energetic balance.',
  },
  2: {
    title: 'The Harmonizer',
    description:
      'Partnership, softness, and grace shape your journey. Your strength lies in diplomacy, empathy, and building beauty through connection.',
    compatibility: 'Flows beautifully with 1, 4, and 8.',
  },
  3: {
    title: 'The Artist',
    description:
      'Creativity, expression, and social warmth are your natural gifts. You thrive when your voice, imagination, and joy are shared openly.',
    compatibility: 'Pairs well with 1, 5, and 9.',
  },
  4: {
    title: 'The Builder',
    description:
      'You are anchored in structure, discipline, and steady progress. Your path rewards patience, reliability, and turning dreams into lasting form.',
    compatibility: 'Goes well with 2, 6, and 8.',
  },
  5: {
    title: 'The Adventurer',
    description:
      'Freedom, curiosity, and versatility guide your spirit. Your journey is filled with movement, learning, and bold experiences.',
    compatibility: 'Often shines with 1, 3, and 7.',
  },
  6: {
    title: 'The Nurturer',
    description:
      'Love, care, and responsibility are central to your path. You bring warmth, beauty, and meaningful service to the world around you.',
    compatibility: 'Finds harmony with 2, 4, and 9.',
  },
  7: {
    title: 'The Seeker',
    description:
      'You are drawn to wisdom, mystery, and inner truth. Reflection and depth become your most powerful tools for growth.',
    compatibility: 'Pairs well with 1, 5, and 7.',
  },
  8: {
    title: 'The Powerhouse',
    description:
      'Ambition, leadership, and material mastery are part of your journey. You are strongest when you balance power with integrity.',
    compatibility: 'Often resonates with 2, 4, and 6.',
  },
  9: {
    title: 'The Humanitarian',
    description:
      'Compassion and vision define your path. You are here to serve, inspire, and leave a broad, uplifting imprint on others.',
    compatibility: 'Works beautifully with 3, 6, and 7.',
  },
  11: {
    title: 'The Intuitive Master',
    description:
      'You carry heightened intuition and spiritual sensitivity. Your task is to turn inspiration into meaningful insight and luminous service.',
    compatibility: 'Best with 2, 7, and 9.',
  },
  22: {
    title: 'The Master Builder',
    description:
      'A rare blend of vision and practicality, you are meant to build something lasting and transformative. Your mission is bold yet grounded.',
    compatibility: 'Finds balance with 4, 6, and 8.',
  },
  33: {
    title: 'The Master Teacher',
    description:
      'Your life is shaped by compassion, healing, and spiritual leadership. You embody the gift of teaching through example and deep care.',
    compatibility: 'Often resonates with 3, 6, and 9.',
  },
};

const form = document.getElementById('reading-form');
const resultsSection = document.getElementById('results');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.querySelector('.progress');
const numbersGrid = document.getElementById('numbersGrid');
const interpretationContent = document.getElementById('interpretationContent');
const compatibilityContent = document.getElementById('compatibilityContent');
const calcList = document.getElementById('calcList');
const historyList = document.getElementById('historyList');
const summaryName = document.getElementById('summaryName');
const summaryPill = document.getElementById('summaryPill');
const lifePathMain = document.getElementById('lifePathMain');
const lifePathText = document.getElementById('lifePathText');
const destinyMain = document.getElementById('destinyMain');
const soulMain = document.getElementById('soulMain');
const personalityMain = document.getElementById('personalityMain');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const pdfBtn = document.getElementById('pdfBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const starsLayer = document.getElementById('stars');

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
  const letters = name.replace(/[^a-z]/gi, '');
  const total = letters.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  const reduced = reduceSingle(total);
  return { total, reduced, letters };
}

function calculateSoulUrge(name) {
  const vowels = name.replace(/[^aeiou]/gi, '');
  const total = vowels.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  return { total, reduced: reduceSingle(total), letters: vowels };
}

function calculatePersonality(name) {
  const consonants = name.replace(/[aeiou\s]/gi, '');
  const total = consonants.split('').reduce((acc, char) => acc + getLetterValue(char), 0);
  return { total, reduced: reduceSingle(total), letters: consonants };
}

function getDateParts(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function formatName(value) {
  return value.trim().replace(/\s+/g, ' ');
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

function buildInterpretation(number) {
  const data = interpretations[number];
  return `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <p><strong>Compatibility:</strong> ${data.compatibility}</p>
  `;
}

function renderNumbers(result) {
  const cards = [
    {
      title: 'Life Path',
      value: result.lifePath,
      text: `Month ${result.lifePathDetails.monthReduced} • Day ${result.lifePathDetails.dayReduced} • Year ${result.lifePathDetails.yearReduced}`,
    },
    {
      title: 'Destiny / Expression',
      value: result.destiny.reduced,
      text: `Calculated from ${result.destiny.letters.length} letters in your birth name.`,
    },
    {
      title: 'Soul Urge',
      value: result.soul.reduced,
      text: `From the vowels in ${result.nameInput}.`,
    },
    {
      title: 'Personality',
      value: result.personality.reduced,
      text: `From the consonants in ${result.nameInput}.`,
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
  calcList.innerHTML = `
    <p><strong>Life path:</strong> ${result.lifePathDetails.monthReduced} + ${result.lifePathDetails.dayReduced} + ${result.lifePathDetails.yearReduced} = ${result.lifePathDetails.combined}</p>
    <p><strong>Destiny:</strong> ${result.destiny.letters} → ${result.destiny.total} → ${result.destiny.reduced}</p>
    <p><strong>Soul urge:</strong> ${result.soul.letters || '—'} → ${result.soul.total} → ${result.soul.reduced}</p>
    <p><strong>Personality:</strong> ${result.personality.letters || '—'} → ${result.personality.total} → ${result.personality.reduced}</p>
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
    <p>Your life path ${lifePath} resonates especially with ${pairings.join(', ')}.</p>
    <p>This is a brief energetic pairing, not a fixed destiny. The deeper your self-awareness, the more meaningful the connection becomes.</p>
  `;
}

function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem('numeros-history') || '[]');
  history.unshift(entry);
  const trimmed = history.slice(0, 8);
  localStorage.setItem('numeros-history', JSON.stringify(trimmed));
  renderHistory(trimmed);
}

function renderHistory(items) {
  if (!items.length) {
    historyList.innerHTML = '<p>No readings yet. Your cosmic notes will appear here.</p>';
    return;
  }

  historyList.innerHTML = items
    .map(
      (item) => `
        <button class="history-item" type="button" data-entry='${JSON.stringify(item)}'>
          <div>
            <strong>${item.name}</strong>
            <p>${item.date} • Life Path ${item.lifePath}</p>
          </div>
          <span class="summary-card__pill">${item.destiny}/${item.soul}/${item.personality}</span>
        </button>
      `,
    )
    .join('');
}

function populateHistory() {
  const items = JSON.parse(localStorage.getItem('numeros-history') || '[]');
  renderHistory(items);
}

function updateSummary(result) {
  summaryName.textContent = `${result.nameInput} • ${result.birthDate}`;
  summaryPill.textContent = `${interpretations[result.lifePath].title}`;
  lifePathMain.textContent = result.lifePath;
  lifePathText.textContent = interpretations[result.lifePath].description;
  destinyMain.textContent = result.destiny.reduced;
  soulMain.textContent = result.soul.reduced;
  personalityMain.textContent = result.personality.reduced;
}

function displayResult(result) {
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

function copySummary() {
  const summaryText = `${summaryName.textContent}\nLife Path ${lifePathMain.textContent}\nDestiny ${destinyMain.textContent}\nSoul Urge ${soulMain.textContent}\nPersonality ${personalityMain.textContent}`;
  navigator.clipboard.writeText(summaryText).then(() => {
    copySummaryBtn.textContent = 'Copied!';
    window.setTimeout(() => {
      copySummaryBtn.textContent = 'Copy reading';
    }, 1400);
  });
}

function exportPdf() {
  const reportWindow = window.open('', '_blank', 'width=800,height=900');
  if (!reportWindow) return;

  reportWindow.document.write(`
    <html>
      <head>
        <title>Numeros Reading</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; background: #080611; color: #f8f4ff; padding: 2rem; }
          h1 { color: #ffca69; }
          .card { border: 1px solid rgba(255,255,255,0.14); border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h1>Numeros Reading</h1>
        <div class="card"><strong>Name:</strong> ${summaryName.textContent}</div>
        <div class="card"><strong>Life Path:</strong> ${lifePathMain.textContent}</div>
        <div class="card"><strong>Destiny:</strong> ${destinyMain.textContent}</div>
        <div class="card"><strong>Soul Urge:</strong> ${soulMain.textContent}</div>
        <div class="card"><strong>Personality:</strong> ${personalityMain.textContent}</div>
        <script>window.print();</script>
      </body>
    </html>
  `);
  reportWindow.document.close();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fullName = formatName(document.getElementById('fullName').value);
  const birthDate = document.getElementById('birthDate').value;
  const currentName = formatName(document.getElementById('currentName').value || fullName);

  if (!fullName || !birthDate) {
    alert('Please provide your full birth name and birth date.');
    return;
  }

  const { year, month, day } = getDateParts(birthDate);
  const today = new Date();
  const selectedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  if (selectedDate > today) {
    alert('Birth date cannot be in the future.');
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

    const result = {
      nameInput: fullName,
      currentName,
      birthDate,
      lifePath: lifePathDetails.combined,
      lifePathDetails,
      destiny,
      soul,
      personality,
    };

    displayResult(result);
    saveToHistory({
      name: `${fullName} • ${currentName}`,
      date: birthDate,
      lifePath: result.lifePath,
      destiny: result.destiny.reduced,
      soul: result.soul.reduced,
      personality: result.personality.reduced,
    });
  }, 900);
});

copySummaryBtn.addEventListener('click', copySummary);
pdfBtn.addEventListener('click', exportPdf);
clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('numeros-history');
  renderHistory([]);
});

historyList.addEventListener('click', (event) => {
  const entryButton = event.target.closest('[data-entry]');
  if (!entryButton) return;
  const entry = JSON.parse(entryButton.getAttribute('data-entry'));
  const name = entry.name.split(' • ')[0];
  document.getElementById('fullName').value = name;
  document.getElementById('birthDate').value = entry.date;
  document.getElementById('currentName').value = entry.name.split(' • ')[1] || '';
  document.getElementById('fullName').focus();
});

createStars();
populateHistory();
