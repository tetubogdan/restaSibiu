firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    // Dacă utilizatorul nu este autentificat, redirecționează către login.html
    window.location.href = 'login.html';
  } else {
    // Utilizatorul este autentificat
    console.log("Utilizatorul este autentificat", user);
  }
});