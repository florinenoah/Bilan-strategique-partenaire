// js/public.js
import { subscribeToChanges } from './db.js';

const TOTAL_TEAMS = 27;

// Le répertoire complet des équipes (pour afficher les non-notées aussi)
const TEAMS_DIRECTORY = [
  { id: 1, name: "Equipe 1-Dragon", members: "arnoldeutou, abateabate, adogospel, Abre-Bridge, ADONYA237" },
  { id: 2, name: "Equipe 2-Phoenix", members: "Asanflo, Byron-voldigoad, Bello-dev, bryana08, BriandMbeumo" },
  { id: 3, name: "Equipe 3-Wolf", members: "ChimiRonaldTchatchouang, christotop5, cedarroyal21, clivedev237, CharlisC" },
  { id: 4, name: "Equipe 4-Thunder", members: "DENMOUNS, Cora-jm, COD-truth, CORNEIL333, delanotoungsi-dev" },
  { id: 5, name: "Equipe 5-Blaze", members: "EsdrasDassi77, Elisabeth202018, edwards-lea, djoukosocrate, ekwanefranck29-ux" },
  { id: 6, name: "Equipe 6-Lion", members: "FDD-io, F4Hope, FranckALPHA, Gabrielle-ongbenak, Evaqueen-tech" },
  { id: 7, name: "Equipe 7-Scorpion", members: "Gunter05, Hydrazill, Hanns67, JedidiaDev, jean237-beats" },
  { id: 8, name: "Equipe 8-Tiger", members: "JeffreyYAJ, Josiasange37, kaezerFranck, Jires113, kerildarel-ctrl" },
  { id: 9, name: "Equipe 9-Nova", members: "koptichi, kongnyuroger, galileekamdem, lalanelarcier-ai, kuetevaldo" },
  { id: 10, name: "Equipe 10-Storm", members: "LimaJuni, laurisNgoufack, lesinfosspecial-wq, lewaliangy-dot, LuckyDivina" },
  { id: 11, name: "Equipe 11-Cobra", members: "maximedoaw, luckymusk5, Manuelakam, Maestr0-Dev, Marsouel-dev" },
  { id: 12, name: "Equipe 12-Titan", members: "mohamedelbachir, mbyChristian, MenelasJunior1, mbeajeandorianzanoch-ux, Meppa265" },
  { id: 13, name: "Equipe 13-Nexus", members: "mhbbayihe, eliote-geeks, MyecLaD91, Chris-Manuelpipo, monopole0715" },
  { id: 14, name: "Equipe 14-Pulse", members: "NESFNESF, Njokoy, NehemieTuring, nikamanejunior-pixel, noumedempriccnp-hub" },
  { id: 15, name: "Equipe 15-Vanguard", members: "patrickassako, ntabet20, OmgbakeviN, psycho237-prog, ongueamassoka-hue" },
  { id: 16, name: "Equipe 16-Fox", members: "Rizinkovic, Romeofresnel, RalphonJustin, raven6712, RayanCoder681" },
  { id: 17, name: "Equipe 17-Gorilla", members: "Sabo110, Sideyouss, Silent-bat, s5824673" },
  { id: 18, name: "Equipe 18-Panther", members: "SteveJor, talladaryl, Yann-morpheus, Tatum237, theana-metya" },
  { id: 19, name: "Equipe 19-Shark", members: "Yamar007, TheSolver0, tedyclivel, Yvan69, tchindatchenetsuvaldobloir" },
  { id: 20, name: "Equipe 20-Hornet", members: "erickandongo, Maestro-jr, rdzouk, habibsamuel, evinacliff-cloud" },
  { id: 21, name: "Equipe 21-Trident", members: "jeremie-ndjock, royce-pixel, eL-prof55, mike22-max, fopossialex8-alt" },
  { id: 22, name: "Equipe 22-Volcano", members: "Beluissidoine, tjlamelo, Tiako237, infinty170406, eloundouottou6-ctrl" },
  { id: 23, name: "Equipe 23-Comet", members: "alice-crypto, ArisRoman, Florent20, ulrichsaliou7-rgb, tianiyonga-sketch" },
  { id: 24, name: "Equipe 24-Orbit", members: "ngwanoloic256-netizen, TKBille, bobdelbe-afk" },
  { id: 25, name: "Equipe 25-Guardian", members: "Achaire-Zogo, QUASAR-30, esthera-tiago, Allandev-up" },
  { id: 26, name: "Equipe 26-Arrow", members: "MrEndf, yvanngouana, fnoahngono-ship-it, tchindabrenda011-collab" },
  { id: 27, name: "Equipe 27-Inferno", members: "Tchantchou1, gregalexandre17b-godson, edmondlandry08-rgb, juanngambi-source" }
];

