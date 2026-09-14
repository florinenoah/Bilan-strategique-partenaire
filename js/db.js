// js/db.js
import { db, auth } from './config.js';
import {
  doc, getDoc, setDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Un seul document Firestore contient toutes les évaluations
const DOC_REF = doc(db, "hackathon", "evaluations");

/**
 * Charge toutes les évaluations depuis Firestore.
 * Retourne null si le document n'existe pas encore.
 */
export async function loadAllEvaluations() {
  const snap = await getDoc(DOC_REF);
  if (!snap.exists()) return null;
  return snap.data().teams || null;
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
 * Écoute les changements en temps réel.
 * La vitrine se met à jour automatiquement.
 */
export function subscribeToChanges(callback) {
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data().teams || {});
    }
  });
}

// Auth
export { signInWithEmailAndPassword, onAuthStateChanged, signOut, auth };