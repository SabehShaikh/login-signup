import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
    getFirestore, collection, getDocs, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVUuHPvmC21MPVUUGsbYr06meDgEWf7b4",
    authDomain: "practicebatch-9.firebaseapp.com",
    projectId: "practicebatch-9",
    storageBucket: "practicebatch-9.appspot.com",
    messagingSenderId: "296255263197",
    appId: "1:296255263197:web:105283560df73d2c55e634"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const userUid = localStorage.getItem("userUid");


const addData = () => {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let name = document.getElementById("name");

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    uid: user.uid,
                });
                localStorage.setItem("userUid", `${user.uid}`)
                window.location.replace("chat.html")
            }
            catch (e) {
                console.log("Error", e)
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errorMessage", errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        });
}


const login = () => {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {

            const user = userCredential.user;
            localStorage.setItem("userUid", `${user.uid}`);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorMessage', errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        });
}

const signInGoggle = () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    about: 'Hello, there',
                    image: user.photoURL,
                });
                localStorage.setItem("userUid", `${user.uid}`)
                window.location.replace("chat.html")
            }
            catch (e) {
                console.log("Error", e)
            }
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorCode', errorCode)
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorCode}`,
            })
        });
}

window.addData = addData;
window.login = login;
window.signInGoggle = signInGoggle;