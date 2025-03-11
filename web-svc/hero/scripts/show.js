const heroClassMap = {
    'paladin': {
        cssClass: 'paladin-class',
        flavorText: 'For the light, for the law, for the king!',
    },
    'warrior': {
        cssClass: 'warrior-class',
        flavorText: 'For the glory of the king!',
    },
    'druid': {
        cssClass: 'druid-class',
        flavorText: 'The moon guides my path, and the beasts of the wild are my allies.',
    },
    'hunter': {
        cssClass: 'hunter-class',
        flavorText: 'The wilds are my home, and the beasts of the wild are my friends.',
    },
    'priest': {
        cssClass: 'priest-class',
        flavorText: 'The light of the world is my path, and the darkness is my ally.',
    },
    'warlock': {
        cssClass: 'warlock-class',
        flavorText: 'The dark arts are my path, for I rest in the abyss.',
    },
    'mage': {
        cssClass: 'mage-class',
        flavorText: 'The arcane arts are my path, I must study.',
    },
}

export const showHero = () => {
    const hero = JSON.parse(localStorage.getItem('selectedHero'));
    const heroDetails = document.getElementById('heroDetails');
    const heroNameTitle = document.getElementById('heroNameTitle');
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
        console.log('cancelUpdateHeroButton');
        updateHeroForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showHero();
    handleUpdateHeroButton();
    handleCancelUpdateHeroButton();
});

