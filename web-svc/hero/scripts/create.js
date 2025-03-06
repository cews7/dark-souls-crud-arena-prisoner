import { getHeroes } from './show-all.js';

const handleCreateHeroButton = () => {
    const button = document.getElementById('createHero');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const heroName = document.getElementById('heroName').value;
        const heroLevel = document.getElementById('heroLevel').value;
        const heroClass = document.getElementById('heroClass').value;
        const hero = {
            name: heroName,
            level: heroLevel,
            class: heroClass
        } 
        try {
            const response = await fetch('http://localhost:3000/api/heroes', {
                method: 'POST',
                body: JSON.stringify(hero),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            await response.json();
            document.getElementById('createHeroForm').reset();
            getHeroes();
        } catch (error) {
            console.error('Error:', error);
        }
    })
}

export { handleCreateHeroButton };
