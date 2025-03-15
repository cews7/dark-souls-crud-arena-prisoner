import { getAllEquipment } from './show-all.js';

const deleteEquipment = async (id) => {
    const response = await fetch(`http://localhost:3000/api/equipment/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });
    if (response.ok) {
        getAllEquipment();
    }
}

export const handleDeleteEquipmentButton = (id) => {
    deleteEquipment(id);
}