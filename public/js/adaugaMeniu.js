document.addEventListener('DOMContentLoaded', async () => {
    const db = firebase.firestore();
    const restaurantSelect = document.getElementById('restaurantSelect');

    // Încarcă restaurantele din Firestore și adaugă-le în dropdown
    const loadRestaurants = async () => {
        const snapshot = await db.collection('restaurants').get();
        snapshot.forEach(doc => {
            const restaurant = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = restaurant.name;
            restaurantSelect.appendChild(option);
        });
    };

    await loadRestaurants();

    document.getElementById('addMenuItemForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Colectează datele formularului
        const menuItemData = {
            restaurantId: restaurantSelect.value,
            name: document.getElementById('itemName').value.trim(),
            price: parseFloat(document.getElementById('itemPrice').value),
            availability: parseInt(document.getElementById('itemAvailability').value, 10),
            category: document.getElementById('itemCategory').value.trim(),
            discount: parseFloat(document.getElementById('itemDiscount').value) || 0,
            // imageUrl va fi adăugat după încărcarea imaginii
        };

        // Încarcă imaginea, dacă este selectată
        const imageFile = document.getElementById('itemImage').files[0];
        if (imageFile) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`menuItems/${imageFile.name}`);
            await fileRef.put(imageFile);
            menuItemData.imageUrl = await fileRef.getDownloadURL();
        }

        // Adaugă articolul de meniu în Firestore
        try {
            await db.collection('menuItems').add(menuItemData);
            alert('Articolul de meniu a fost adăugat cu succes!');
            // Resetează formularul sau redirecționează utilizatorul
            window.location.reload();
        } catch (error) {
            console.error('Eroare la adăugarea articolului de meniu:', error);
            alert('Eroare la adăugarea articolului de meniu. Încearcă din nou.');
        }
    });
});
