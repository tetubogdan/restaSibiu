document.addEventListener('DOMContentLoaded', function() {
    const addStaticRestaurants = async () => {
        const restaurantElements = document.querySelectorAll('.card');

        // Definește programul standard
        const standardSchedule = {
            luni: '10:00 - 22:00',
            marti: '10:00 - 22:00',
            miercuri: '10:00 - 22:00',
            joi: '10:00 - 22:00',
            vineri: '10:00 - 22:00',
            sambata: '10:00 - 22:00',
            duminica: '10:00 - 22:00'
        };

        for (const element of restaurantElements) {
            const name = element.querySelector('.card-title').textContent;
            const description = element.querySelector('.card-text').textContent;
            const imageUrl = element.querySelector('.card-img-top').src;

            // Completați restul datelor restaurantului
            const restaurantData = {
                name: name,
                address: '', // Adresă lipsă în datele statice
                city: '', // Oraș lipsă în datele statice
                county: '', // Județ lipsă în datele statice
                googleMaps: '', // Link Google Maps lipsă
                description: description,
                logo: imageUrl, // Utilizăm imaginea ca logo
                banner: imageUrl, // Utilizăm aceeași imagine ca banner
                schedule: standardSchedule // Programul standard
            };

            // Încercarea de adăugare a restaurantului în Firestore folosind logica existentă
            try {
                const restaurantRef = await firebase.firestore().collection('restaurants').add(restaurantData);
                console.log("Restaurant adăugat cu ID: ", restaurantRef.id);
            } catch (error) {
                console.error('Eroare la adăugarea restaurantului:', error);
            }
        }
    };

    // Autentificarea și apelul funcției
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Utilizator autentificat", user);
            addStaticRestaurants();
        } else {
            console.log("Niciun utilizator autentificat");
            alert('Te rugăm să te autentifici înainte de a adăuga un restaurant.');
        }
    });
});
