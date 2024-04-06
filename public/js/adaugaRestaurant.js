document.getElementById('addRestaurantForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Colectează datele formularului
    const restaurantData = {
        name: document.getElementById('restaurantName').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        county: document.getElementById('county').value.trim(),
        googleMaps: document.getElementById('googleMaps').value.trim(),
        // Programul va fi adăugat mai târziu după validare
    };

    // Validarea datelor de intrare
    if (!restaurantData.name || !restaurantData.city) {
        alert('Numele restaurantului și orașul sunt obligatorii.');
        return;
    }

    const storageRef = firebase.storage().ref();
    const logoFile = document.getElementById('logo').files[0]; // Preia fișierul logo
    const bannerFile = document.getElementById('banner').files[0]; // Preia fișierul banner

    try {
        // Încărcarea logo-ului și banner-ului, dacă sunt selectate
        const logoUrl = logoFile ? await uploadFile(logoFile, 'logos') : '';
        const bannerUrl = bannerFile ? await uploadFile(bannerFile, 'banners') : '';

        // Adaugă URL-urile la obiectul restaurantData
        restaurantData.logo = logoUrl;
        restaurantData.banner = bannerUrl;

        // Adaugă programul
        const schedule = collectScheduleData();
        restaurantData.schedule = schedule;

        // Adaugă restaurantul în colecția de restaurante
        const restaurantRef = await firebase.firestore().collection('restaurants').add(restaurantData);
        
        console.log("Restaurant adăugat cu ID: ", restaurantRef.id);
        alert('Restaurant adăugat cu succes!');
        window.location.href = 'index.html'; // Modifică aceasta după necesități
    } catch (error) {
        console.error('Eroare la adăugarea restaurantului:', error);
        alert('Eroare la adăugarea restaurantului: ' + error.message);
    }
});

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