const DEFAULT_SOLOS = [
  { id: "solo-1", name: "Alexandre Mbarga", project: "Vora Express Mobility", github: "https://github.com/alex-mbarga/vora-express" },
  { id: "solo-2", name: "Brenda Talla", project: "SmartRide Douala", github: "https://github.com/brenda-talla/smartride" },
  { id: "solo-3", name: "Cedric Kamdem", project: "Vora Flow Urban", github: "https://github.com/ckamdem/vora-flow" }
];

const CRITERIA_KEYS = [
  { key: 'innovation', max: 20, title: 'Innovation' },
  { key: 'pertinence', max: 15, title: 'Pertinence' },
  { key: 'fonctionnalites', max: 15, title: 'Fonctionnalités' },
  { key: 'technique', max: 15, title: 'Qualité technique' },
  { key: 'uiux', max: 10, title: 'UI / UX' },
  { key: 'video', max: 10, title: 'Vidéo' },
  { key: 'impact', max: 10, title: 'Impact' },
  { key: 'github', max: 5, title: 'GitHub' }
];

// Nombre de colonnes total du tableau (13 existantes + 1 nouvelle "Avis")
const TABLE_COLSPAN = 14;

let evaluations = {};
let soloEvaluations = {};
let chartCurve = null;
let chartDonut = null;
let chartRadar = null;

// ============================================================
// AVIS DU JURY — Helpers
// ============================================================

const NOTE_TRUNCATE_LENGTH = 100;

/** Échappe le HTML pour prévenir toute injection via Firestore. */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Retourne la cellule avec l'icône 💬 (cliquable ou non). */
function buildCommentCell(candidateId, note, type) {
  const hasNote = note && String(note).trim().length > 0;
  if (!hasNote) {
    return `<td class="comment-cell"><span class="btn-comment empty" title="Aucun commentaire du jury">💬</span></td>`;
  }
  const rowId = `comment-${type}-${candidateId}`;
  return `<td class="comment-cell">
    <button class="btn-comment" onclick="toggleComment('${rowId}', this)" title="Voir l'avis du jury" aria-label="Voir l'avis du jury">💬</button>
  </td>`;
}

/** Retourne la ligne dépliable contenant le commentaire. */
function buildCommentRow(candidateId, note, type, colspan = TABLE_COLSPAN) {
  const rowId = `comment-${type}-${candidateId}`;
  const fullText = (note && String(note).trim()) || '';
  const hasNote = fullText.length > 0;
  const needsTruncate = hasNote && fullText.length > NOTE_TRUNCATE_LENGTH;

  const shortText = needsTruncate
    ? fullText.slice(0, NOTE_TRUNCATE_LENGTH).trimEnd() + '…'
    : fullText;

  let bodyHtml;
  if (!hasNote) {
    bodyHtml = `<em class="quote-empty">Aucun commentaire n'a encore été rédigé par le jury pour ce candidat.</em>`;
  } else if (needsTruncate) {
    bodyHtml = `
      <span class="quote-short">${escapeHtml(shortText)}</span>
      <span class="quote-full" style="display:none;">${escapeHtml(fullText)}</span>
      <button class="btn-see-more" onclick="expandQuote(this)" data-short-label="Voir plus" data-full-label="Voir moins">Voir plus</button>
    `;
  } else {
    bodyHtml = `<span class="quote-short">${escapeHtml(fullText)}</span>`;
  }

  return `
    <tr class="comment-row hidden" id="${rowId}">
      <td colspan="${colspan}">
        <div class="jury-quote">
          ${bodyHtml}
          <span class="jury-author">Avis du jury</span>
        </div>
      </td>
    </tr>
  `;
}

