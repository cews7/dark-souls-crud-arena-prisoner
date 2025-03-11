import { heroClassMap } from '../utils.js';

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

    const updateHeroForm = document.getElementById('updateHeroForm');
    if (updateHeroForm) {
        updateHeroForm.style.display = 'none';
    }

};

export const handleUpdateHeroButton = () => {
    const updateHeroButton = document.getElementById('updateHeroButton');
    if (!updateHeroButton) return;
    
    updateHeroButton.addEventListener('click', () => {
        const updateHeroForm = document.getElementById('updateHeroForm');
        updateHeroForm.style.display = 'block';
        
        const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
        const heroName = document.getElementById('heroName');
        const heroLevel = document.getElementById('heroLevel');
        const heroClass = document.getElementById('heroClass');

        heroName.value = selectedHero.name;
        heroLevel.value = selectedHero.level;
        heroClass.value = selectedHero.class;
    });
}

export const handleCancelUpdateHeroButton = () => {
    const cancelUpdateHeroButton = document.getElementById('cancelUpdateHeroButton');
    if (!cancelUpdateHeroButton) return;

    cancelUpdateHeroButton.addEventListener('click', () => {
        const updateHeroForm = document.getElementById('updateHeroForm');
        updateHeroForm.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showHero();
    handleUpdateHeroButton();
    handleCancelUpdateHeroButton();
});

