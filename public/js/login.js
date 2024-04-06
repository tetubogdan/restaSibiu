document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Login reușit
        alert('Autentificare reușită!');
        // Redirecționează utilizatorul după login, de exemplu, către pagina principală
        window.location.href = 'index.html'; // Schimbă 'homepage.html' cu pagina dorită
    })
    .catch((error) => {
        console.error('Eroare de autentificare:', error);
        alert('Eroare la login: ' + error.message);
    });
});