/** Ouvre / ferme la ligne de commentaire. */
function toggleComment(rowId, btn) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const willOpen = row.classList.contains('hidden');
  row.classList.toggle('hidden');
  if (btn) btn.classList.toggle('open', willOpen);
}

/** Bascule tronqué ↔ complet. */
function expandQuote(btn) {
  const quote = btn.closest('.jury-quote');
  if (!quote) return;
  const short = quote.querySelector('.quote-short');
  const full  = quote.querySelector('.quote-full');
  if (!short || !full) return;

  const isExpanded = full.style.display !== 'none';
  if (isExpanded) {
    full.style.display = 'none';
    short.style.display = '';
    btn.textContent = btn.dataset.shortLabel || 'Voir plus';
  } else {
    full.style.display = '';
    short.style.display = 'none';
    btn.textContent = btn.dataset.fullLabel || 'Voir moins';
  }
}

// ============================================================
// CALCULS
// ============================================================

function isTeamEvaluated(team) {
  if (!team) return false;
  const scores = Object.values(team.scores || {});
  return scores.some(s => s > 0) || (team.notes && team.notes.trim().length > 0);
}

function calculateTotal(team) {
  let total = 0;
  for (const c of CRITERIA_KEYS) {
    total += parseFloat((team.scores && team.scores[c.key]) || 0);
  }
  return Math.min(100, total);
}

function getGradeInfo(totalScore) {
  if (totalScore >= 90) return { label: 'Excellent 🏆', cls: 'badge-excellent' };
  if (totalScore >= 80) return { label: 'Très bon ⭐', cls: 'badge-very-good' };
  if (totalScore >= 70) return { label: 'Bon 👍', cls: 'badge-good' };
  if (totalScore >= 60) return { label: 'Assez bon ✔️', cls: 'badge-fair' };
  return { label: 'À améliorer ⚠️', cls: 'badge-improve' };
}

// Fusionne le répertoire officiel avec les données Firestore
function mergeWithDirectory(remoteTeams) {
  const merged = {};
  TEAMS_DIRECTORY.forEach(t => {
    const remote = remoteTeams ? remoteTeams[t.id] : null;
    if (remote) {
      merged[t.id] = {
        ...remote,
        name: t.name,
        members: t.members,
        scores: remote.scores || {
          innovation: 0, pertinence: 0, fonctionnalites: 0,
          technique: 0, uiux: 0, video: 0, impact: 0, github: 0
        },
        notes: remote.notes || ""
      };
    } else {
      merged[t.id] = {
        id: t.id,
        name: t.name,
        members: t.members,
        scores: {
          innovation: 0, pertinence: 0, fonctionnalites: 0,
          technique: 0, uiux: 0, video: 0, impact: 0, github: 0
        },
        notes: ""
      };
    }
  });
  return merged;
}

// Fusionne les données des candidats solo
function mergeSolos(remoteSolos) {
  const localSolos = JSON.parse(localStorage.getItem('vora_solos') || '{}');
  const source = (remoteSolos && Object.keys(remoteSolos).length > 0)
    ? remoteSolos
    : (Object.keys(localSolos).length > 0 ? localSolos : {});

  const merged = {};
  if (Object.keys(source).length === 0) {
    DEFAULT_SOLOS.forEach(s => {
      merged[s.id] = {
        ...s,
        scores: { innovation: 0, pertinence: 0, fonctionnalites: 0, technique: 0, uiux: 0, video: 0, impact: 0, github: 0 },
        notes: ""
      };
    });
  } else {
    Object.keys(source).forEach(id => {
      const s = source[id];
      merged[id] = {
        id: s.id || id,
        name: s.name || "Candidat Solo",
        project: s.project || "",
        github: s.github || "",
        scores: s.scores || { innovation: 0, pertinence: 0, fonctionnalites: 0, technique: 0, uiux: 0, video: 0, impact: 0, github: 0 },
        notes: s.notes || ""
      };
    });
  }
  return merged;
}

// ============================================================
// SWITCH VIEW
// ============================================================

