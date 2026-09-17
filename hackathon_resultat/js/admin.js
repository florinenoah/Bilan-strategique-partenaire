// js/admin.js
import {
  loadAllEvaluations, saveTeam, saveSolo, deleteSolo,
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

let currentCategory = 'teams'; // 'teams' | 'solos'
let currentTeamId = 1;
let currentSoloId = 'solo-1';
let evaluations = {};
let soloEvaluations = {};
let solosDirectory = [];

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

  // Lecture du cache local si Firestore est vide ou hors-ligne
  const localTeams = JSON.parse(localStorage.getItem('vora_teams') || '{}');
  const localSolos = JSON.parse(localStorage.getItem('vora_solos') || '{}');

  if (remote && remote.teams) {
    evaluations = remote.teams;
    soloEvaluations = remote.solos || {};
  } else if (remote && typeof remote === 'object' && !remote.teams) {
    evaluations = remote;
    soloEvaluations = localSolos;
  } else {
    evaluations = localTeams;
    soloEvaluations = localSolos;
  }

  // Initialisation du répertoire des équipes
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

  // Initialisation des candidats solos si vides
  if (Object.keys(soloEvaluations).length === 0) {
    DEFAULT_SOLOS.forEach(s => {
      soloEvaluations[s.id] = {
        id: s.id,
        name: s.name,
        project: s.project,
        github: s.github,
        scores: {
          innovation: 0, pertinence: 0, fonctionnalites: 0,
          technique: 0, uiux: 0, video: 0, impact: 0, github: 0
        },
        notes: ""
      };
    });
  }

  updateSolosDirectory();

  if (solosDirectory.length > 0 && !soloEvaluations[currentSoloId]) {
    currentSoloId = solosDirectory[0].id;
  }

  populateCandidateSelect();
  loadCandidateData();
}

function updateSolosDirectory() {
  solosDirectory = Object.values(soloEvaluations).map(s => ({
    id: s.id,
    name: s.name,
    project: s.project || "",
    github: s.github || ""
  }));
}

// ============================================================
// GESTION DU MODE / CATÉGORIE (ÉQUIPES VS SOLOS)
// ============================================================

function setCategory(cat) {
  currentCategory = cat;

  const btnTeams = document.getElementById('catBtnTeams');
  const btnSolos = document.getElementById('catBtnSolos');
  const labelEl = document.getElementById('candidateSelectLabel');
  const barAddSolo = document.getElementById('barAddSoloBtn');

  if (cat === 'teams') {
    if (btnTeams) btnTeams.classList.add('active');
    if (btnSolos) btnSolos.classList.remove('active');
    if (labelEl) labelEl.textContent = "Sélectionner l'équipe à évaluer";
    if (barAddSolo) barAddSolo.style.display = 'none';
  } else {
    if (btnTeams) btnTeams.classList.remove('active');
    if (btnSolos) btnSolos.classList.add('active');
    if (labelEl) labelEl.textContent = "Sélectionner le candidat solo à évaluer";
    if (barAddSolo) barAddSolo.style.display = 'inline-flex';
  }

  populateCandidateSelect();
  loadCandidateData();
}

function populateCandidateSelect() {
  const select = document.getElementById('teamSelect');
  if (!select) return;
  select.innerHTML = '';

  if (currentCategory === 'teams') {
    TEAMS_DIRECTORY.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      const team = evaluations[t.id];
      const isDone = isEvaluated(team);
      opt.textContent = `${team.name} ${isDone ? '✓ (' + calculateTotal(team) + ' pts)' : ''}`;
      if (t.id === currentTeamId) opt.selected = true;
      select.appendChild(opt);
    });
    select.value = currentTeamId;
  } else {
    if (solosDirectory.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "Aucun candidat solo enregistré";
      select.appendChild(opt);
      return;
    }

    solosDirectory.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      const solo = soloEvaluations[s.id];
      const isDone = isEvaluated(solo);
      opt.textContent = `👤 ${s.name} ${isDone ? '✓ (' + calculateTotal(solo) + ' pts)' : ''}`;
      if (s.id === currentSoloId) opt.selected = true;
      select.appendChild(opt);
    });
    select.value = currentSoloId;
  }
}

