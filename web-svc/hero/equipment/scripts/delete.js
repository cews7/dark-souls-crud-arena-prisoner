const deleteEquipmentFromHero = async (heroId, equipmentIds) => {
    const response = await fetch(`/api/heroes/${heroId}/equipment`, {
        method: 'DELETE',
        body: JSON.stringify({ equipmentIds, heroId }),
    });
    return response.json();
}

export const handleEquipmentDeleteButton = async (heroId, equipmentIds) => {
    const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
    const equipmentSelectionSubmitButton = document.getElementById('equipmentSelectionSubmitButton');
    const availableEquipmentList = document.getElementById('availableEquipmentListContainer');

    if (!equipmentSelectionSubmitButton || !availableEquipmentList) return;

    equipmentSelectionSubmitButton.addEventListener('click', async () => {
        const equipmentIds = Array.from(availableEquipmentList.querySelectorAll('input:not(:checked)')).map(equipment => equipment.id);
        await deleteEquipmentFromHero(selectedHero.id, equipmentIds); 
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleEquipmentDeleteButton();
});