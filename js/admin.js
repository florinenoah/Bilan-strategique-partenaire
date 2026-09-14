// js/admin.js
import {
  loadAllEvaluations, saveTeam,
  signInWithEmailAndPassword, onAuthStateChanged, signOut, auth
} from './db.js';
import { db } from './config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const TOTAL_TEAMS = 27;

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

let currentTeamId = 1;
let evaluations = {};
let chartCurve = null;
let chartDonut = null;
let chartRadar = null;
let saveTimer = null;

// ============================================================
// INITIALISATION
// ============================================================

async function initData() {
  let remote = null;
  try {
    remote = await loadAllEvaluations();
  } catch (e) {
    console.error("Erreur de chargement Firestore:", e);
    showToast("❌ Erreur de chargement");
  }

  evaluations = remote || {};

  TEAMS_DIRECTORY.forEach(t => {
    if (!evaluations[t.id]) {
      evaluations[t.id] = {
        id: t.id,
        name: t.name,
        members: t.members,
        scores: {
          innovation: 0, pertinence: 0, fonctionnalites: 0,
          technique: 0, uiux: 0, video: 0, impact: 0, github: 0
        },
        notes: ""
      };
    } else {
      evaluations[t.id].name = t.name;
      evaluations[t.id].members = t.members;
      if (!evaluations[t.id].scores) {
        evaluations[t.id].scores = {
          innovation: 0, pertinence: 0, fonctionnalites: 0,
          technique: 0, uiux: 0, video: 0, impact: 0, github: 0
        };
      }
    }
  });

  populateTeamSelect();
  loadTeamData(currentTeamId);
}

function populateTeamSelect() {
  const select = document.getElementById('teamSelect');
  if (!select) return;
  const targetId = currentTeamId;
  select.innerHTML = '';
  TEAMS_DIRECTORY.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    const team = evaluations[t.id];
    const isDone = isTeamEvaluated(team);
    opt.textContent = `${team.name} ${isDone ? '✓ (' + calculateTotal(team) + ' pts)' : ''}`;
    if (t.id === targetId) opt.selected = true;
    select.appendChild(opt);
  });
  select.value = targetId;
}

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

function loadTeamData(teamId) {
  currentTeamId = parseInt(teamId);
  const team = evaluations[currentTeamId];
  if (!team) return;

  document.getElementById('currentTeamBadge').textContent = `Équipe ${String(currentTeamId).padStart(2, '0')} / ${TOTAL_TEAMS}`;
  document.getElementById('currentTeamTitle').textContent = team.name;
  document.getElementById('currentTeamMembers').innerHTML = `👥 <strong>Membres :</strong> ${team.members || 'Non renseigné'}`;

  const isEval = isTeamEvaluated(team);
  document.getElementById('currentTeamStatus').textContent = isEval ? 'Statut : Évaluée ✓' : 'Statut : Non évaluée';
  document.getElementById('currentTeamStatus').style.color = isEval ? 'var(--teal)' : 'var(--text-muted)';

  for (const c of CRITERIA_KEYS) {
    const val = (team.scores && team.scores[c.key]) || 0;
    const rangeEl = document.getElementById(`range_${c.key}`);
    const numEl = document.getElementById(`score_${c.key}`);
    if (rangeEl) rangeEl.value = val;
    if (numEl) numEl.value = val;
  }

  document.getElementById('team_notes').value = team.notes || '';

  updateDisplays();
}

function syncScore(criterionKey, value) {
  const num = Math.max(0, parseFloat(value) || 0);
  const criterion = CRITERIA_KEYS.find(c => c.key === criterionKey);
  const clamped = Math.min(criterion.max, num);

  document.getElementById(`range_${criterionKey}`).value = clamped;
  document.getElementById(`score_${criterionKey}`).value = clamped;

  if (!evaluations[currentTeamId].scores) {
    evaluations[currentTeamId].scores = {};
  }
  evaluations[currentTeamId].scores[criterionKey] = clamped;

  saveToStorage();
  updateDisplays();
}

function saveCurrentTeamData() {
  evaluations[currentTeamId].notes = document.getElementById('team_notes').value;
  saveToStorage();
}

function updateDisplays() {
  const team = evaluations[currentTeamId];
  const total = calculateTotal(team);
  const grade = getGradeInfo(total);

  const totalDisplay = document.getElementById('totalScoreDisplay');
  totalDisplay.innerHTML = `${total % 1 === 0 ? total : total.toFixed(1)} <small>/ 100</small>`;

  const badge = document.getElementById('gradeBadgeDisplay');
  badge.className = `grade-badge ${grade.cls}`;
  badge.innerHTML = `<span>${grade.label}</span>`;

  document.getElementById('summaryScoreTxt').textContent = `${total} / 100`;
  document.getElementById('summaryGradeTxt').textContent = grade.label;

  let count = 0;
  for (const c of CRITERIA_KEYS) {
    if ((team.scores[c.key] || 0) > 0) count++;
  }
  document.getElementById('evaluationProgressTxt').textContent = `Progression : ${count} / ${CRITERIA_KEYS.length} critères notés`;

  populateTeamSelect();
}