function onCandidateSelected(val) {
  if (!val) return;
  if (currentCategory === 'teams') {
    currentTeamId = parseInt(val);
  } else {
    currentSoloId = val;
  }
  loadCandidateData();
}

function getCurrentCandidate() {
  if (currentCategory === 'teams') {
    return evaluations[currentTeamId] || null;
  }
  return soloEvaluations[currentSoloId] || null;
}

// ============================================================
// CALCULS & NOTATIONS UNIFIÉS (MÊME BARÈME SUR 100 POINTS)
// ============================================================

function isEvaluated(candidate) {
  if (!candidate) return false;
  const scores = Object.values(candidate.scores || {});
  return scores.some(s => s > 0) || (candidate.notes && candidate.notes.trim().length > 0);
}

function calculateTotal(candidate) {
  if (!candidate) return 0;
  let total = 0;
  for (const c of CRITERIA_KEYS) {
    total += parseFloat((candidate.scores && candidate.scores[c.key]) || 0);
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

// ============================================================
// CHARGEMENT DE LA FICHE D'ÉVALUATION
// ============================================================

function loadCandidateData() {
  const candidate = getCurrentCandidate();
  if (!candidate) return;

  const badgeEl = document.getElementById('currentTeamBadge');
  const titleEl = document.getElementById('currentTeamTitle');
  const membersEl = document.getElementById('currentTeamMembers');
  const statusEl = document.getElementById('currentTeamStatus');

  if (currentCategory === 'teams') {
    badgeEl.textContent = `Équipe ${String(currentTeamId).padStart(2, '0')} / ${TOTAL_TEAMS}`;
    titleEl.textContent = candidate.name;
    membersEl.innerHTML = `👥 <strong>Membres :</strong> ${candidate.members || 'Non renseigné'}`;
  } else {
    const idx = solosDirectory.findIndex(s => s.id === currentSoloId) + 1;
    badgeEl.textContent = `Participant Solo ${String(idx || 1).padStart(2, '0')} / ${solosDirectory.length}`;
    titleEl.innerHTML = `👤 ${candidate.name} <span class="solo-tag" style="vertical-align: middle; margin-left: 8px;">Compétition Solo</span>`;
    const proj = candidate.project ? `🚀 <strong>Projet :</strong> ${candidate.project}` : '';
    const git = candidate.github ? `&nbsp;·&nbsp; 🔗 <strong>GitHub :</strong> <a href="${candidate.github}" target="_blank" rel="noopener noreferrer" style="color: var(--teal);">${candidate.github}</a>` : '';
    membersEl.innerHTML = proj + git || 'Participant Solo';
  }

  const isEval = isEvaluated(candidate);
  statusEl.textContent = isEval ? 'Statut : Évalué(e) ✓' : 'Statut : Non évalué(e)';
  statusEl.style.color = isEval ? 'var(--teal)' : 'var(--text-muted)';

  // Mise à jour des 8 critères pas à pas
  for (const c of CRITERIA_KEYS) {
    const val = (candidate.scores && candidate.scores[c.key]) || 0;
    const rangeEl = document.getElementById(`range_${c.key}`);
    const numEl = document.getElementById(`score_${c.key}`);
    if (rangeEl) rangeEl.value = val;
    if (numEl) numEl.value = val;
  }

  document.getElementById('team_notes').value = candidate.notes || '';

  updateDisplays();
}

// Synchrone au déplacement du curseur / saisie numérique
function syncScore(criterionKey, value) {
  const num = Math.max(0, parseFloat(value) || 0);
  const criterion = CRITERIA_KEYS.find(c => c.key === criterionKey);
  const clamped = Math.min(criterion.max, num);

  const rangeEl = document.getElementById(`range_${criterionKey}`);
  const scoreEl = document.getElementById(`score_${criterionKey}`);
  if (rangeEl) rangeEl.value = clamped;
  if (scoreEl) scoreEl.value = clamped;

  const candidate = getCurrentCandidate();
  if (!candidate) return;

  if (!candidate.scores) {
    candidate.scores = {};
  }
  candidate.scores[criterionKey] = clamped;

  saveToStorage();
  updateDisplays();
}

function saveCurrentTeamData() {
  const candidate = getCurrentCandidate();
  if (!candidate) return;
  candidate.notes = document.getElementById('team_notes').value;
  saveToStorage();
}

function updateDisplays() {
  const candidate = getCurrentCandidate();
  if (!candidate) return;

  const total = calculateTotal(candidate);
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
    if ((candidate.scores && candidate.scores[c.key]) > 0) count++;
  }
  document.getElementById('evaluationProgressTxt').textContent = `Progression : ${count} / ${CRITERIA_KEYS.length} critères notés`;

  populateCandidateSelect();
}

// Sauvegarde persistante avec anti-rebond dans Firestore et localStorage
async function saveToStorage() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      if (currentCategory === 'teams') {
        localStorage.setItem('vora_teams', JSON.stringify(evaluations));
        await saveTeam(currentTeamId, evaluations[currentTeamId]);
      } else {
        localStorage.setItem('vora_solos', JSON.stringify(soloEvaluations));
        await saveSolo(currentSoloId, soloEvaluations[currentSoloId]);
      }
      showToast("✓ Sauvegardé avec succès");
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
      showToast("❌ Erreur de sauvegarde");
    }
  }, 400);
}

