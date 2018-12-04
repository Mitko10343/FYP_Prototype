const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.pwd.value;

    console.log(`Email : ${email}  and  Password ${password}`);
    firebase.auth().signInWithEmailAndPassword(email, password).then(()=> {
        console.log("User logged in success fully");
        document.getElementById("loginModal").click();
        const user = firebase.auth().currentUser;
        window.location.replace(`http://127.0.0.1:3000/`)
    }).catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(`Error : ${errorMessage}`);
    });

});


