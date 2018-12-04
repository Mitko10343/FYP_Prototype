/*
//get Data
db.collection('users').get()
    .then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
            console.log(doc.data())
        })
    }).catch((err)=>{
    console.log(err);
});*/
//Upload Data
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(registerForm.pwd.value !== registerForm.c_pwd.value){
        document.getElementById("error_msg").innerText = "Please Enter Matching Passwords";
    }else {
        if(registerForm.pwd.value.length <= 6){
            document.getElementById("error_msg").innerText = "Password must be atleast 6 characters long";
        }else {
            const email = registerForm.email.value;
            const password = registerForm.pwd.value;
            const displayName = registerForm.pwd.value;
            console.log("Document Added");
            firebase.auth().createUserWithEmailAndPassword(email, password).then(()=> {
                const user = firebase.auth().currentUser;
                console.log(user.uid);

                db.collection("users").doc(user.uid).set({
                    display_name: displayName,
                    email: email,
                }).then(() => {
                    registerForm.displayName.value = '';
                    registerForm.pwd.value = '';
                    registerForm.c_pwd.value = '';
                    registerForm.email.value = '';
                    firebase.auth().signOut().then(()=>{
                        console.log("User signed out");
                    }).catch(error=>{
                        console.log(`Error Signing out :  ${error.message}`);
                    });
                }).catch(error => {
                    console.log(`Error ${error.message}`);
                });
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(`Error : ${errorMessage}`);
            });
        }
    }
});