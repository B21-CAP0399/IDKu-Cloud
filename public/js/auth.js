document.addEventListener("DOMContentLoaded", (event) => {
  // auth section
  const auth = firebase.auth();
  const loginForm = document.querySelector(".login");
  const btnSignOut = document.querySelector("#sign-out");
  const body = document.querySelector("body");
  const content = document.querySelector("main.content");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);

      document.querySelector(".form-signin")
        .classList.add("d-none");

      body.classList.remove("login-state");

      content.classList.remove("d-none");
    } else {
      document.querySelector(".form-signin")
        .classList.remove("d-none");

      body.classList.add("login-state");

      content.classList.add("d-none");
    }
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("loggedIn", user);
        document.querySelector(".uname")
          .innerHTML = userCredential.user.email;
        loginForm.reset();
      })
      .catch((error) => {
        loginForm.querySelector(".error").innerHTML = error.message;
      });


    if (firebase.auth().currentUser != null) {
      loginForm.style.display = "none";
    }
  });
});
