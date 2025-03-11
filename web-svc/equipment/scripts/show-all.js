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
            equipmentItem.innerHTML = `<h4>${equipment.name}</h4> <p>Type: ${equipment.type}</p> <p>Min Level: ${equipment.minLevel}</p>`;

            equipmentItem.addEventListener('click', () => {
                localStorage.setItem('selectedEquipment', JSON.stringify(equipment));
                window.location.href = `/equipment/${equipment.id}`;
            });
            equipmentList.appendChild(equipmentItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export { getAllEquipment };