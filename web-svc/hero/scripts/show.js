import { heroClassMap } from '../utils.js';

const getAllEquipment = async () => {
    const response = await fetch(`http://localhost:3000/api/equipment`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

export const showHero = () => {
    const hero = JSON.parse(localStorage.getItem('selectedHero'));
    const heroDetails = document.getElementById('heroDetails');
    const heroNameTitle = document.getElementById('heroNameTitle');
    const heroFlavor = document.getElementById('heroFlavorText');
    if (!heroDetails || !heroNameTitle) return;

    const classInfo = heroClassMap[hero.class] || {
        cssClass: 'unknown-class',
        flavorText: 'a mysterious figure',
    };

    heroNameTitle.innerHTML = hero.name;
    heroDetails.innerHTML = `
        <p class="heroLevel">Level: ${hero.level}</p>
        <div class="heroClassContainer">
            <span class="${classInfo.cssClass}">${hero.class.toUpperCase()}</span>
        </div>
    `;
    heroFlavor.innerHTML = `<p>${classInfo.flavorText}</p>`;


    const flavorText = document.getElementById('heroFlavorText');

    if (flavorText) {
        flavorText.innerHTML = `<p>${classInfo.flavorText}</p>`;
    }

    const equipmentModal = document.getElementById('equipmentModal');
    if (equipmentModal) {
        equipmentModal.style.display = 'none';
    }

    const updateHeroDetailsForm = document.getElementById('updateHeroDetailsForm');
    if (updateHeroDetailsForm) {
        updateHeroDetailsForm.style.display = 'none';
    }

};

export const handleBrowseEquipmentButton = () => {
    const browseEquipmentButton = document.getElementById('browseEquipmentButton');
    if (!browseEquipmentButton) return;

    browseEquipmentButton.addEventListener('click', async () => {
        const equipmentModal = document.getElementById('equipmentModal');
        equipmentModal.style.display = 'block';

        
        const equipment = await getAllEquipment();
         console.log(equipment);
    });
}

export const handleUpdateHeroDetailsButton = () => {
    const updateHeroDetailsButton = document.getElementById('updateHeroDetailsButton');
    if (!updateHeroDetailsButton) return;
    
    updateHeroDetailsButton.addEventListener('click', () => {
        const updateHeroDetailsForm = document.getElementById('updateHeroDetailsForm');
        updateHeroDetailsForm.style.display = 'block';
        
        const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
        const heroName = document.getElementById('heroName');
        const heroLevel = document.getElementById('heroLevel');
        const heroClass = document.getElementById('heroClass');

        heroName.value = selectedHero.name;
        heroLevel.value = selectedHero.level;
        heroClass.value = selectedHero.class;
    });
}

export const handleCancelUpdateHeroDetailsButton = () => {
    const cancelUpdateHeroDetailsButton = document.getElementById('cancelUpdateHeroDetailsButton');
    if (!cancelUpdateHeroDetailsButton) return;

    cancelUpdateHeroDetailsButton.addEventListener('click', () => {
        const updateHeroDetailsForm = document.getElementById('updateHeroDetailsForm');
        updateHeroDetailsForm.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showHero();
    handleUpdateHeroDetailsButton();
    handleCancelUpdateHeroDetailsButton();
    handleBrowseEquipmentButton();
});

