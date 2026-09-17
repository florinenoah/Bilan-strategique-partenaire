// js/config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm7Mu3RjsCpJk6OtjlwQyd5EnXBFJhb5M",
  authDomain: "vora-hackathon.firebaseapp.com",
  projectId: "vora-hackathon",
  storageBucket: "vora-hackathon.firebasestorage.app",
  messagingSenderId: "436228249017",
  appId: "1:436228249017:web:0f13fe9fdf331571bf9268",
  measurementId: "G-0NWRP6N5L8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);