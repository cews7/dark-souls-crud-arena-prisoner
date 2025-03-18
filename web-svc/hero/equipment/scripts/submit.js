const addEquipmentToHero = async (heroId, equipmentIds) => {
    const response = await fetch(`/api/heroes/${heroId}/equipment`, {
        method: 'POST',
        body: JSON.stringify({ equipmentIds, heroId })
    });
    const data = await response.json();
    return data;
}

const deleteEquipmentFromHero = async (heroId, equipmentIds) => {
    const response = await fetch(`/api/heroes/${heroId}/equipment`, {
        method: 'DELETE',
        body: JSON.stringify({ equipmentIds, heroId }),
    });
    const data = await response.json();
    return data;
}

const getEquipmentForHero = async (heroId) => {
    const response = await fetch(`/api/heroes/${heroId}/equipment`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

export const handleEquipmentSelectionSubmitButton = () => {
    const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
    const equipmentSelectionSubmitButton = document.getElementById('equipmentSelectionSubmitButton');
    const availableEquipmentList = document.getElementById('availableEquipmentListContainer');
    const equipmentModal = document.getElementById('equipmentModal');
    const noEquipmentMessage = document.getElementById('noEquipmentMessage');
    const heroHasNoEquipmentMessage = document.getElementById('heroHasNoEquipmentMessage');
    if (!equipmentSelectionSubmitButton || !availableEquipmentList) return;

    equipmentSelectionSubmitButton.addEventListener('click', async () => {
        const equipmentIdsToDelete = Array.from(availableEquipmentList.querySelectorAll('input:not(:checked)')).map(equipment => equipment.id);
        const equipmentIdsToAdd = Array.from(availableEquipmentList.querySelectorAll('input:checked')).map(equipment => equipment.id);

        await deleteEquipmentFromHero(selectedHero.id, equipmentIdsToDelete);
 
        await addEquipmentToHero(selectedHero.id, equipmentIdsToAdd);

        const data = await getEquipmentForHero(selectedHero.id);

        localStorage.setItem(`heroEquipment-${selectedHero.id}`, JSON.stringify(data));

        const heroEquipment = JSON.parse(localStorage.getItem(`heroEquipment-${selectedHero.id}`));

        const heroEquipmentList = document.getElementById('heroEquipmentList');

        if (heroEquipmentList) {
            heroEquipmentList.innerHTML = '';
        }
        // we don't have to check for null because we are setting heroEquipment-:id in localStorage and will always have an empty array if no equipment is selected
        if (heroEquipment.length > 0) {
            heroEquipmentList.innerHTML = heroEquipment
                .filter(equipment => equipment.hero_id === selectedHero.id)
                .map(equipment => `<li>${equipment.name}</li>`)
                .join('');
        }
        heroHasNoEquipmentMessage.innerHTML = '';

        if (heroEquipment.length === 0) {
            heroHasNoEquipmentMessage.innerHTML = `<p>${selectedHero.name} has no equipment</p>`;
        }

        availableEquipmentList.textContent = '';
        noEquipmentMessage.textContent = '';
        equipmentModal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleEquipmentSelectionSubmitButton();
});