// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdfXATgxLwUQB-mwDgR2HbD65Wf9GZ9oo",
  authDomain: "pantry-app-28a47.firebaseapp.com",
  projectId: "pantry-app-28a47",
  storageBucket: "pantry-app-28a47.appspot.com",
  messagingSenderId: "103981018158",
  appId: "1:103981018158:web:65d3feba7114d12f88c3bf",
  measurementId: "G-WX02STW5VY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
