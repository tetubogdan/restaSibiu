document.getElementById('addRestaurantForm').addEventListener('submit', function(event) {
    event.preventDefault();

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log("Utilizator autentificat", user);
            // Continuă cu procesul de adăugare a restaurantului, acum că știm că utilizatorul este autentificat
            await addRestaurant();
        } else {
            console.log("Niciun utilizator autentificat");
            alert('Te rugăm să te autentifici înainte de a adăuga un restaurant.');
        }
    });
});

async function addRestaurant() {
    // Colectează datele formularului
    const restaurantData = {
        name: document.getElementById('restaurantName').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        county: document.getElementById('county').value.trim(),
        googleMaps: document.getElementById('googleMaps').value.trim(),
        // Programul și imaginile vor fi adăugate mai jos
    };

    // Validează datele de intrare
    if (!restaurantData.name || !restaurantData.city) {
        alert('Numele restaurantului și orașul sunt obligatorii.');
        return;
    }

    // Obține referințele pentru fișierele selectate
    const logoFile = document.getElementById('logo').files[0];
    const bannerFile = document.getElementById('banner').files[0];

    try {
        // Încarcă logo-ul și banner-ul, dacă sunt selectate
        const logoUrl = logoFile ? await uploadFile(logoFile, 'logos') : '';
        const bannerUrl = bannerFile ? await uploadFile(bannerFile, 'banners') : '';

        // Adaugă URL-urile la obiectul restaurantData
        restaurantData.logo = logoUrl;
        restaurantData.banner = bannerUrl;

        // Adaugă programul
        restaurantData.schedule = collectScheduleData();

        // Încercare de adăugare a restaurantului în Firestore
        const restaurantRef = await firebase.firestore().collection('restaurants').add(restaurantData);
        
        console.log("Restaurant adăugat cu ID: ", restaurantRef.id);
        alert('Restaurant adăugat cu succes!');
        window.location.href = 'index.html'; // Sau orice altă logica de post-adăugare
    } catch (error) {
        console.error('Eroare la adăugarea restaurantului:', error);
        alert('Eroare la adăugarea restaurantului: ' + error.message);
    }
}


async function uploadFile(file, path) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`${path}/${file.name}`);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
}

function collectScheduleData() {
    const daysOfWeek = ['luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata', 'duminica'];
    
    const schedule = {};
    daysOfWeek.forEach(day => {
        const start = document.getElementById(`${day}Start`).value;
        const end = document.getElementById(`${day}End`).value;
        schedule[day] = `${start} - ${end}`;
    });
    return schedule;
}
