// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmLXAhtEK-ibd5Ndx2tOP1g7mc-mx5wAk",
  authDomain: "projet-mean-m1-p11-andi-rova.firebaseapp.com",
  projectId: "projet-mean-m1-p11-andi-rova",
  storageBucket: "projet-mean-m1-p11-andi-rova.appspot.com",
  messagingSenderId: "695821037112",
  appId: "1:695821037112:web:eabc48b4efeb80302380cd",
  measurementId: "G-MY3SWVP6S5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);