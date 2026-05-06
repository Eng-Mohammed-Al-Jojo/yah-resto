/*----*/

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaSg-DIaOjih_qxK7ZsC9BEE4IochpaK4",
  authDomain: "yah-resto.firebaseapp.com",
  databaseURL: "https://yah-resto-default-rtdb.firebaseio.com",
  projectId: "yah-resto",
  storageBucket: "yah-resto.firebasestorage.app",
  messagingSenderId: "105953829751",
  appId: "1:105953829751:web:50d368f24e9e3dafbab772"
};
const app = initializeApp(firebaseConfig);

// 👇 هذا هو المهم
export const db = getDatabase(app);
export const auth = getAuth(app);