function switchView(viewName) {
  const views = {
    leaderboard: document.getElementById('leaderboardView'),
    solo: document.getElementById('soloView'),
    analytics: document.getElementById('analyticsView'),
    criteria: document.getElementById('criteriaView')
  };
  const tabs = {
    leaderboard: document.getElementById('tabLeaderboardBtn'),
    solo: document.getElementById('tabSoloBtn'),
    analytics: document.getElementById('tabAnalyticsBtn'),
    criteria: document.getElementById('tabCriteriaBtn')
  };

  Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });
  Object.values(tabs).forEach(t => { if (t) t.classList.remove('active'); });

  if (views[viewName]) views[viewName].style.display = 'block';
  if (tabs[viewName]) tabs[viewName].classList.add('active');

  if (viewName === 'leaderboard') renderLeaderboard();
  if (viewName === 'solo') renderSoloLeaderboard();
  if (viewName === 'analytics') renderAnalytics();
}

// ============================================================
// RENDER LEADERBOARD (ÉQUIPES)
// ============================================================

function renderLeaderboard() {
  const tbody = document.getElementById('recapTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const teamList = Object.values(evaluations).map(t => {
    const total = calculateTotal(t);
    return { ...t, total, grade: getGradeInfo(total) };
  });

  teamList.sort((a, b) => b.total - a.total);

  teamList.forEach((team, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); font-weight: bold; color: ${index < 3 ? 'var(--amber)' : 'var(--text-muted)'};">
        ${index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : '#' + (index + 1)}
      </td>
      <td class="team-cell">${escapeHtml(team.name)}</td>
      <td class="members-cell" title="${escapeHtml(team.members)}">${escapeHtml(team.members) || '-'}</td>
      <td>${team.scores.innovation || 0}</td>
      <td>${team.scores.pertinence || 0}</td>
      <td>${team.scores.fonctionnalites || 0}</td>
      <td>${team.scores.technique || 0}</td>
      <td>${team.scores.uiux || 0}</td>
      <td>${team.scores.video || 0}</td>
      <td>${team.scores.impact || 0}</td>
      <td>${team.scores.github || 0}</td>
      <td class="score-cell">${team.total}</td>
      <td><span class="grade-badge ${team.grade.cls}" style="font-size: 11px; padding: 3px 8px;">${team.grade.label}</span></td>
      ${buildCommentCell(team.id, team.notes, 'team')}
    `;
    tbody.appendChild(tr);

    // Ligne dépliable du commentaire
    const temp = document.createElement('tbody');
    temp.innerHTML = buildCommentRow(team.id, team.notes, 'team', TABLE_COLSPAN);
    tbody.appendChild(temp.firstElementChild);
  });
}

// ============================================================
// RENDER SOLO LEADERBOARD (PARTICIPANTS SOLO)
// ============================================================

function renderSoloLeaderboard() {
  const tbody = document.getElementById('soloTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const soloList = Object.values(soloEvaluations).map(s => {
    const total = calculateTotal(s);
    return { ...s, total, grade: getGradeInfo(total) };
  });

  soloList.sort((a, b) => b.total - a.total);

  if (soloList.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="${TABLE_COLSPAN}" style="text-align: center; padding: 30px; color: var(--text-muted); font-family: var(--font-mono);">
        Aucun participant solo pour le moment.
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  soloList.forEach((solo, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); font-weight: bold; color: ${index < 3 && solo.total > 0 ? 'var(--amber)' : 'var(--text-muted)'};">
        ${index === 0 && solo.total > 0 ? '🥇 1' : index === 1 && solo.total > 0 ? '🥈 2' : index === 2 && solo.total > 0 ? '🥉 3' : '#' + (index + 1)}
      </td>
      <td class="team-cell">
        <strong>${escapeHtml(solo.name)}</strong> <span class="solo-tag" style="margin-left: 6px;">Solo</span>
      </td>
      <td class="members-cell" title="${escapeHtml(solo.project) || '-'}">
        <span>${escapeHtml(solo.project) || '-'}</span>
        ${solo.github ? `<br><a href="${escapeHtml(solo.github)}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: var(--teal);">🔗 GitHub</a>` : ''}
      </td>
      <td>${solo.scores.innovation || 0}</td>
      <td>${solo.scores.pertinence || 0}</td>
      <td>${solo.scores.fonctionnalites || 0}</td>
      <td>${solo.scores.technique || 0}</td>
      <td>${solo.scores.uiux || 0}</td>
      <td>${solo.scores.video || 0}</td>
      <td>${solo.scores.impact || 0}</td>
      <td>${solo.scores.github || 0}</td>
      <td class="score-cell">${solo.total}</td>
      <td><span class="grade-badge ${solo.grade.cls}" style="font-size: 11px; padding: 3px 8px;">${solo.grade.label}</span></td>
      ${buildCommentCell(solo.id, solo.notes, 'solo')}
    `;
    tbody.appendChild(tr);

    const temp = document.createElement('tbody');
    temp.innerHTML = buildCommentRow(solo.id, solo.notes, 'solo', TABLE_COLSPAN);
    tbody.appendChild(temp.firstElementChild);
  });
}

