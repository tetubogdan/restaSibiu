document.addEventListener('DOMContentLoaded', async function() {
    const db = firebase.firestore();
    const restaurantsContainer = document.getElementById('restaurants-container');

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
});

function createRestaurantCard(restaurantId, restaurant) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#restaurantModal" onclick="loadRestaurantDetails('${restaurantId}')">
                <img src="${restaurant.banner}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">${restaurant.address}</p>
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
            `;
        } else {
            console.log("Nu s-au găsit detalii pentru restaurantul selectat.");
        }
    } catch (error) {
        console.error("Eroare la încărcarea detaliilor restaurantului: ", error);
    }
}

function generateScheduleHTML(schedule) {
    let scheduleHTML = '<ul>';
    for (let day in schedule) {
        scheduleHTML += `<li>${day.charAt(0).toUpperCase() + day.slice(1)}: ${schedule[day]}</li>`;
    }
    scheduleHTML += '</ul>';
    return scheduleHTML;
}