function showToast(msg = "Notes sauvegardées automatiquement") {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

// Navigation précédent / suivant
function nextCandidate() {
  if (currentCategory === 'teams') {
    if (currentTeamId < TOTAL_TEAMS) {
      currentTeamId++;
      loadCandidateData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast("Dernière équipe atteinte !");
    }
  } else {
    const idx = solosDirectory.findIndex(s => s.id === currentSoloId);
    if (idx >= 0 && idx < solosDirectory.length - 1) {
      currentSoloId = solosDirectory[idx + 1].id;
      loadCandidateData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast("Dernier candidat solo atteint !");
    }
  }
}

function prevCandidate() {
  if (currentCategory === 'teams') {
    if (currentTeamId > 1) {
      currentTeamId--;
      loadCandidateData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    const idx = solosDirectory.findIndex(s => s.id === currentSoloId);
    if (idx > 0) {
      currentSoloId = solosDirectory[idx - 1].id;
      loadCandidateData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

async function resetCurrentCandidateScore() {
  const candidate = getCurrentCandidate();
  if (!candidate) return;

  const typeLabel = currentCategory === 'teams' ? "l'équipe" : "le participant solo";
  if (confirm(`Réinitialiser les notes de ${typeLabel} « ${candidate.name} » ?`)) {
    for (const c of CRITERIA_KEYS) {
      candidate.scores[c.key] = 0;
    }
    candidate.notes = "";
    clearTimeout(saveTimer);

    if (currentCategory === 'teams') {
      localStorage.setItem('vora_teams', JSON.stringify(evaluations));
      await saveTeam(currentTeamId, candidate);
    } else {
      localStorage.setItem('vora_solos', JSON.stringify(soloEvaluations));
      await saveSolo(currentSoloId, candidate);
    }

    loadCandidateData();
    showToast("Notes réinitialisées.");
  }
}

// ============================================================
// GESTIONNAIRE DES VUES / ONGLETS
// ============================================================

function switchView(viewName) {
  const views = {
    evaluate: document.getElementById('evaluateView'),
    solo: document.getElementById('soloView'),
    leaderboard: document.getElementById('leaderboardView'),
    analytics: document.getElementById('analyticsView'),
    criteria: document.getElementById('criteriaView')
  };
  const tabs = {
    evaluate: document.getElementById('tabEvaluateBtn'),
    solo: document.getElementById('tabSoloBtn'),
    leaderboard: document.getElementById('tabLeaderboardBtn'),
    analytics: document.getElementById('tabAnalyticsBtn'),
    criteria: document.getElementById('tabCriteriaBtn')
  };
  const teamBar = document.getElementById('teamBar');

  Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });
  Object.values(tabs).forEach(t => { if (t) t.classList.remove('active'); });
  if (teamBar) teamBar.style.display = 'none';

  if (views[viewName]) views[viewName].style.display = 'block';
  if (tabs[viewName]) tabs[viewName].classList.add('active');

  if (viewName === 'evaluate') {
    if (teamBar) teamBar.style.display = 'grid';
    loadCandidateData();
  } else if (viewName === 'solo') {
    renderSoloLeaderboard();
    renderSoloKPIs();
  } else if (viewName === 'leaderboard') {
    renderLeaderboard();
  } else if (viewName === 'analytics') {
    renderAnalytics();
  }
}

// ============================================================
// TABLEAU RÉCAPITULATIF DES SOLOS (ADMIN)
// ============================================================

function renderSoloLeaderboard() {
  const tbody = document.getElementById('soloRecapTableBody');
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
      <td colspan="14" style="text-align: center; padding: 30px; color: var(--text-muted); font-family: var(--font-mono);">
        Aucun participant solo enregistré pour le moment. Cliquez sur « ➕ Ajouter un Participant Solo » ci-dessus.
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
      <td class="team-cell" onclick="selectAndGoToSolo('${solo.id}')">
        <strong>${solo.name}</strong>
      </td>
      <td class="members-cell" title="${solo.project || '-'}">
        <span>${solo.project || '-'}</span>
        ${solo.github ? `<br><a href="${solo.github}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: var(--teal);">🔗 GitHub</a>` : ''}
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
      <td style="white-space: nowrap;">
        <button class="btn-action btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="selectAndGoToSolo('${solo.id}')" title="Noter ce candidat">Noter ✎</button>
        <button class="btn-action" style="padding: 4px 8px; font-size: 11px;" onclick="openAddSoloModal('${solo.id}')" title="Modifier les informations">✏️</button>
        <button class="btn-action" style="padding: 4px 8px; font-size: 11px; color: #F87171;" onclick="deleteSoloCandidate('${solo.id}')" title="Supprimer">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSoloKPIs() {
  const soloList = Object.values(soloEvaluations).map(s => {
    const total = calculateTotal(s);
    const isEval = isEvaluated(s);
    return { ...s, total, isEval, grade: getGradeInfo(total) };
  });

  soloList.sort((a, b) => b.total - a.total);

  const evalSolos = soloList.filter(s => s.isEval);
  const evalCount = evalSolos.length;
  const totalCount = soloList.length;
  const sumScore = evalSolos.reduce((acc, s) => acc + s.total, 0);
  const avgScore = evalCount > 0 ? (sumScore / evalCount) : 0;
  const topSolo = soloList[0];
  const passCount = evalSolos.filter(s => s.total >= 70).length;
  const passRate = evalCount > 0 ? Math.round((passCount / evalCount) * 100) : 0;

  const kpiAvg = document.getElementById('kpiSoloAvgScore');
  const kpiAvgGrade = document.getElementById('kpiSoloAvgGrade');
  const kpiTop = document.getElementById('kpiSoloTopScore');
  const kpiTopName = document.getElementById('kpiSoloTopTeamName');
  const kpiPassRate = document.getElementById('kpiSoloPassRate');
  const kpiPassCount = document.getElementById('kpiSoloPassCount');
  const kpiEval = document.getElementById('kpiSoloEvalCount');
  const kpiEvalPercent = document.getElementById('kpiSoloEvalPercent');

  if (kpiAvg) kpiAvg.innerHTML = `${avgScore.toFixed(1)} <small>/ 100</small>`;
  if (kpiAvgGrade) kpiAvgGrade.textContent = `Mention : ${getGradeInfo(avgScore).label}`;
  if (kpiTop) kpiTop.innerHTML = `${topSolo ? topSolo.total : 0} <small>/ 100</small>`;
  if (kpiTopName) kpiTopName.textContent = topSolo && topSolo.total > 0 ? topSolo.name : 'En cours d\'évaluation';
  if (kpiPassRate) kpiPassRate.innerHTML = `${passRate} <small>%</small>`;
  if (kpiPassCount) kpiPassCount.textContent = `${passCount} candidat(s) avec note ≥ 70 pts`;
  if (kpiEval) kpiEval.innerHTML = `${evalCount} <small>/ ${totalCount}</small>`;
  if (kpiEvalPercent) kpiEvalPercent.textContent = totalCount > 0 ? `${Math.round((evalCount / totalCount) * 100)}% de complétion` : '0%';
}

function selectAndGoToSolo(soloId) {
  setCategory('solos');
  currentSoloId = soloId;
  switchView('evaluate');
  loadCandidateData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// MODALE CANDIDAT SOLO (AJOUT / ÉDITION)
// ============================================================

function openAddSoloModal(editSoloId = null) {
  const modal = document.getElementById('addSoloModal');
  const title = document.getElementById('soloModalTitle');
  const hiddenId = document.getElementById('modalSoloId');
  const nameInp = document.getElementById('soloNameInput');
  const projInp = document.getElementById('soloProjectInput');
  const gitInp = document.getElementById('soloGithubInput');

  if (!modal) return;

  if (editSoloId && soloEvaluations[editSoloId]) {
    const s = soloEvaluations[editSoloId];
    title.textContent = "✏️ Modifier le Participant Solo";
    hiddenId.value = s.id;
    nameInp.value = s.name || "";
    projInp.value = s.project || "";
    gitInp.value = s.github || "";
  } else {
    title.textContent = "➕ Ajouter un Participant Solo";
    hiddenId.value = "";
    nameInp.value = "";
    projInp.value = "";
    gitInp.value = "";
  }

  modal.classList.add('show');
  nameInp.focus();
}

function closeAddSoloModal() {
  const modal = document.getElementById('addSoloModal');
  if (modal) modal.classList.remove('show');
}

async function handleSaveSoloModal(event) {
  event.preventDefault();

  const hiddenId = document.getElementById('modalSoloId').value;
  const name = document.getElementById('soloNameInput').value.trim();
  const project = document.getElementById('soloProjectInput').value.trim();
  const github = document.getElementById('soloGithubInput').value.trim();

  if (!name || !project) {
    alert("Veuillez renseigner le nom et le projet.");
    return;
  }

  let soloId = hiddenId;
  if (!soloId) {
    soloId = `solo-${Date.now()}`;
    soloEvaluations[soloId] = {
      id: soloId,
      name: name,
      project: project,
      github: github,
      scores: {
        innovation: 0, pertinence: 0, fonctionnalites: 0,
        technique: 0, uiux: 0, video: 0, impact: 0, github: 0
      },
      notes: ""
    };
  } else {
    soloEvaluations[soloId].name = name;
    soloEvaluations[soloId].project = project;
    soloEvaluations[soloId].github = github;
  }

  updateSolosDirectory();
  currentSoloId = soloId;

  // Persistance
  try {
    localStorage.setItem('vora_solos', JSON.stringify(soloEvaluations));
    await saveSolo(soloId, soloEvaluations[soloId]);
    showToast(`✓ Participant « ${name} » enregistré !`);
  } catch (e) {
    console.error(e);
    showToast("✓ Enregistré en local");
  }

  closeAddSoloModal();
  renderSoloLeaderboard();
  renderSoloKPIs();
  populateCandidateSelect();
}

async function deleteSoloCandidate(soloId) {
  const candidate = soloEvaluations[soloId];
  if (!candidate) return;

  if (confirm(`Supprimer définitivement le candidat solo « ${candidate.name} » ?`)) {
    delete soloEvaluations[soloId];
    updateSolosDirectory();

    try {
      localStorage.setItem('vora_solos', JSON.stringify(soloEvaluations));
      await deleteSolo(soloId);
      showToast("Candidat solo supprimé.");
    } catch (e) {
      console.error(e);
      showToast("Supprimé en local.");
    }

    if (currentSoloId === soloId) {
      currentSoloId = solosDirectory.length > 0 ? solosDirectory[0].id : null;
    }

    renderSoloLeaderboard();
    renderSoloKPIs();
    populateCandidateSelect();
    if (currentCategory === 'solos') {
      loadCandidateData();
    }
  }
}

// ============================================================
// TABLEAU RÉCAPITULATIF DES ÉQUIPES (LEADERBOARD)
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

// ============================================================
// BILAN & ANALYTICS PARTENAIRES
// ============================================================

function renderAnalytics() {
  const teamList = Object.values(evaluations).map(t => {
    const total = calculateTotal(t);
    const isEval = isEvaluated(t);
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
  setCategory('teams');
  currentTeamId = teamId;
  switchView('evaluate');
  loadCandidateData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// EXPORT JSON COMPLET (ÉQUIPES & SOLOS)
// ============================================================

function exportDataJSON() {
  const exporterName = prompt("Votre nom (optionnel) :") || "anonyme";
  const exportPayload = {
    _meta: {
      exportedAt: new Date().toISOString(),
      exportedBy: exporterName,
      totalTeams: TOTAL_TEAMS,
      totalSolos: Object.keys(soloEvaluations).length,
      version: "2.0"
    },
    teams: evaluations,
    solos: soloEvaluations
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `vora_evaluations_globales_${timestamp}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast("💾 Export JSON terminé (Équipes + Solos) !");
}

// ============================================================
// IMPORT JSON
// ============================================================

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const raw = JSON.parse(e.target.result);
      const importedTeams = raw.teams ? raw.teams : (raw.id ? null : raw);
      const importedSolos = raw.solos || {};
      const meta = raw._meta || null;

      if (!importedTeams || typeof importedTeams !== 'object') {
        throw new Error("Format JSON invalide — données d'équipes manquantes.");
      }

      const teamCount = Object.keys(importedTeams).length;
      const soloCount = Object.keys(importedSolos).length;
      if (!confirm(`Importer ${teamCount} équipe(s) et ${soloCount} candidat(s) solo dans Firestore ?\n\nCela fusionnera les données dans la base.`)) {
        event.target.value = '';
        return;
      }

      // Fusion avec le répertoire officiel
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
        solos: importedSolos,
        lastUpdate: new Date().toISOString()
      }, { merge: true });

      evaluations = importedTeams;
      soloEvaluations = importedSolos;
      localStorage.setItem('vora_teams', JSON.stringify(evaluations));
      localStorage.setItem('vora_solos', JSON.stringify(soloEvaluations));
      updateSolosDirectory();

      populateCandidateSelect();
      loadCandidateData();
      updateDisplays();

      // Bandeau de statut
      const banner = document.getElementById('importStatusBanner');
      const bannerText = document.getElementById('importStatusText');
      if (banner && bannerText) {
        const src = meta
          ? ` (de ${meta.exportedBy || '?'}, le ${new Date(meta.exportedAt).toLocaleString('fr-FR')})`
          : '';
        bannerText.textContent = `✅ ${teamCount} équipe(s) et ${soloCount} solo(s) importés dans Firestore${src}`;
        banner.style.display = 'block';
      }

      showToast(`✅ Importation terminée avec succès !`);

      if (document.getElementById('soloView').style.display !== 'none') {
        renderSoloLeaderboard();
        renderSoloKPIs();
      }
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
// EXPORT CSV (ÉQUIPES & SOLOS)
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
  showToast("Exportation CSV équipes terminée !");
}

function exportSoloCSV() {
  let csv = "ID;Candidat;Projet;GitHub;Innovation (/20);Pertinence (/15);Fonctionnalites (/15);Qualite Technique (/15);UI UX (/10);Video Pitch (/10);Impact Faisabilite (/10);GitHub (/5);Total (/100);Mention;Commentaires\n";

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
  showToast("Exportation CSV solos terminée !");
}

function exportCurrentCSV() {
  if (currentCategory === 'teams') {
    exportCSV();
  } else {
    exportSoloCSV();
  }
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

// ============================================================
// EXPOSITION GLOBALE POUR LE HTML (ONCLICK / ONCHANGE)
// ============================================================
window.switchView = switchView;
window.setCategory = setCategory;
window.onCandidateSelected = onCandidateSelected;
window.onTeamSelected = onCandidateSelected; // rétro-compatibilité
window.prevCandidate = prevCandidate;
window.nextCandidate = nextCandidate;
window.prevTeam = prevCandidate; // rétro-compatibilité
window.nextTeam = nextCandidate; // rétro-compatibilité
window.syncScore = syncScore;
window.saveCurrentTeamData = saveCurrentTeamData;
window.resetCurrentCandidateScore = resetCurrentCandidateScore;
window.resetCurrentTeamScore = resetCurrentCandidateScore; // rétro-compatibilité
window.exportDataJSON = exportDataJSON;
window.importDataJSON = importDataJSON;
window.exportCSV = exportCSV;
window.exportSoloCSV = exportSoloCSV;
window.exportCurrentCSV = exportCurrentCSV;
window.selectAndGoToTeam = selectAndGoToTeam;
window.selectAndGoToSolo = selectAndGoToSolo;
window.openAddSoloModal = openAddSoloModal;
window.closeAddSoloModal = closeAddSoloModal;
window.handleSaveSoloModal = handleSaveSoloModal;
window.deleteSoloCandidate = deleteSoloCandidate;