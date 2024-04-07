document.addEventListener('DOMContentLoaded', async function() {
    const db = firebase.firestore();
    const restaurantsContainer = document.querySelector('main .row'); // Asigură-te că selectorul este corect

    // Afișează restaurantele
    try {
        const querySnapshot = await db.collection('restaurants').get();
        querySnapshot.forEach((doc) => {
            const restaurant = doc.data();
            const restaurantCard = createRestaurantCard(doc.id, restaurant);
            restaurantsContainer.innerHTML += restaurantCard;
        });
    } catch (error) {
        console.error("Eroare la încărcarea restaurantelor: ", error);
    }

    // Populează lista de restaurante în sidebar
    try {
        const querySnapshot = await db.collection('restaurants').get();
        const restaurantList = document.getElementById('restaurant-list');
        querySnapshot.forEach((doc) => {
            const restaurant = doc.data();
            const listItem = `
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="loadRestaurantDetails('${doc.id}')">
                        <img src="${restaurant.logo}" alt="${restaurant.name}" style="height: 20px; width: 20px;">
                        ${restaurant.name}
                    </a>
                </li>
            `;
            restaurantList.innerHTML += listItem;
        });
    } catch (error) {
        console.error("Eroare la încărcarea listei de restaurante: ", error);
    }
});

function createRestaurantCard(restaurantId, restaurant) {
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#restaurantModal" onclick="loadRestaurantDetails('${restaurantId}')">
                <img src="${restaurant.banner}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">${restaurant.address}</p>
                    <button class="btn btn-primary">Meniu</button>
                    <button class="btn btn-secondary">Rezervări</button>
                </div>
            </div>
        </div>
    `;
}


async function loadRestaurantDetails(restaurantId) {
    const db = firebase.firestore();
    try {
        const doc = await db.collection('restaurants').doc(restaurantId).get();
        if (doc.exists) {
            const restaurant = doc.data();
            const modalBody = document.querySelector('#restaurantModal .modal-body');
            modalBody.innerHTML = `
            <img src="${restaurant.banner}" class="img-fluid mb-2" alt="${restaurant.name}">
            <h5>${restaurant.name}</h5>
            <p>${restaurant.address}</p>
            <p><b>Program:</b></p>
            ${generateScheduleHTML(restaurant.schedule)}
            <p><a href="${restaurant.googleMaps}" target="_blank">Vezi pe harta</a></p>
            <button class="btn btn-primary">Meniu</button>
            <button class="btn btn-secondary">Rezervări</button>
        `;
        
        } else {
            console.log("Nu s-au găsit detalii pentru restaurantul selectat.");
        }
    } catch (error) {
        console.error("Eroare la încărcarea detaliilor restaurantului: ", error);
    }
}

function generateScheduleHTML(schedule) {
    // Definirea ordinii zilelor săptămânii
    const daysOrder = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];
    
    let scheduleHTML = '<ul>';
    daysOrder.forEach(day => {
        // Convertim prima literă a zilei în literă mică pentru a se potrivi cheilor din obiectul 'schedule'
        let dayKey = day.charAt(0).toLowerCase() + day.slice(1);
        
        // Verificăm dacă există program pentru ziua respectivă în 'schedule'
        if (schedule[dayKey]) {
            scheduleHTML += `<li>${day}: ${schedule[dayKey]}</li>`;
        }
    });
    scheduleHTML += '</ul>';
    return scheduleHTML;
}
