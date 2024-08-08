import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyB5rO1gh8RNGgmsQV6sfzEvN5imBUlEB4Q",
    authDomain: "pantry-tracker-9a1ae.firebaseapp.com",
    projectId: "pantry-tracker-9a1ae",
    storageBucket: "pantry-tracker-9a1ae.appspot.com",
    messagingSenderId: "836995325130",
    appId: "1:836995325130:web:c9af7d98c835e1585b2833",
    measurementId: "G-CW1XBX2RG3"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };