// js/db.js
import { db, auth } from './config.js';
import {
  doc, getDoc, setDoc, onSnapshot, deleteField
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Un seul document Firestore contient toutes les évaluations
const DOC_REF = doc(db, "hackathon", "evaluations");

/**
 * Charge toutes les évaluations (équipes et solos) depuis Firestore.
 * Retourne null si le document n'existe pas encore.
 */
export async function loadAllEvaluations() {
  const snap = await getDoc(DOC_REF);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    teams: data.teams || {},
    solos: data.solos || {}
  };
}

/**
 * Sauvegarde UNE équipe sans écraser les autres.
 * Utilise merge:true + écriture partielle par teamId.
 */
export async function saveTeam(teamId, teamData) {
  await setDoc(DOC_REF, {
    teams: { [teamId]: teamData },
    lastUpdate: new Date().toISOString()
  }, { merge: true });
}

/**
 * Sauvegarde UN candidat solo sans écraser les autres.
 * Utilise merge:true + écriture partielle par soloId.
 */
export async function saveSolo(soloId, soloData) {
  await setDoc(DOC_REF, {
    solos: { [soloId]: soloData },
    lastUpdate: new Date().toISOString()
  }, { merge: true });
}

/**
 * Supprime UN candidat solo de Firestore.
 */
export async function deleteSolo(soloId) {
  await setDoc(DOC_REF, {
    solos: { [soloId]: deleteField() },
    lastUpdate: new Date().toISOString()
  }, { merge: true });
}

/**
 * Écoute les changements en temps réel (équipes et solos).
 * La vitrine et l'admin se mettent à jour automatiquement.
 */
export function subscribeToChanges(callback) {
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({
        teams: data.teams || {},
        solos: data.solos || {}
      });
    }
  });
}

// Auth
export { signInWithEmailAndPassword, onAuthStateChanged, signOut, auth };