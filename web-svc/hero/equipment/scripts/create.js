const addEquipmentToHero = async (heroId, equipmentIds) => {
    const response = await fetch(`http://localhost:3000/api/heroes/${heroId}/equipment`, {
        method: 'POST',
        body: JSON.stringify({ equipmentIds, heroId })
    });
    const data = await response.json();
    return data;
}

export const handleEquipmentSelectionSubmitButton = () => {
    const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
    const equipmentSelectionSubmitButton = document.getElementById('equipmentSelectionSubmitButton');
    const availableEquipmentList = document.getElementById('availableEquipmentListContainer');

    if (!equipmentSelectionSubmitButton || !availableEquipmentList) return;

    equipmentSelectionSubmitButton.addEventListener('click', async () => {
        const equipmentIds = Array.from(availableEquipmentList.querySelectorAll('input:checked')).map(equipment => equipment.id);
        await addEquipmentToHero(selectedHero.id, equipmentIds); 
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleEquipmentSelectionSubmitButton();
});