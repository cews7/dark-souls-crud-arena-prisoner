import { getHeroes } from './index.js';

export const handleCreateHeroButton = () => {
    const submitButton = document.getElementById('createHeroSubmit');
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const heroName = document.getElementById('heroName').value;
        const heroLevel = document.getElementById('heroLevel').value;
        const heroClass = document.getElementById('heroClass').value;
        if (!heroName || !heroLevel || !heroClass) {
            alert('Please fill in all required fields for hero creation');
            return;
        }
        const hero = {
            name: heroName,
            level: parseInt(heroLevel),
            class: heroClass
        } 
        try {
            const response = await fetch('/api/heroes', {
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