// Anti-rebond : évite d'écrire dans Firestore à chaque mouvement du slider
async function saveToStorage() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await saveTeam(currentTeamId, evaluations[currentTeamId]);
      showToast("✓ Sauvegardé");
    } catch (e) {
      console.error("Erreur sauvegarde Firestore:", e);
      showToast("❌ Erreur de sauvegarde");
    }
  }, 400);
}

function showToast(msg = "Notes sauvegardées automatiquement") {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function onTeamSelected(teamId) {
  loadTeamData(teamId);
}

function nextTeam() {
  if (currentTeamId < TOTAL_TEAMS) {
    loadTeamData(currentTeamId + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showToast("Dernière équipe atteinte !");
  }
}

function prevTeam() {
  if (currentTeamId > 1) {
    loadTeamData(currentTeamId - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function resetCurrentTeamScore() {
  if (confirm(`Réinitialiser les notes de l'${evaluations[currentTeamId].name} ?`)) {
    for (const c of CRITERIA_KEYS) {
      evaluations[currentTeamId].scores[c.key] = 0;
    }
    evaluations[currentTeamId].notes = "";
    clearTimeout(saveTimer);
    await saveTeam(currentTeamId, evaluations[currentTeamId]);
    loadTeamData(currentTeamId);
    showToast("Notes réinitialisées.");
  }
}

function switchView(viewName) {
  const views = {
    evaluate: document.getElementById('evaluateView'),
    leaderboard: document.getElementById('leaderboardView'),
    analytics: document.getElementById('analyticsView'),
    criteria: document.getElementById('criteriaView')
  };
  const tabs = {
    evaluate: document.getElementById('tabEvaluateBtn'),
    leaderboard: document.getElementById('tabLeaderboardBtn'),
    analytics: document.getElementById('tabAnalyticsBtn'),
    criteria: document.getElementById('tabCriteriaBtn')
  };
  const teamBar = document.getElementById('teamBar');

  Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });
  Object.values(tabs).forEach(t => { if (t) t.classList.remove('active'); });
  teamBar.style.display = 'none';

  if (views[viewName]) views[viewName].style.display = 'block';
  if (tabs[viewName]) tabs[viewName].classList.add('active');

  if (viewName === 'evaluate') {
    teamBar.style.display = 'grid';
    loadTeamData(currentTeamId);
  } else if (viewName === 'leaderboard') {
    renderLeaderboard();
  } else if (viewName === 'analytics') {
    renderAnalytics();
  }
}

function renderLeaderboard() {
  const tbody = document.getElementById('recapTableBody');
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
      <td class="team-cell" onclick="selectAndGoToTeam(${team.id})">${team.name}</td>
      <td class="members-cell" title="${team.members}">${team.members || '-'}</td>
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
      <td>
        <button class="btn-action" style="padding: 4px 10px; font-size: 11px;" onclick="selectAndGoToTeam(${team.id})">Noter ✎</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

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

  const mentionCounts = { 'Excellent': 0, 'Très bon': 0, 'Bon': 0, 'Assez bon': 0, 'À améliorer': 0 };
  teamList.forEach(t => {
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

  const radarLabels = CRITERIA_KEYS.map(c => c.title);
  const radarValues = CRITERIA_KEYS.map(c => {
    const sum = teamList.reduce((acc, t) => acc + (t.scores[c.key] || 0), 0);
    const avg = teamList.length > 0 ? (sum / teamList.length) : 0;
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

function selectAndGoToTeam(teamId) {
  switchView('evaluate');
  loadTeamData(teamId);
}

// ============================================================
// EXPORT JSON
// ============================================================

function exportDataJSON() {
  const exporterName = prompt("Votre nom (optionnel) :") || "anonyme";
  const exportPayload = {
    _meta: {
      exportedAt: new Date().toISOString(),
      exportedBy: exporterName,
      totalTeams: TOTAL_TEAMS,
      version: "1.0"
    },
    teams: evaluations
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `vora_evaluations_${timestamp}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast("💾 Export JSON terminé !");
}

// ============================================================
// IMPORT JSON (écrit dans Firestore)
// ============================================================

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const raw = JSON.parse(e.target.result);
      const importedTeams = raw.teams ? raw.teams : raw;
      const meta = raw._meta || null;

      if (!importedTeams || typeof importedTeams !== 'object') {
        throw new Error("Format JSON invalide — aucune équipe trouvée.");
      }

      const count = Object.keys(importedTeams).length;
      if (!confirm(`Importer ${count} équipe(s) dans Firestore ?\n\nCela écrasera les données actuelles de la base.`)) {
        event.target.value = '';
        return;
      }

      // Fusionne avec le répertoire officiel (garantit la structure)
      TEAMS_DIRECTORY.forEach(t => {
        const imp = importedTeams[t.id];
        if (imp) {
          imp.id = t.id;
          imp.name = t.name;
          imp.members = t.members;
          if (!imp.scores) imp.scores = {};
          CRITERIA_KEYS.forEach(c => {
            if (typeof imp.scores[c.key] !== 'number') imp.scores[c.key] = 0;
          });
          if (typeof imp.notes !== 'string') imp.notes = '';
        } else {
          importedTeams[t.id] = {
            id: t.id, name: t.name, members: t.members,
            scores: {
              innovation: 0, pertinence: 0, fonctionnalites: 0,
              technique: 0, uiux: 0, video: 0, impact: 0, github: 0
            },
            notes: ""
          };
        }
      });

      // Écriture dans Firestore
      const DOC_REF = doc(db, "hackathon", "evaluations");
      await setDoc(DOC_REF, {
        teams: importedTeams,
        lastUpdate: new Date().toISOString()
      }, { merge: true });

      // Recharge les données locales
      evaluations = importedTeams;
      populateTeamSelect();
      loadTeamData(currentTeamId);
      updateDisplays();

      // Bandeau de statut
      const banner = document.getElementById('importStatusBanner');
      const bannerText = document.getElementById('importStatusText');
      if (banner && bannerText) {
        const src = meta
          ? ` (de ${meta.exportedBy || '?'}, le ${new Date(meta.exportedAt).toLocaleString('fr-FR')})`
          : '';
        bannerText.textContent = `✅ ${count} équipe(s) importée(s) dans Firestore${src}`;
        banner.style.display = 'block';
      }

      showToast(`✅ ${count} équipe(s) importée(s)`);

      // Rafraîchit les vues éventuellement ouvertes
      if (document.getElementById('leaderboardView').style.display !== 'none') renderLeaderboard();
      if (document.getElementById('analyticsView').style.display !== 'none') renderAnalytics();

    } catch (err) {
      console.error('Erreur import:', err);
      alert('❌ Fichier JSON invalide :\n' + err.message);
    }

    event.target.value = '';
  };

  reader.onerror = () => {
    alert('❌ Impossible de lire le fichier.');
    event.target.value = '';
  };

  reader.readAsText(file);
}

// ============================================================
// EXPORT CSV
// ============================================================

function exportCSV() {
  let csv = "ID;Equipe;Membres;Innovation (/20);Pertinence (/15);Fonctionnalites (/15);Qualite Technique (/15);UI UX (/10);Video Pitch (/10);Impact Faisabilite (/10);GitHub (/5);Total (/100);Mention;Commentaires\n";

  Object.values(evaluations).forEach(team => {
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
  showToast("Exportation CSV terminée !");
}

// ============================================================
// AUTH GATE
// ============================================================

onAuthStateChanged(auth, async (user) => {
  const loginScreen = document.getElementById('loginScreen');
  const appRoot = document.getElementById('appRoot');

  if (user) {
    loginScreen.style.display = 'none';
    appRoot.style.display = 'block';
    await initData();
  } else {
    loginScreen.style.display = 'flex';
    appRoot.style.display = 'none';
  }
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const pwd = document.getElementById('pwdInput').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';

  if (!pwd) {
    errEl.textContent = 'Entrez le mot de passe.';
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, 'admin@vora.local', pwd);
  } catch (e) {
    console.error(e);
    errEl.textContent = 'Mot de passe incorrect.';
    document.getElementById('pwdInput').value = '';
  }
});

window.handleLogout = async function() {
  if (confirm("Se déconnecter ?")) {
    await signOut(auth);
  }
};

// Exposer les fonctions utilisées dans le HTML (onclick="...")
window.switchView = switchView;
window.onTeamSelected = onTeamSelected;
window.prevTeam = prevTeam;
window.nextTeam = nextTeam;
window.syncScore = syncScore;
window.saveCurrentTeamData = saveCurrentTeamData;
window.resetCurrentTeamScore = resetCurrentTeamScore;
window.exportDataJSON = exportDataJSON;
window.importDataJSON = importDataJSON;
window.exportCSV = exportCSV;
window.selectAndGoToTeam = selectAndGoToTeam;