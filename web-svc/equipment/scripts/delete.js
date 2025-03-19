import { getAllEquipment } from './index.js';

const deleteEquipment = async (id) => {
    const response = await fetch(`/api/equipment/${id}`, {
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