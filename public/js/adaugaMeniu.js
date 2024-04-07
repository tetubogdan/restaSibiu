document.addEventListener('DOMContentLoaded', async () => {
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();

    const restaurantSelect = document.getElementById('restaurantSelect');
    const form = document.getElementById('addMenuItemForm');

    // Încarcă restaurantele pentru a le selecta
    const loadRestaurants = async () => {
        const querySnapshot = await db.collection('restaurants').get();
        querySnapshot.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            restaurantSelect.appendChild(option);
        });
    };

    loadRestaurants();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                alert('Te rugăm să te autentifici înainte de a adăuga un articol de meniu.');
                return;
            }

            const menuItemData = {
                restaurantId: restaurantSelect.value,
                name: document.getElementById('itemName').value.trim(),
                price: parseFloat(document.getElementById('itemPrice').value),
                availability: parseInt(document.getElementById('itemAvailability').value, 10),
                category: document.getElementById('itemCategory').value.trim(),
                discount: parseFloat(document.getElementById('itemDiscount').value) || 0,
            };

            const imageFile = document.getElementById('itemImage').files[0];
            if (imageFile) {
                const fileRef = storageRef.child(`menuItems/${Date.now()}_${imageFile.name}`);
                await fileRef.put(imageFile);
                menuItemData.imageUrl = await fileRef.getDownloadURL();
            }

            try {
                await db.collection('menuItems').add(menuItemData);
                alert('Articolul de meniu a fost adăugat cu succes!');
                form.reset(); // Sau redirecționează utilizatorul după succes
            } catch (error) {
                console.error('Eroare la adăugarea articolului de meniu:', error);
                alert('Eroare la adăugarea articolului de meniu: ' + error.message);
            }
        });
    });
});
