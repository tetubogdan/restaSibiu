document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const fullname = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const dob = document.getElementById('register-dob').value;

    // Verifică dacă parolele se potrivesc
    if (password !== passwordConfirm) {
        alert('Parolele nu se potrivesc.');
        return;
    }

    // Verifică dacă există deja un utilizator cu același username sau telefon
    try {
        const usersRef = firebase.firestore().collection('users');
        const usernameQuery = await usersRef.where('username', '==', username).get();
        if (!usernameQuery.empty) {
            throw new Error('Username-ul este deja utilizat.');
        }

        const phoneQuery = await usersRef.where('phone', '==', phone).get();
        if (!phoneQuery.empty) {
            throw new Error('Numărul de telefon este deja utilizat.');
        }

        // Dacă totul este în regulă, continuă cu crearea contului
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await usersRef.doc(user.uid).set({
            username: username,
            fullname: fullname,
            phone: phone,
            dob: dob,
            email: email // O opțiune, dacă dorești să păstrezi emailul și în Firestore
        });

        alert('Utilizator înregistrat cu succes!');
        // Redirecționează utilizatorul sau curăță formularul
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Eroare la înregistrarea utilizatorului:', error);
        alert('Eroare la înregistrare: ' + error.message);
    }
});
