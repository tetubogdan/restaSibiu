document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

// Dupa login reusit
firebase.auth().signInWithEmailAndPassword(email, password)
.then((userCredential) => {
    // Redirectionare catre admin.html dupa login reusit
    window.location.href = 'admin.html';
})
.catch((error) => {
    console.error('Eroare de autentificare:', error);
    alert('Eroare la login: ' + error.message);
});
