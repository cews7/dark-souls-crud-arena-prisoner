import { handleDeleteEquipmentButton } from './delete.js';


const getAllEquipment = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/equipment');
        const data = await response.json();
        localStorage.setItem('equipment', JSON.stringify(data));
        const equipmentList = document.getElementById('equipmentList');
        equipmentList.innerHTML = '';
        data.forEach(equipment => {
            const equipmentItem = document.createElement('div');
            equipmentItem.classList.add('equipmentItem');
            equipmentItem.innerHTML = `<h4>${equipment.name}</h4> <p>Type: ${equipment.type}</p> <p>Min Level: ${equipment.minLevel}</p>
            <p>Status: ${equipment.hero_id ? 'Equipped' : 'Available'}</p>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            ${!equipment.hero_id ? `<button id="deleteEquipmentButton-${equipment.id}" class="delete-btn">
            <i class="fas fa-fire"></i> Delete
            </button>` : ''}
            `;
            equipmentList.appendChild(equipmentItem);
            
            const deleteEquipmentButton = document.getElementById(`deleteEquipmentButton-${equipment.id}`);

            if (deleteEquipmentButton) {
                deleteEquipmentButton.addEventListener('click', () => {
                    handleDeleteEquipmentButton(equipment.id);
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export { getAllEquipment };