import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHU5ZRqkufdSLf1tpZkFFRTNa4ajxlnHg",
  authDomain: "banco-camera.firebaseapp.com",
  projectId: "banco-camera",
  storageBucket: "banco-camera.appspot.com",
  messagingSenderId: "343361982535",
  appId: "1:343361982535:web:e32ded712ef201576f6162",
  measurementId: "G-PWPL28HT61"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