// ============================================================
// RENDER ANALYTICS
// ============================================================

function renderAnalytics() {
  const teamList = Object.values(evaluations).map(t => {
    const total = calculateTotal(t);
    const isEval = isTeamEvaluated(t);
    return { ...t, total, isEval, grade: getGradeInfo(total) };
  });

  teamList.sort((a, b) => b.total - a.total);

  const evalTeams = teamList.filter(t => t.isEval);
  const evalCount = evalTeams.length;
  const sumScore = evalTeams.reduce((acc, t) => acc + t.total, 0);
  const avgScore = evalCount > 0 ? (sumScore / evalCount) : 0;
  const topTeam = teamList[0];
  const passCount = evalTeams.filter(t => t.total >= 70).length;
  const passRate = evalCount > 0 ? Math.round((passCount / evalCount) * 100) : 0;

  document.getElementById('kpiAvgScore').innerHTML = `${avgScore.toFixed(1)} <small>/ 100</small>`;
  document.getElementById('kpiAvgGrade').textContent = `Mention : ${getGradeInfo(avgScore).label}`;

  document.getElementById('kpiTopScore').innerHTML = `${topTeam ? topTeam.total : 0} <small>/ 100</small>`;
  document.getElementById('kpiTopTeamName').textContent = topTeam && topTeam.total > 0 ? topTeam.name : 'En cours d\'évaluation';

  document.getElementById('kpiPassRate').innerHTML = `${passRate} <small>%</small>`;
  document.getElementById('kpiPassCount').textContent = `${passCount} équipe(s) avec note ≥ 70 pts`;

  document.getElementById('kpiEvalCount').innerHTML = `${evalCount} <small>/ ${TOTAL_TEAMS}</small>`;
  document.getElementById('kpiEvalPercent').textContent = `${Math.round((evalCount / TOTAL_TEAMS) * 100)}% de complétion`;

  const rank1 = teamList[0];
  const rank2 = teamList[1];
  const rank3 = teamList[2];

  document.getElementById('podiumRank1Name').textContent = rank1 && rank1.total > 0 ? rank1.name : 'En attente';
  document.getElementById('podiumRank1Members').textContent = rank1 && rank1.total > 0 ? rank1.members : '-';
  document.getElementById('podiumRank1Score').textContent = rank1 && rank1.total > 0 ? `${rank1.total} / 100` : '-- / 100';

  document.getElementById('podiumRank2Name').textContent = rank2 && rank2.total > 0 ? rank2.name : 'En attente';
  document.getElementById('podiumRank2Members').textContent = rank2 && rank2.total > 0 ? rank2.members : '-';
  document.getElementById('podiumRank2Score').textContent = rank2 && rank2.total > 0 ? `${rank2.total} / 100` : '-- / 100';

  document.getElementById('podiumRank3Name').textContent = rank3 && rank3.total > 0 ? rank3.name : 'En attente';
  document.getElementById('podiumRank3Members').textContent = rank3 && rank3.total > 0 ? rank3.members : '-';
  document.getElementById('podiumRank3Score').textContent = rank3 && rank3.total > 0 ? `${rank3.total} / 100` : '-- / 100';

  // CHART 1 : Courbe
  const curveLabels = teamList.map((t, i) => `#${i + 1} ${t.name.replace('Equipe ', 'Eq.')}`);
  const curveScores = teamList.map(t => t.total);
  const avgLine = teamList.map(() => avgScore.toFixed(1));

  const ctxCurve = document.getElementById('chartCurveScores').getContext('2d');
  if (chartCurve) chartCurve.destroy();

  const gradient = ctxCurve.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(67, 217, 192, 0.45)');
  gradient.addColorStop(1, 'rgba(67, 217, 192, 0.0)');

  chartCurve = new Chart(ctxCurve, {
    type: 'line',
    data: {
      labels: curveLabels,
      datasets: [
        {
          label: 'Score de l\'équipe (/100)',
          data: curveScores,
          borderColor: '#43D9C0',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#FFB648',
          pointBorderColor: '#0B0D12',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        },
        {
          label: 'Moyenne du Hackathon',
          data: avgLine,
          borderColor: '#FFB648',
          borderWidth: 2,
          borderDash: [6, 6],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#EDEEF1', font: { family: 'IBM Plex Mono', size: 12 } } },
        tooltip: {
          backgroundColor: '#171C26',
          titleColor: '#FFB648',
          bodyColor: '#EDEEF1',
          borderColor: '#232838',
          borderWidth: 1,
          titleFont: { family: 'Space Grotesk', size: 14, weight: 'bold' },
          bodyFont: { family: 'IBM Plex Mono', size: 12 },
          padding: 12,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label} : ${context.parsed.y} pts`;
            }
          }
        }
      },
      scales: {
        y: { min: 0, max: 100, grid: { color: '#232838' }, ticks: { color: '#8A93A6', font: { family: 'IBM Plex Mono' } } },
        x: { grid: { display: false }, ticks: { color: '#8A93A6', font: { family: 'IBM Plex Mono', size: 10.5 }, maxRotation: 45, minRotation: 45 } }
      }
    }
  });

  // CHART 2 : Donut
  const mentionCounts = { 'Excellent': 0, 'Très bon': 0, 'Bon': 0, 'Assez bon': 0, 'À améliorer': 0 };
  evalTeams.forEach(t => {
    if (t.total >= 90) mentionCounts['Excellent']++;
    else if (t.total >= 80) mentionCounts['Très bon']++;
    else if (t.total >= 70) mentionCounts['Bon']++;
    else if (t.total >= 60) mentionCounts['Assez bon']++;
    else mentionCounts['À améliorer']++;
  });

  const ctxDonut = document.getElementById('chartDonutMentions').getContext('2d');
  if (chartDonut) chartDonut.destroy();

  chartDonut = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      labels: ['Excellent 🏆', 'Très bon ⭐', 'Bon 👍', 'Assez bon ✔️', 'À améliorer ⚠️'],
      datasets: [{
        data: [
          mentionCounts['Excellent'], mentionCounts['Très bon'], mentionCounts['Bon'],
          mentionCounts['Assez bon'], mentionCounts['À améliorer']
        ],
        backgroundColor: ['#43D9C0', '#FFB648', '#60A5FA', '#A78BFA', '#F87171'],
        borderColor: '#12151C',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#EDEEF1', font: { family: 'IBM Plex Mono', size: 11.5 }, boxWidth: 14 } }
      }
    }
  });

  // CHART 3 : Radar
  const radarLabels = CRITERIA_KEYS.map(c => c.title);
  const radarValues = CRITERIA_KEYS.map(c => {
    const sum = evalTeams.reduce((acc, t) => acc + (t.scores[c.key] || 0), 0);
    const avg = evalTeams.length > 0 ? (sum / evalTeams.length) : 0;
    return Math.round((avg / c.max) * 100);
  });

  const ctxRadar = document.getElementById('chartRadarSkills').getContext('2d');
  if (chartRadar) chartRadar.destroy();

  chartRadar = new Chart(ctxRadar, {
    type: 'radar',
    data: {
      labels: radarLabels,
      datasets: [{
        label: 'Performance globale (% de réussite)',
        data: radarValues,
        borderColor: '#FFB648',
        backgroundColor: 'rgba(255, 182, 72, 0.22)',
        pointBackgroundColor: '#43D9C0',
        pointBorderColor: '#0B0D12',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 100,
          angleLines: { color: '#232838' },
          grid: { color: '#232838' },
          pointLabels: { color: '#EDEEF1', font: { family: 'IBM Plex Mono', size: 11 } },
          ticks: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ============================================================
// EXPORT CSV
// ============================================================

function exportCSV() {
  let csv = "ID;Equipe;Membres;Innovation (/20);Pertinence (/15);Fonctionnalites (/15);Qualite Technique (/15);UI UX (/10);Video Pitch (/10);Impact Faisabilite (/10);GitHub (/5);Total (/100);Mention;Avis du jury\n";

  const teamList = Object.values(evaluations).sort((a, b) => calculateTotal(b) - calculateTotal(a));

  teamList.forEach(team => {
    const total = calculateTotal(team);
    const grade = getGradeInfo(total);
    const safeMembers = (team.members || '').replace(/"/g, '""');
    const safeNotes = (team.notes || '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
    csv += `${team.id};"${team.name}";"${safeMembers}";${team.scores.innovation || 0};${team.scores.pertinence || 0};${team.scores.fonctionnalites || 0};${team.scores.technique || 0};${team.scores.uiux || 0};${team.scores.video || 0};${team.scores.impact || 0};${team.scores.github || 0};${total};"${grade.label}";"${safeNotes}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "classement_vora_hackathon_27_equipes.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function exportSoloCSV() {
  let csv = "ID;Candidat;Projet;GitHub;Innovation (/20);Pertinence (/15);Fonctionnalites (/15);Qualite Technique (/15);UI UX (/10);Video Pitch (/10);Impact Faisabilite (/10);GitHub (/5);Total (/100);Mention;Avis du jury\n";

  const soloList = Object.values(soloEvaluations).sort((a, b) => calculateTotal(b) - calculateTotal(a));

  soloList.forEach(solo => {
    const total = calculateTotal(solo);
    const grade = getGradeInfo(total);
    const safeName = (solo.name || '').replace(/"/g, '""');
    const safeProject = (solo.project || '').replace(/"/g, '""');
    const safeGit = (solo.github || '').replace(/"/g, '""');
    const safeNotes = (solo.notes || '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
    csv += `${solo.id};"${safeName}";"${safeProject}";"${safeGit}";${solo.scores.innovation || 0};${solo.scores.pertinence || 0};${solo.scores.fonctionnalites || 0};${solo.scores.technique || 0};${solo.scores.uiux || 0};${solo.scores.video || 0};${solo.scores.impact || 0};${solo.scores.github || 0};${total};"${grade.label}";"${safeNotes}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "classement_vora_hackathon_solos.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// ============================================================
// SUBSCRIPTION TEMPS RÉEL
// ============================================================

subscribeToChanges((data) => {
  if (data && data.teams) {
    evaluations = mergeWithDirectory(data.teams);
    soloEvaluations = mergeSolos(data.solos);
  } else {
    evaluations = mergeWithDirectory(data);
    soloEvaluations = mergeSolos(null);
  }

  // Re-render la vue active
  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) {
    if (activeTab.id === 'tabLeaderboardBtn') renderLeaderboard();
    if (activeTab.id === 'tabSoloBtn') renderSoloLeaderboard();
    if (activeTab.id === 'tabAnalyticsBtn') renderAnalytics();
  }
});

// Affichage initial
document.addEventListener('DOMContentLoaded', () => {
  // Pré-chargement immédiat depuis le cache local pour fluidité maximale
  const localTeams = JSON.parse(localStorage.getItem('vora_teams') || '{}');
  const localSolos = JSON.parse(localStorage.getItem('vora_solos') || '{}');
  evaluations = mergeWithDirectory(localTeams);
  soloEvaluations = mergeSolos(localSolos);

  // Exposition globale pour les onclick HTML
  window.switchView = switchView;
  window.exportCSV = exportCSV;
  window.exportSoloCSV = exportSoloCSV;
  window.toggleComment = toggleComment;
  window.expandQuote = expandQuote;

  switchView('leaderboard');
});