import { getAllEquipment } from './show-all.js';

export const handleCreateEquipmentButton = () => {
    const submitButton = document.getElementById('createEquipmentSubmit');
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const equipmentName = document.getElementById('equipmentName').value;
        const equipmentType = document.getElementById('equipmentType').value;
        const equipmentMinLevel = document.getElementById('equipmentMinLevel').value;
        if (!equipmentName || !equipmentType || !equipmentMinLevel) {
            alert('Please fill in all required fields for equipment creation');
            return;
        }
        const equipment = {
            name: equipmentName,
            type: equipmentType,
            minLevel: parseInt(equipmentMinLevel)
        }
        try {
            const response = await fetch('http://localhost:3000/api/equipment', {
                method: 'POST',
                body: JSON.stringify(equipment),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            await response.json();
            document.getElementById('createEquipmentForm').reset();
            getAllEquipment();
        } catch (error) {
            console.error('Error:', error);
        }
    })
}