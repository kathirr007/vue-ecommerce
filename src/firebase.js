import firebase from '@firebase/app'
import 'firebase/firestore'
// import 'firebase/firebase-auth'
import 'firebase/storage'
// Initialize Firebase

const config = {
  apiKey: "AIzaSyDH4B4bAzj27wzQo3eDNr4GDCtUJNBeD-Q",
  authDomain: "vue-shop-2afb5.firebaseapp.com",
  databaseURL: "https://vue-shop-2afb5.firebaseio.com",
  projectId: "vue-shop-2afb5",
  storageBucket: "vue-shop-2afb5.appspot.com",
  messagingSenderId: "943641830410",
  appId: "1:943641830410:web:d52b0748e8306fb3042bf3",
  measurementId: "G-58R5JQSWJQ"
};

const fb = firebase.initializeApp(config);

const db = firebase.firestore();

export {fb,db}
