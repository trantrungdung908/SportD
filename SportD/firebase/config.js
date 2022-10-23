import {initializeApp} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  connectFirestoreEmulator,
  initializeFirestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
//ref = reference to the database
import {getDatabase, ref, set, onValue, child, get} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDjKyCGNw7HExSs4KwKNlO43HBGeKiqTmg',
  authDomain: 'sportapp-54c66.firebaseapp.com',
  databaseURL:
    'https://sportapp-54c66-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'sportapp-54c66',
  storageBucket: 'sportapp-54c66.appspot.com',
  appID: '1:1065419826533:android:64517dd5b6cfb9e4c6ed8c',
  messagingSenderId: '1065419826533',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firebaseData = getDatabase();
const databaseStore = getFirestore(app);
// const databaseStore = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
// });
// connectFirestoreEmulator(databaseStore, 'http://localhost', 8081);

export {
  app,
  auth,
  firebaseData,
  databaseStore,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  // real time
  ref,
  set,
  child,
  get,
  onValue,
  // firestore
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  getDoc,
};
