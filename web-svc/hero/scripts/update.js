import { heroClassMap } from '../utils.js';

const getHero = async () => {
    const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
    const response = await fetch(`http://localhost:3000/api/heroes/${selectedHero.id}`);
    const data = await response.json();
    return data;
}

export const handleUpdateHeroButton = () => {
    const updateHeroForm = document.getElementById('updateHeroForm');
    const updateHeroSubmit = document.getElementById('updateHeroSubmit');
    if (!updateHeroForm || !updateHeroSubmit) return;

    updateHeroSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
        const heroName = document.getElementById('heroName').value;
        const heroLevel = document.getElementById('heroLevel').value;
        const heroClass = document.getElementById('heroClass').value;

        if (!heroName || !heroLevel || !heroClass) {
            alert('Please fill in all fields');
            return;
        }

        const updatedHero = {
            id: selectedHero.id,
            name: heroName,
            level: parseInt(heroLevel),
            class: heroClass
        }

        try {
            const response = await fetch(`http://localhost:3000/api/heroes/${selectedHero.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedHero),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await response.json();
            const data = await getHero();
            const heroDetails = document.getElementById('heroDetails');
            const heroNameTitle = document.getElementById('heroNameTitle');
            const heroFlavor = document.getElementById('heroFlavorText');
            localStorage.setItem('selectedHero', JSON.stringify(data));
            document.getElementById('updateHeroForm').style.display = 'none';
            const classInfo = heroClassMap[data.class] || {
                cssClass: 'unknown-class',
                flavorText: 'a mysterious figure',
            };
            heroNameTitle.innerHTML = data.name;
            heroDetails.innerHTML = `
                <p class="heroLevel">Level: ${data.level}</p>
                <div class="heroClassContainer">
                    <span class="${classInfo.cssClass}">${data.class.toUpperCase()}</span>
                </div>
            `;
            heroFlavor.innerHTML = `<p>${classInfo.flavorText}</p>`;
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    handleUpdateHeroButton();
});